// @flow
import React from "react";
import { EditorState } from "draft-js";

type Props = {|
  getEditorState: () => EditorState,
|};

/**
 * Shows the editor’s character count, with a calculation of unicode characters
 * matching that of `maxlength` attributes.
 */
const CharCount = ({ getEditorState }: Props) => {
  const editorState = getEditorState();
  const content = editorState.getCurrentContent();
  const text = content.getPlainText();
  return <span>{text ? text.match(/./gu).length : 0}</span>;
};

export default CharCount;
