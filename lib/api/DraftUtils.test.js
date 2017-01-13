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

    describe('#getSelectedBlock', () => {
        it('exists', () => {
            expect(DraftUtils.getSelectedBlock).toBeDefined();
        });
    });

    describe('#isSelectedBlockType', () => {
        it('exists', () => {
            expect(DraftUtils.isSelectedBlockType).toBeDefined();
        });

        it('finds correct block type', () => {
            const contentBlocks = convertFromHTML('<h1>aaaaaaaaaa</h1>');
            const contentState = ContentState.createFromBlockArray(contentBlocks);
            let editorState = EditorState.createWithContent(contentState);
            const updatedSelection = editorState.getSelection().merge({
                anchorOffset: 3,
                focusOffset: 5,
            });
            const entityKey = Entity.create('LINK', 'MUTABLE', { url: 'www.testing.com' });
            editorState = RichUtils.toggleLink(editorState, updatedSelection, entityKey);
            expect(DraftUtils.isSelectedBlockType(editorState, 'header-one')).toBeTruthy();
        });

        it('does not find wrong block type', () => {
            const contentBlocks = convertFromHTML('<h1>aaaaaaaaaa</h1>');
            const contentState = ContentState.createFromBlockArray(contentBlocks);
            let editorState = EditorState.createWithContent(contentState);
            const updatedSelection = editorState.getSelection().merge({
                anchorOffset: 3,
                focusOffset: 5,
            });
            const entityKey = Entity.create('LINK', 'MUTABLE', { url: 'www.testing.com' });
            editorState = RichUtils.toggleLink(editorState, updatedSelection, entityKey);
            expect(DraftUtils.isSelectedBlockType(editorState, 'header-two')).toBeFalsy();
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
