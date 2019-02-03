// @flow
import {
  EditorState,
  convertFromRaw,
  convertToRaw,
  CompositeDecorator,
} from "draft-js";
import type { RawDraftContentState } from "draft-js/lib/RawDraftContentState";
import type { DraftDecorator } from "draft-js/lib/DraftDecorator";
import type { DraftDecoratorType } from "draft-js/lib/DraftDecoratorType";

const EMPTY_CONTENT_STATE = null;

export default {
  createEditorState(
    rawContentState: ?RawDraftContentState,
    decorators: Array<DraftDecorator>,
  ) {
    // Draft.js flow types are inconsistent with the documented usage of this API.
    // See https://github.com/facebook/draft-js/issues/1585.
    // $FlowFixMe
    const compositeDecorator: DraftDecoratorType = new CompositeDecorator(
      decorators,
    );
    let editorState;

    if (rawContentState) {
      const contentState = convertFromRaw(rawContentState);
      editorState = EditorState.createWithContent(
        contentState,
        compositeDecorator,
      );
    } else {
      editorState = EditorState.createEmpty(compositeDecorator);
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
