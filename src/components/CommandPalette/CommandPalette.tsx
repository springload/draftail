import React, { useState } from "react";

import DraftUtils from "../../api/DraftUtils";
import CommandComboBox from "./CommandComboBox";

const CommandPalette = ({
  textDirectionality,
  blockTypes,
  getEditorState,
  currentBlock,
  currentBlockKey,
  onCompleteSource,
}) => {
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
      currentBlock={currentBlock}
      currentBlockKey={currentBlockKey}
      match={text.replace("/", "")}
      getEditorState={getEditorState}
      onCompleteSource={onCompleteSource}
    />
  );
};

export default CommandPalette;
