import React from "react";
import { EditorState, Modifier } from "draft-js";

import { EntitySourceProps } from "../../src";

class EmojiSource extends React.Component<EntitySourceProps> {
  componentDidMount() {
    const { editorState, onComplete } = this.props;

    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const newContent = Modifier.replaceText(
      content,
      selection,
      "🙂",
      undefined,
      undefined,
    );
    const nextState = EditorState.push(
      editorState,
      newContent,
      "insert-characters",
    );

    onComplete(nextState);
  }

  render() {
    return null;
  }
}

export default EmojiSource;
