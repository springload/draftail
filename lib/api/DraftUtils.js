import {
    EditorState,
    Modifier,
    SelectionState,
    AtomicBlockUtils,
    CharacterMetadata,
} from 'draft-js';

import DraftUtils from 'draftjs-utils';

import { BLOCK_TYPE, ENTITY_TYPE } from '../api/constants';

/**
 * Wrapper around draftjs-utils, with our custom functions.
 */
export default {
    getSelectionEntity: DraftUtils.getSelectionEntity.bind(DraftUtils),

    getEntityRange: DraftUtils.getEntityRange.bind(DraftUtils),

    handleNewLine: DraftUtils.handleNewLine.bind(DraftUtils),

    addLineBreakRemovingSelection: DraftUtils.addLineBreakRemovingSelection.bind(
        DraftUtils,
    ),

    getSelectedBlock: DraftUtils.getSelectedBlock.bind(DraftUtils),

    getAllBlocks: DraftUtils.getAllBlocks.bind(DraftUtils),

    /**
     * Creates a selection for the entirety of an entity that can be partially selected.
     */
    getSelectedEntitySelection(editorState) {
        const selectionState = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const entityKey = this.getSelectionEntity(editorState);
        const entityRange = this.getEntityRange(editorState, entityKey);
        const anchorKey = selectionState.getAnchorKey();
        const block = contentState.getBlockForKey(anchorKey);
        const blockKey = block.getKey();

        return new SelectionState({
            anchorOffset: entityRange.start,
            anchorKey: blockKey,
            focusOffset: entityRange.end,
            focusKey: blockKey,
            isBackward: false,
            hasFocus: selectionState.getHasFocus(),
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
        const nextState = AtomicBlockUtils.insertAtomicBlock(
            editorState,
            entityKey,
            ' ',
        );

        return nextState;
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
            selectionAfter: selectionState.merge({
                anchorOffset: 0,
                focusOffset: 0,
            }),
        });
        return EditorState.push(
            editorState,
            newContentState,
            'change-block-type',
        );
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
                type !== BLOCK_TYPE.UNSTYLED &&
                type !== BLOCK_TYPE.ATOMIC &&
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
     * Reset all entity types (images, links, documents, embeds) that are unavailable.
     * Meant to be used after a paste of unconstrained content.
     */
    normalizeEntityType(editorState, enabledTypes) {
        let contentState = editorState.getCurrentContent();
        let blockMap = contentState.getBlockMap();

        const isValidEntity = char => {
            let isValid = true;
            const entityKey = char.getEntity();
            if (entityKey !== null) {
                const entityType = contentState.getEntity(entityKey).getType();
                if (enabledTypes.indexOf(entityType) === -1) {
                    isValid = false;
                }
            }
            return isValid;
        };

        const isValidAtomicBlock = block => {
            // Remove invalid image and document blocks if not enabled
            let isValidBlock = true;
            block.findEntityRanges(
                char => {
                    isValidBlock = isValidEntity(char);
                },
                () => {},
            );
            return isValidBlock;
        };

        const isValidInline = block => {
            let altered = false;

            const chars = block.getCharacterList().filter(char => {
                let newChar = char;
                if (!isValidEntity(char)) {
                    altered = true;
                    newChar = CharacterMetadata.applyEntity(newChar, null);
                }
                return newChar;
            });

            return altered ? block.set('characterList', chars) : block;
        };

        blockMap = blockMap.filter(isValidAtomicBlock);
        const blocks = blockMap.map(isValidInline);
        blockMap = blockMap.merge(blocks);
        contentState = contentState.merge({ blockMap });

        let newEditorState = EditorState.set(editorState, {
            currentContent: contentState,
        });

        // TODO: instead of moving selection and focus to the end, move it to previous block,
        // if the last block in the paste selection was removed.
        newEditorState = EditorState.moveSelectionToEnd(newEditorState);
        newEditorState = EditorState.moveFocusToEnd(newEditorState);
        return newEditorState;
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
};
