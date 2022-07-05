import React from "react";
import { EditorState } from "draft-js";

type Props = {
  getEditorState: () => EditorState;
  maxLength?: number | null;
};

// const countParagraphs = (str) => (str ? str.match(/\n+/g).length + 1 : 0);
// const countSentences = (str) =>
//   str ? (str.match(/[.?!…]+./g) || []).length + 1 : 0;
// const countWords = (str) =>
//   str ? (str.replace(/['";:,.?¿\-!¡]+/g, "").match(/\S+/g) || []).length : 0;
/**
 * Count characters in a string, with special processing to account for astral symbols in UCS-2. See:
 * - https://github.com/RadLikeWhoa/Countable/blob/master/Countable.js#L29
 * - https://mathiasbynens.be/notes/javascript-unicode
 * - https://github.com/tc39/proposal-intl-segmenter
 */
export const countChars = (text: string) => {
  if (text) {
    // Find as many matches as there are (g), matching newlines as characters (s), as unicode code points (u).
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags.
    const matches = text.match(/./gsu);
    return matches ? matches.length : 0;
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
  const suffix = maxLength ? `/${maxLength}` : "";

  return (
    <div className="Draftail-ToolbarButton CharCount">{`${countChars(
      text,
    )}${suffix}`}</div>
  );
};

export default CharCount;
