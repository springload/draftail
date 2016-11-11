import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';

export default {
    // Serialised RawDraftContentState => EditorState.
    createEditorState(serialisedState, decorators) {
        const rawState = JSON.parse(serialisedState);
        let editorState;

        if (rawState && Object.keys(rawState).length !== 0) {
            const contentState = convertFromRaw(rawState);
            editorState = EditorState.createWithContent(contentState, decorators);
        } else {
            editorState = EditorState.createEmpty(decorators);
        }

        return editorState;
    },

    // EditorState => Serialised RawDraftContentState.
    serialiseEditorState(editorState) {
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState);

        const isEmpty = rawContent.blocks.every((block) => {
            return block.text.trim().length === 0
                && block.entityRanges.length === 0
                && block.inlineStyleRanges.length === 0;
        });

        return JSON.stringify(isEmpty ? {} : rawContent);
    },
};
