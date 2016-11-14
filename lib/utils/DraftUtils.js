import {
    EditorState,
    Entity,
    CharacterMetadata,
    genKey,
    BlockMapBuilder,
    ContentBlock,
    Modifier,
    SelectionState,
} from 'draft-js';

import { List, Repeat } from 'immutable';

import DraftUtils from 'draftjs-utils';

/**
 * Wrapper around draftjs-utils, with our custom functions.
 * import DraftUtils from '../utils/DraftUtils';
 */
export default {
    getSelectionEntity: DraftUtils.getSelectionEntity.bind(DraftUtils),

    getEntityRange: DraftUtils.getEntityRange.bind(DraftUtils),

    getEntityData: (entityKey) => {
        const entity = Entity.get(entityKey);
        return entity.getData();
    },

    /**
     * Returns the type of the block the current selection starts in.
     */
    getSelectedBlockType: (editorState) => {
        const selectionState = editorState.getSelection();
        const contentState = editorState.getCurrentContent();
        const startKey = selectionState.getStartKey();
        const block = contentState.getBlockForKey(startKey);

        return block.type;
    },

    /**
     * Creates a selection for the entirety of an entity that can be partially selected.
     */
    getSelectedEntitySelection: (editorState) => {
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

    hasCurrentInlineStyle: (editorState, style) => {
        const currentStyle = editorState.getCurrentInlineStyle();

        return currentStyle.has(style);
    },

    // TODO Document.
    insertBlock: (editorState, entityKey, character, blockType) => {
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();

        const afterRemoval = Modifier.removeRange(contentState, selectionState, 'backward');

        const targetSelection = afterRemoval.getSelectionAfter();
        const afterSplit = Modifier.splitBlock(afterRemoval, targetSelection);
        const insertionTarget = afterSplit.getSelectionAfter();

        const asAtomicBlock = Modifier.setBlockType(afterSplit, insertionTarget, blockType);

        const charData = CharacterMetadata.create({ entity: entityKey });

        const fragmentArray = [
            new ContentBlock({
                key: genKey(),
                type: blockType,
                text: character,
                characterList: List(Repeat(charData, character.length)),
            }),
            new ContentBlock({
                key: genKey(),
                type: 'unstyled',
                text: '',
                characterList: List(),
            }),
        ];

        const fragment = BlockMapBuilder.createFromArray(fragmentArray);

        const withBlock = Modifier.replaceWithFragment(asAtomicBlock, insertionTarget, fragment);

        const newContent = withBlock.merge({
            selectionBefore: selectionState,
            selectionAfter: withBlock.getSelectionAfter().set('hasFocus', true),
        });

        return EditorState.push(editorState, newContent, 'insert-fragment');
    },

    // TODO Document.
    createEntity: (editorState, entityType, entityData, entityText, entityMutability = 'IMMUTABLE') => {
        const entityKey = Entity.create(entityType, entityMutability, entityData);

        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        let nextContentState;

        if (selection.isCollapsed()) {
            nextContentState = Modifier.insertText(contentState, editorState.getSelection(), entityText, null, entityKey);
        } else {
            nextContentState = Modifier.replaceText(contentState, editorState.getSelection(), entityText, null, entityKey);
        }

        const nextState = EditorState.push(editorState, nextContentState, 'insert');
        return nextState;
    },
};
