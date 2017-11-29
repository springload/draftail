import { EditorState, Modifier, AtomicBlockUtils } from 'draft-js';

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

    handleNewLine: DraftUtils.handleNewLine.bind(DraftUtils),

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
                // TODO Is this meant to be removing styles?
                null,
                entityKey,
            );
        } else {
            nextContentState = Modifier.replaceText(
                contentState,
                selection,
                entityText,
                // TODO Is this meant to be removing styles?
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
            selectionAfter: selectionState.merge({
                anchorOffset: 0,
                focusOffset: 0,
            }),
        });

        return EditorState.set(editorState, {
            currentContent: newContentState,
        });
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
     * Meant to be used after a paste of non-constrained list items.
     */
    normaliseBlockDepth(editorState, maxListNesting) {
        let contentState = editorState.getCurrentContent();
        let blockMap = contentState.getBlockMap();
        const blocks = blockMap
            .filter(block => block.getDepth() > maxListNesting)
            .map(block => block.set('depth', maxListNesting));

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
