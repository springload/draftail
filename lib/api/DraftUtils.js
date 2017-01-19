import {
    EditorState,
    Entity,
    Modifier,
    SelectionState,
    AtomicBlockUtils,
} from 'draft-js';

import DraftUtils from 'draftjs-utils';

import { ENTITY_TYPE } from '../api/constants';

/**
 * Wrapper around draftjs-utils, with our custom functions.
 */
export default {
    getSelectionEntity: DraftUtils.getSelectionEntity.bind(DraftUtils),

    getEntityRange: DraftUtils.getEntityRange.bind(DraftUtils),

    handleNewLine: DraftUtils.handleNewLine.bind(DraftUtils),

    addLineBreakRemovingSelection: DraftUtils.addLineBreakRemovingSelection.bind(DraftUtils),

    getSelectedBlock: DraftUtils.getSelectedBlock.bind(DraftUtils),

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

    // TODO Document.
    createEntity(editorState, entityType, entityData, entityText, entityMutability = 'IMMUTABLE') {
        const entityKey = Entity.create(entityType, entityMutability, entityData);

        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        let nextContentState;

        if (selection.isCollapsed()) {
            nextContentState = Modifier.insertText(contentState, selection, entityText, null, entityKey);
        } else {
            nextContentState = Modifier.replaceText(contentState, selection, entityText, null, entityKey);
        }

        const nextState = EditorState.push(editorState, nextContentState, 'insert');

        return nextState;
    },

    addHorizontalRuleRemovingSelection(editorState) {
        const entityKey = Entity.create(ENTITY_TYPE.HORIZONTAL_RULE, 'IMMUTABLE', {});
        const nextState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');

        return nextState;
    },

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
        return EditorState.push(editorState, newContentState, 'change-block-type');
    },
};
