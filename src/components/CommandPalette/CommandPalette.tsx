import React, { useState, useRef, useEffect } from "react";
import Tippy from "@tippyjs/react";
import { getVisibleSelectionRect } from "draft-js";

import DraftUtils from "../../api/DraftUtils";
import behavior from "../../api/behavior";

import ComboBox from "../Toolbar/BlockToolbar/ComboBox";
import { ToolbarProps } from "../Toolbar/Toolbar";
import { ENTITY_TYPE } from "../../api/constants";

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

/**
 * Simulates a keyboard event having happened on the combobox’s input.
 */
export const simulateInputEvent = (
  key: "ArrowDown" | "ArrowUp" | "Enter",
  event: React.KeyboardEvent<HTMLDivElement>,
) => {
  const editor = (event.target as HTMLDivElement).closest<HTMLDivElement>(
    "[data-draftail-editor]",
  );
  const input = editor!.querySelector<HTMLInputElement>(
    "[data-draftail-command-palette-input]",
  );
  if (!input) {
    return;
  }
  input?.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  event.preventDefault();
};

const tippyPlugins = [hideTooltipOnEsc];

type CommandPaletteProps = ToolbarProps;

const CommandPalette = ({
  blockTypes,
  entityTypes,
  enableHorizontalRule,
  commandPalette,
  getEditorState,
  onCompleteSource,
  onRequestSource,
}: CommandPaletteProps) => {
  const editorState = getEditorState();
  const prompt = DraftUtils.getCommandPalettePrompt(editorState);
  const showPrompt = !!prompt;
  const commands = behavior.getCommandPalette({
    commandPalette,
    blockTypes,
    entityTypes,
    enableHorizontalRule,
  });
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
            items={commands}
            inputValue={prompt.substring(1)}
            onSelect={(change) => {
              const item = change.selectedItem;

              if (!item) {
                return;
              }

              setSelectionRect(null);
              if (item.onSelect) {
                onCompleteSource(
                  item.onSelect({ editorState: getEditorState(), prompt }),
                );
              } else if (item.category === "blockTypes") {
                const state = getEditorState();
                const block = DraftUtils.getSelectedBlock(state);
                onCompleteSource(
                  DraftUtils.resetBlockWithType(
                    state,
                    item.type,
                    block.getText().replace(prompt, ""),
                  ),
                );
              } else if (item.type === ENTITY_TYPE.HORIZONTAL_RULE) {
                let nextState = getEditorState();
                const block = DraftUtils.getSelectedBlock(nextState);
                nextState = DraftUtils.resetBlockWithType(
                  nextState,
                  block.getType(),
                  block.getText().replace(prompt, ""),
                );
                onCompleteSource(
                  DraftUtils.addHorizontalRuleRemovingSelection(nextState),
                );
              } else if (item.category === "entityTypes") {
                let nextState = getEditorState();
                const block = DraftUtils.getSelectedBlock(nextState);
                nextState = DraftUtils.resetBlockWithType(
                  nextState,
                  block.getType(),
                  block.getText().replace(prompt, ""),
                );
                onCompleteSource(nextState);
                setTimeout(() => {
                  onRequestSource(item.type);
                }, 50);
              }
            }}
          />
        }
      />
      <div className="Draftail-BlockToolbar__backdrop" />
    </div>
  );
};

export default CommandPalette;
