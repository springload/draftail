import {
    EditorState,
    convertFromRaw,
    convertToRaw,
    CompositeDecorator,
} from 'draft-js';

export default {
    // RawDraftContentState + decorators => EditorState.
    createEditorState(rawContentState, decorators = []) {
        const compositeDecorator = new CompositeDecorator(decorators);
        let editorState;

        if (rawContentState && Object.keys(rawContentState).length !== 0) {
            const contentState = convertFromRaw(rawContentState);
            editorState = EditorState.createWithContent(contentState, compositeDecorator);
        } else {
            editorState = EditorState.createEmpty(compositeDecorator);
        }

        return editorState;
    },

    // EditorState => RawDraftContentState.
    serialiseEditorState(editorState) {
        const contentState = editorState.getCurrentContent();
        const rawContentState = convertToRaw(contentState);

        const isEmpty = rawContentState.blocks.every((block) => {
            return block.text.trim().length === 0
                && block.entityRanges.length === 0
                && block.inlineStyleRanges.length === 0;
        });

        return isEmpty ? {} : rawContentState;
    },
};
