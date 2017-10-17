import {
    EditorState,
    Modifier,
    AtomicBlockUtils,
    CharacterMetadata,
} from 'draft-js';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';

import DraftUtils from 'draftjs-utils';

import { BLOCK_TYPE, ENTITY_TYPE } from '../api/constants';

/**
 * Wrapper around draftjs-utils, with our custom functions.
 * https://github.com/jpuri/draftjs-utils
 *
 * DraftUtils functions are utility helpers useful in isolation, specific to the Draft.js API,
 * without ties to Draftail's specific behavior or other APIs.
 */
export default {
    getSelectionEntity: DraftUtils.getSelectionEntity.bind(DraftUtils),

    getEntityRange: DraftUtils.getEntityRange.bind(DraftUtils),

    addLineBreakRemovingSelection: DraftUtils.addLineBreakRemovingSelection.bind(
        DraftUtils,
    ),

    getSelectedBlock: DraftUtils.getSelectedBlock.bind(DraftUtils),

    getAllBlocks: DraftUtils.getAllBlocks.bind(DraftUtils),

    /**
     * Creates a selection on a given entity in the currently selected block.
     */
    getEntitySelection(editorState, entityKey) {
        const selectionState = editorState.getSelection();
        const entityRange = this.getEntityRange(editorState, entityKey);

        return selectionState.merge({
            anchorOffset: entityRange.start,
            focusOffset: entityRange.end,
        });
    },

    /**
     * Checks that the current selection has the given style.
     */
    hasCurrentInlineStyle(editorState, style) {
        const currentStyle = editorState.getCurrentInlineStyle();

        return currentStyle.has(style);
    },

    /**
     * Checks that the current selection is inside a block of the given type.
     */
    isSelectedBlockType(editorState, type) {
        const block = this.getSelectedBlock(editorState);

        return block && block.type === type;
    },

    // TODO Refactor to be a shortcut rather than use `Modifier`.
    createEntity(
        editorState,
        entityType,
        entityData,
        entityText,
        entityMutability = 'IMMUTABLE',
    ) {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const contentStateWithEntity = contentState.createEntity(
            entityType,
            entityMutability,
            entityData,
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        let nextContentState;

        if (selection.isCollapsed()) {
            nextContentState = Modifier.insertText(
                contentState,
                selection,
                entityText,
                null,
                entityKey,
            );
        } else {
            nextContentState = Modifier.replaceText(
                contentState,
                selection,
                entityText,
                null,
                entityKey,
            );
        }

        const nextState = EditorState.push(
            editorState,
            nextContentState,
            'insert',
        );

        return nextState;
    },

    /**
     * Inserts a horizontal rule in the place of the current selection.
     * Returns updated EditorState.
     * Inspired by DraftUtils.addLineBreakRemovingSelection.
     */
    addHorizontalRuleRemovingSelection(editorState) {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            ENTITY_TYPE.HORIZONTAL_RULE,
            'IMMUTABLE',
            {},
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    },

    /**
     * Changes a block type to be `newType`. Other attributes of the block
     * can also be changed at the same time with `overrides`.
     */
    resetBlockWithType(editorState, newType, overrides = {}) {
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const key = selectionState.getStartKey();
        const blockMap = contentState.getBlockMap();
        const block = blockMap.get(key);
        const newBlock = block.mergeDeep(overrides, {
            type: newType,
            data: {},
        });
        const newContentState = contentState.merge({
            blockMap: blockMap.set(key, newBlock),
        });
        const newSelectionState = selectionState.merge({
            anchorOffset: 0,
            focusOffset: 0,
        });

        return EditorState.acceptSelection(
            EditorState.set(editorState, {
                currentContent: newContentState,
            }),
            newSelectionState,
        );
    },

    /**
     * Removes the block at the given key.
     */
    removeBlock(editorState, key) {
        const currentContent = editorState.getCurrentContent();
        const blockMap = currentContent.getBlockMap().remove(key);

        return EditorState.set(editorState, {
            currentContent: currentContent.merge({
                blockMap: blockMap,
            }),
        });
    },

    hasNoSelectionStartEntity(selection, block) {
        const startOffset = selection.getStartOffset();

        return block.getEntityAt(startOffset) === null;
    },

    insertTextWithoutEntity(editorState, text) {
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const style = editorState.getCurrentInlineStyle();

        const newContent = Modifier.insertText(
            currentContent,
            selection,
            text,
            style,
            null,
        );

        return EditorState.push(editorState, newContent, 'insert-characters');
    },

    /**
     * Reset the depth of all the content to be at most maxListNesting.
     * Meant to be used after a paste of unconstrained content.
     */
    normaliseBlockDepth(editorState, maxListNesting) {
        let contentState = editorState.getCurrentContent();
        let blockMap = contentState.getBlockMap();
        const blocks = blockMap
            .filter(block => block.getDepth() > maxListNesting)
            .map(block => block.set('depth', maxListNesting));

        // TODO Optimise so this runs only if there are changed blocks.
        blockMap = blockMap.merge(blocks);
        contentState = contentState.merge({ blockMap });

        // Use an immutable `set` instead of the `push` API to prevent undo.
        return EditorState.set(editorState, {
            currentContent: contentState,
        });
    },

    /**
     * Reset all blocks that use unavailable types to unstyled.
     * Meant to be used after a paste of unconstrained content.
     */
    normaliseBlockType(editorState, enabledBlockTypes) {
        let contentState = editorState.getCurrentContent();
        let blockMap = contentState.getBlockMap();

        const shouldNormaliseType = block => {
            const type = block.getType();
            return (
                // TODO Should handle atomic blocks separately.
                type !== BLOCK_TYPE.UNSTYLED &&
                enabledBlockTypes.indexOf(type) === -1
            );
        };

        const blocks = blockMap
            .filter(shouldNormaliseType)
            .map(block => block.set('type', BLOCK_TYPE.UNSTYLED));

        // TODO Optimise so this runs only if there are changed blocks.
        blockMap = blockMap.merge(blocks);
        contentState = contentState.merge({ blockMap });

        // Use an immutable `set` instead of the `push` API to prevent undo.
        return EditorState.set(editorState, {
            currentContent: contentState,
        });
    },

    /**
     * Remove all styles that use unavailable types.
     * Meant to be used after a paste of unconstrained content.
     */
    normaliseInlineStyle(editorState, enabledTypes) {
        let contentState = editorState.getCurrentContent();
        let blockMap = contentState.getBlockMap();

        const blocks = blockMap.map(block => {
            let altered = false;

            const chars = block.getCharacterList().map(char => {
                let newChar = char;

                char
                    .getStyle()
                    .filter(type => enabledTypes.indexOf(type) === -1)
                    .forEach(type => {
                        altered = true;
                        newChar = CharacterMetadata.removeStyle(newChar, type);
                    });

                return newChar;
            });

            return altered ? block.set('characterList', chars) : block;
        });

        blockMap = blockMap.merge(blocks);
        contentState = contentState.merge({ blockMap });

        // Use an immutable `set` instead of the `push` API to prevent undo.
        return EditorState.set(editorState, {
            currentContent: contentState,
        });
    },

    /**
     * Get an entity decorator strategy based on the given entity type.
     * This strategy will find all entities of the given type.
     */
    getEntityTypeStrategy(entityType) {
        const strategy = (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges(character => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === entityType
                );
            }, callback);
        };

        return strategy;
    },

    /**
     * Determines whether the editor should show its placeholder.
     * See https://draftjs.org/docs/api-reference-editor.html#placeholder
     * for details on why this is useful.
     */
    shouldHidePlaceholder(editorState) {
        const contentState = editorState.getCurrentContent();
        return (
            contentState.hasText() ||
            contentState
                .getBlockMap()
                .first()
                .getType() !== BLOCK_TYPE.UNSTYLED
        );
    },

    originalHandleNewLine: DraftUtils.handleNewLine.bind(DraftUtils),

    /**
     * Rely on DraftUtils for soft newlines, and hard newlines that do not fall
     * in the special "defer breaking out of the block" case.
     * See https://github.com/springload/draftail/issues/104,
     * https://github.com/jpuri/draftjs-utils/issues/10.
     */
    handleNewLine(editorState, event) {
        if (isSoftNewlineEvent(event)) {
            return this.originalHandleNewLine(editorState, event);
        }

        const content = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const key = selection.getStartKey();
        const offset = selection.getStartOffset();
        const block = content.getBlockForKey(key);

        const isDeferredBreakoutBlock = [BLOCK_TYPE.CODE].includes(
            block.getType(),
        );

        if (isDeferredBreakoutBlock) {
            const isEmpty =
                selection.isCollapsed() &&
                offset === 0 &&
                block.getLength() === 0;

            if (isEmpty) {
                return EditorState.push(
                    editorState,
                    Modifier.setBlockType(
                        content,
                        selection,
                        BLOCK_TYPE.UNSTYLED,
                    ),
                    'change-block-type',
                );
            }

            return false;
        }

        return this.originalHandleNewLine(editorState, event);
    },
};
