import {
  EditorState,
  convertFromHTML,
  ContentState,
  convertToRaw,
} from 'draft-js';
import conversion from '../api/conversion';

const stubContent = {
    entityMap: {},
    blocks: [
        {
            key: '1dcqo',
            text: 'Hello, World!',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
        {
            key: 'dmtba',
            text: 'This is a title',
            type: 'header-two',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        },
    ],
};

describe('conversion', () => {
    describe('#createEditorState', () => {
        it('exists', () => {
            expect(conversion.createEditorState).toBeDefined();
        });

        it('creates empty state from empty content', () => {
            const state = conversion.createEditorState({});
            const result = convertToRaw(state.getCurrentContent());
            expect(result.blocks.length).toEqual(1);
            expect(result.blocks[0].text).toEqual('');
        });

        it('creates state from real content', () => {
            const state = conversion.createEditorState(stubContent);
            const result = convertToRaw(state.getCurrentContent());
            expect(result.blocks.length).toEqual(2);
            expect(result.blocks[0].text).toEqual('Hello, World!');
        });
    });

    describe('#serialiseEditorState', () => {
        it('exists', () => {
            expect(conversion.serialiseEditorState).toBeDefined();
        });

        it('keeps real content', () => {
            const state = conversion.createEditorState(stubContent);
            expect(conversion.serialiseEditorState(state)).toEqual(stubContent);
        });

        it('discards empty content', () => {
            const state = conversion.createEditorState({});
            expect(conversion.serialiseEditorState(state)).toEqual({});
        });

        it('discards content with only empty text', () => {
            const contentBlocks = convertFromHTML('<h1> </h1>');
            const contentState = ContentState.createFromBlockArray(contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            expect(conversion.serialiseEditorState(editorState)).toEqual({});
        });
    });
});
