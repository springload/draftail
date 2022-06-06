import React from "react";
import { EditorState, RichUtils } from "draft-js";
import { BLOCK_TYPE } from "../../lib";
type Props = {
  getEditorState: () => EditorState;
  onChange: (arg0: EditorState) => void;
};

/**
 * A traditional text style picker.
 */
const BlockPicker = ({ getEditorState, onChange }: Props) => {
  const editorState = getEditorState();
  return (
    <select
      onChange={(e) => {
        const selection = editorState.getSelection();
        let nextState = editorState;
        nextState = RichUtils.toggleBlockType(nextState, e.target.value);
        nextState = EditorState.forceSelection(nextState, selection);
        onChange(nextState);
      }}
      style={{
        maxWidth: "3rem",
      }}
    >
      {[
        [BLOCK_TYPE.HEADER_TWO, "H2"],
        [BLOCK_TYPE.HEADER_THREE, "H3"],
        [BLOCK_TYPE.HEADER_FOUR, "H4"],
        ["tiny-text", "ₜᵢₙᵧ"],
        [BLOCK_TYPE.UNSTYLED, "¶"],
      ].map(([type, label]) => (
        <option key={type} value={type}>
          {label}
        </option>
      ))}
    </select>
  );
};

export default BlockPicker;