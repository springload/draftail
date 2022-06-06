import React, { useState } from "react";

import DraftUtils from "../../api/DraftUtils";
import CommandComboBox from "./CommandComboBox";

const CommandPalette = ({ textDirectionality, blockTypes, getEditorState }) => {
  const commands = blockTypes;
  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const block = DraftUtils.getSelectedBlock(editorState);
  const text = block.getText();

  if (!text.startsWith("/")) {
    return null;
  }

  return (
    <CommandComboBox
      blockTypes={blockTypes}
      match={text.replace("/", "")}
      getEditorState={getEditorState}
    />
  );
};

export default CommandPalette;
