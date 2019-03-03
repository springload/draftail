// @flow
import React from "react";
import type { Component, Node } from "react";
import { ContentBlock, EditorState, Modifier } from "draft-js";

import { ToolbarButton } from "../../lib";

const BREAK_ICON =
  "M0 16h4v2h-4zM6 16h6v2h-6zM14 16h4v2h-4zM20 16h6v2h-6zM28 16h4v2h-4zM27.5 0l0.5 14h-24l0.5-14h1l0.5 12h20l0.5-12zM4.5 32l-0.5-12h24l-0.5 12h-1l-0.5-10h-20l-0.5 10zM0 512h128v64H0v-64zm192 0h192v64H192v-64zm256 0h128v64H448v-64zm192 0h192v64H640v-64zm256 0h128v64H896v-64zM880 0l16 448H128L144 0h32l16 384h640L848 0h32zM144 1024l-16-384h768l-16 384h-32l-16-320H192l-16 320h-32z";

const insertSectionBreak = (editorState: EditorState) => {
  const content = editorState.getCurrentContent();

  const selection = editorState.getSelection();
  let newContent = Modifier.splitBlock(content, selection);
  const blockMap = newContent.getBlockMap();
  const blockKey = selection.getStartKey();
  const insertedBlockKey = newContent.getKeyAfter(blockKey);

  const newBlock = blockMap.get(insertedBlockKey).set("type", "section-break");

  newContent = newContent.merge({
    blockMap: blockMap.set(insertedBlockKey, newBlock),
  });

  return EditorState.push(editorState, newContent, "split-block");
};

type Props = {|
  getEditorState: () => EditorState,
  onChange: (EditorState) => void,
|};

export const SectionBreakControl = ({ getEditorState, onChange }: Props) => (
  <ToolbarButton
    name="SECTION_BREAK_CONTROL"
    icon={BREAK_ICON}
    title="Section break"
    onClick={() => {
      onChange(insertSectionBreak(getEditorState()));
    }}
  />
);

type SectionBreakProps = { isFocused: boolean };

const SectionBreak = ({ isFocused }: SectionBreakProps) => (
  <div
    className={`SectionBreak SectionBreak--${
      isFocused ? "focused" : "unfocused"
    }`}
  >
    <span className="SectionBreak__label">Section break</span>
  </div>
);

const sectionBreakPlugin = (config: {|
  decorator: ((props: SectionBreakProps) => Node) => Component<{}>,
|}) => {
  const component = config.decorator(SectionBreak);

  return {
    blockRendererFn(block: ContentBlock) {
      if (block.getType() === "section-break") {
        return {
          component,
          editable: false,
        };
      }

      return null;
    },
  };
};

export default sectionBreakPlugin;
