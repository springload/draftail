import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';

export default {
    // RawDraftContentState + decorators => EditorState.
    createEditorState(rawContentState, decorators) {
        let editorState;

        if (rawContentState && Object.keys(rawContentState).length !== 0) {
            const contentState = convertFromRaw(rawContentState);
            editorState = EditorState.createWithContent(contentState, decorators);
        } else {
            editorState = EditorState.createEmpty(decorators);
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
