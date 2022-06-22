import React, { Component, useState, useRef, useEffect } from "react";
import Tippy from "@tippyjs/react";
import { getVisibleSelectionRect, RichUtils } from "draft-js";

import DraftUtils from "../../api/DraftUtils";

import ComboBox from "../Toolbar/BlockToolbar/ComboBox";
import { ToolbarProps } from "../Toolbar/Toolbar";

const getReferenceClientRect = () => getVisibleSelectionRect(window);
type FakeRect = ReturnType<typeof getVisibleSelectionRect>;

const hideTooltipOnEsc = {
  name: "hideOnEsc",
  defaultValue: true,
  fn({ hide }: { hide: () => void }) {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        hide();
      }
    }

    return {
      onShow() {
        document.addEventListener("keydown", onKeyDown);
      },
      onHide() {
        document.removeEventListener("keydown", onKeyDown);
      },
    };
  },
};

const tippyPlugins = [hideTooltipOnEsc];

interface CommandPaletteProps extends ToolbarProps {}

const CommandPalette = ({
  textDirectionality,
  blockTypes,
  getEditorState,
  currentBlock,
  currentBlockKey,
  onCompleteSource,
}: CommandPaletteProps) => {
  const editorState = getEditorState();
  const prompt = DraftUtils.getCommandPalettePrompt(editorState);
  const showPrompt = !!prompt;
  const commands = blockTypes.map((t) => ({
    ...t,
    onSelect: () => {
      const editorState = getEditorState();
      const block = DraftUtils.getSelectedBlock(editorState);
      return DraftUtils.resetBlockWithType(
        editorState,
        t.type,
        block.getText().replace(prompt, ""),
      );
    },
  }));
  const tippyParentRef = useRef<HTMLDivElement>(null);
  const [selectionRect, setSelectionRect] = useState<FakeRect | null>(null);

  useEffect(() => {
    if (showPrompt) {
      setSelectionRect(getReferenceClientRect());
    } else {
      setSelectionRect(null);
    }
  }, [showPrompt]);

  const isVisible = showPrompt && Boolean(selectionRect);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`Draftail-CommandPalette${
        isVisible ? " Draftail-CommandPalette--open" : ""
      }`}
    >
      <div ref={tippyParentRef} />
      <Tippy
        visible={isVisible}
        onHide={() => setSelectionRect(null)}
        onClickOutside={() => setSelectionRect(null)}
        getReferenceClientRect={() => selectionRect as DOMRect}
        maxWidth="100%"
        interactive
        arrow={false}
        placement="bottom-end"
        appendTo={() => tippyParentRef.current as HTMLDivElement}
        plugins={tippyPlugins}
        content={
          <ComboBox
            key={`${currentBlockKey}-${currentBlock}`}
            items={commands}
            inputValue={prompt.substring(1)}
            onSelect={(selection) => {
              setSelectionRect(null);
              onCompleteSource(selection.selectedItem!.onSelect());
            }}
          />
        }
      />
      <div className="Draftail-BlockToolbar__backdrop" />
    </div>
  );
};

export default CommandPalette;
