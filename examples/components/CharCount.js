// @flow
import React from "react";
import { EditorState } from "draft-js";

type Props = {|
  getEditorState: () => EditorState,
  // eslint-disable-next-line @thibaudcolas/cookbook/react/require-default-props
  maxLength?: ?number,
|};

// const countParagraphs = (str) => (str ? str.match(/\n+/g).length + 1 : 0);
// const countSentences = (str) =>
//   str ? (str.match(/[.?!…]+./g) || []).length + 1 : 0;
// const countWords = (str) =>
//   str ? (str.replace(/['";:,.?¿\-!¡]+/g, "").match(/\S+/g) || []).length : 0;
/**
 * Count characters in a string, with special processing to account for astral symbols in UCS-2. See:
 * - https://github.com/RadLikeWhoa/Countable/blob/master/Countable.js#L29
 * - https://mathiasbynens.be/notes/javascript-unicode
 */
const countChars = (str) => {
  if (str) {
    // Impossible for `match` to be null here since this matches all characters.
    // $FlowFixMe
    return str.match(/./gu).length;
  }

  return 0;
};

/**
 * Shows the editor’s character count, with a calculation of unicode characters
 * matching that of `maxlength` attributes.
 */
const CharCount = ({ getEditorState, maxLength = null }: Props) => {
  const editorState = getEditorState();
  const content = editorState.getCurrentContent();
  const text = content.getPlainText();
  // $FlowFixMe
  const suffix = typeof maxLength !== "undefined" ? `/${maxLength}` : "";

  return (
    <div className="Draftail-ToolbarButton CharCount">{`${countChars(
      text,
    )}${suffix}`}</div>
  );
};

export default CharCount;
