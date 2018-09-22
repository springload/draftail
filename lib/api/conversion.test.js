import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import conversion from './conversion';

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
        it('creates state from real content', () => {
            const state = conversion.createEditorState(stubContent, []);
            const result = convertToRaw(state.getCurrentContent());
            expect(result.blocks.length).toEqual(2);
            expect(result.blocks[0].text).toEqual('Hello, World!');
        });
    });

    describe('#serialiseEditorState', () => {
        it('keeps real content', () => {
            const state = conversion.createEditorState(stubContent, []);
            expect(conversion.serialiseEditorState(state)).toEqual(stubContent);
        });

        it('discards empty content', () => {
            const state = conversion.createEditorState(null, []);
            expect(conversion.serialiseEditorState(state)).toBeNull();
        });

        it('discards content with only empty text', () => {
            const editorState = EditorState.createWithContent(
                convertFromRaw({
                    entityMap: {},
                    blocks: [
                        {
                            key: 'a',
                            text: '',
                        },
                    ],
                }),
            );
            expect(conversion.serialiseEditorState(editorState)).toBeNull();
        });
    });
});
