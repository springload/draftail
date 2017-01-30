import {
  EditorState,
  convertFromHTML,
  ContentState,
  convertToRaw,
} from 'draft-js';
import conversion from '../api/conversion';

const stubs = {
    emptyContent: {},
    realContent: {
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
    },
};

describe('conversion', () => {
    describe('#createEditorState', () => {
        it('exists', () => {
            expect(conversion.createEditorState).toBeDefined();
        });

        it('creates empty state from empty content', () => {
            const state = conversion.createEditorState(stubs.emptyContent);
            const result = convertToRaw(state.getCurrentContent());
            expect(result.blocks.length).toEqual(1);
            expect(result.blocks[0].text).toEqual('');
        });

        it('creates state from real content', () => {
            const state = conversion.createEditorState(stubs.realContent);
            const result = convertToRaw(state.getCurrentContent());
            expect(result.blocks.length).toEqual(2);
            expect(result.blocks[0].text).toEqual('Hello, World!');
        });
    });

    describe('#serialiseEditorState', () => {
        it('exists', () => {
            expect(conversion.serialiseEditorState).toBeDefined();
        });

        it('discards empty content', () => {
            const state = conversion.createEditorState(stubs.emptyContent);
            expect(conversion.serialiseEditorState(state)).toEqual({});
        });

        it('keeps real content', () => {
            const state = conversion.createEditorState(stubs.realContent);
            expect(conversion.serialiseEditorState(state)).toEqual(stubs.realContent);
        });

        it('discards content with only empty text', () => {
            const contentBlocks = convertFromHTML('<h1> </h1>');
            const contentState = ContentState.createFromBlockArray(contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            expect(conversion.serialiseEditorState(editorState)).toEqual({});
        });
    });
});
