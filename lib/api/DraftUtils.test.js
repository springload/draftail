import {
  Entity,
  RichUtils,
  EditorState,
  convertFromHTML,
  ContentState,
  SelectionState,
} from 'draft-js';

import DraftUtils from '../api/DraftUtils';

describe('DraftUtils', () => {
    describe('#getSelectionEntity', () => {
        it('exists', () => {
            expect(DraftUtils.getSelectionEntity).toBeDefined();
        });
    });

    describe('#getEntityRange', () => {
        it('exists', () => {
            expect(DraftUtils.getEntityRange).toBeDefined();
        });
    });

    describe('#handleNewLine', () => {
        it('exists', () => {
            expect(DraftUtils.handleNewLine).toBeDefined();
        });
    });

    describe('#addLineBreakRemovingSelection', () => {
        it('exists', () => {
            expect(DraftUtils.addLineBreakRemovingSelection).toBeDefined();
        });
    });

    describe('#getEntityData', () => {
        it('exists', () => {
            expect(DraftUtils.getEntityData).toBeDefined();
        });

        it('returns entity data', () => {
            const contentBlocks = convertFromHTML('<h1>aaaaaaaaaa</h1>');
            const contentState = ContentState.createFromBlockArray(contentBlocks);
            let editorState = EditorState.createWithContent(contentState);
            const updatedSelection = editorState.getSelection().merge({
                anchorOffset: 0,
                focusOffset: 10,
            });
            const entityKey = Entity.create('LINK', 'MUTABLE', { url: 'www.testing.com' });
            editorState = RichUtils.toggleLink(editorState, updatedSelection, entityKey);
            expect(DraftUtils.getEntityData(entityKey)).toEqual({ url: 'www.testing.com' });
        });
    });

    describe('#getSelectedBlockType', () => {
        it('exists', () => {
            expect(DraftUtils.getSelectedBlockType).toBeDefined();
        });

        it('returns selected block type', () => {
            const contentBlocks = convertFromHTML('<h1>aaaaaaaaaa</h1>');
            const contentState = ContentState.createFromBlockArray(contentBlocks);
            let editorState = EditorState.createWithContent(contentState);
            const updatedSelection = editorState.getSelection().merge({
                anchorOffset: 2,
                focusOffset: 5,
            });
            const entityKey = Entity.create('LINK', 'MUTABLE', { url: 'www.testing.com' });
            editorState = RichUtils.toggleLink(editorState, updatedSelection, entityKey);
            expect(DraftUtils.getSelectedBlockType(editorState)).toEqual('header-one');
        });
    });

    describe('#getSelectedEntitySelection', () => {
        it('exists', () => {
            expect(DraftUtils.getSelectedEntitySelection).toBeDefined();
        });

        it('returns selected entity selection', () => {
            const contentBlocks = convertFromHTML('<h1>aaaaaaaaaa</h1>');
            const contentState = ContentState.createFromBlockArray(contentBlocks);
            let editorState = EditorState.createWithContent(contentState);
            const updatedSelection = editorState.getSelection().merge({
                anchorOffset: 3,
                focusOffset: 5,
            });
            const entityKey = Entity.create('LINK', 'MUTABLE', { url: 'www.testing.com' });
            editorState = RichUtils.toggleLink(editorState, updatedSelection, entityKey);
            expect(DraftUtils.getSelectedEntitySelection(editorState)).toBeInstanceOf(SelectionState);
        });
    });
});
