import React, { Component, useState, useRef, useEffect } from "react";
import Tippy from "@tippyjs/react";
import { getVisibleSelectionRect, RichUtils } from "draft-js";

import ComboBox from "../Toolbar/BlockToolbar/ComboBox";

const getReferenceClientRect = () => getVisibleSelectionRect(window);
type FakeRect = ReturnType<typeof getVisibleSelectionRect>;

const CommandComboBox = ({
  textDirectionality,
  currentBlockKey,
  currentBlock,
  blockTypes,
  match,
  getEditorState,
  onCompleteSource,
}) => {
  const commands = blockTypes.map((t) => ({
    ...t,
    onSelect: () => {
      return RichUtils.toggleBlockType(getEditorState(), t.type);
    },
  }));
  const tippyParentRef = useRef<HTMLDivElement>(null);
  const [selectionRect, setSelectionRect] = useState<FakeRect | null>(null);

  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const isCollapsed = selection.isCollapsed();

  useEffect(() => {
    if (isCollapsed) {
      setSelectionRect(getReferenceClientRect());
    } else {
      setSelectionRect(null);
    }
  }, [isCollapsed]);

  const isVisible = isCollapsed && Boolean(selectionRect);

  return (
    <div
      className={`Draftail-CommandPalette Draftail-CommandPalette--${
        isVisible ? "open" : "closed"
      }`}
    >
      <div ref={tippyParentRef} />
      {isVisible ? (
        <Tippy
          visible={isVisible}
          getReferenceClientRect={() => selectionRect as DOMRect}
          maxWidth="100%"
          interactive
          arrow={false}
          placement="bottom-end"
          appendTo={() => tippyParentRef.current as HTMLDivElement}
          content={
            <ComboBox
              key={`${currentBlockKey}-${currentBlock}`}
              items={commands}
              onSelect={(selection) => {
                setSelectionRect(null);
                onCompleteSource(selection.selectedItem!.onSelect());
              }}
            />
          }
        />
      ) : null}
      <div className="Draftail-BlockToolbar__backdrop" />
    </div>
  );
};

export default CommandComboBox;
