import {
  Entity,
  RichUtils,
  EditorState,
  convertFromHTML,
  ContentState,
} from 'draft-js';

import * as DraftUtils from '../utils/DraftUtils';

describe('DraftUtils', () => {
    describe('#getEntityData', () => {
        it('exists', () => {
            expect(DraftUtils.getEntityData).toBeDefined();
        });

        it('should return entity data', () => {
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

        it('should return entity data', () => {
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
});
