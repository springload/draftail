// @flow
import React from "react";
import readingTime from "reading-time";
import { EditorState } from "draft-js";

import { ToolbarButton } from "../../lib";

const CLOCK_ICON =
  "M658.744 749.256l-210.744-210.746v-282.51h128v229.49l173.256 173.254zM512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 896c-212.078 0-384-171.922-384-384s171.922-384 384-384c212.078 0 384 171.922 384 384s-171.922 384-384 384z";

type Props = {|
  getEditorState: () => EditorState,
|};

/**
 * A basic control showing the reading time / content length for the editor’s content.
 */
const ReadingTime = ({ getEditorState }: Props) => {
  const editorState = getEditorState();
  const content = editorState.getCurrentContent();
  const text = content.getPlainText();
  const stats = readingTime(text);
  return (
    <ToolbarButton
      name="READING_TIME"
      icon={CLOCK_ICON}
      label={`${stats.text} (${text.length})`}
      onClick={() => {
        // eslint-disable-next-line no-alert
        window.alert(`${text.length} characters, ${stats.words} words`);
      }}
    />
  );
};

export default ReadingTime;
