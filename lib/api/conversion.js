// @flow
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import type { RawDraftContentState } from "draft-js/lib/RawDraftContentState";

const EMPTY_CONTENT_STATE = null;

export default {
  createEditorState(rawContentState: ?RawDraftContentState) {
    let editorState;

    if (rawContentState) {
      const contentState = convertFromRaw(rawContentState);
      editorState = EditorState.createWithContent(contentState);
    } else {
      editorState = EditorState.createEmpty();
    }

    return editorState;
  },

  serialiseEditorState(editorState: EditorState) {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);

    const isEmpty = rawContentState.blocks.every((block) => {
      const isEmptyBlock =
        block.text.trim().length === 0 &&
        (!block.entityRanges || block.entityRanges.length === 0) &&
        (!block.inlineStyleRanges || block.inlineStyleRanges.length === 0);
      return isEmptyBlock;
    });

    return isEmpty ? EMPTY_CONTENT_STATE : rawContentState;
  },
};
