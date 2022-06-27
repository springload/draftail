import React, { useState, useRef, useEffect } from "react";
import Tippy, { TippyProps } from "@tippyjs/react";
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

interface CommandPaletteProps extends ToolbarProps {
  comboPlacement: TippyProps["placement"];
  noResultsText: string;
}

const CommandPalette = ({
  blockTypes,
  entityTypes,
  enableHorizontalRule,
  comboPlacement,
  noResultsText,
  commands,
  getEditorState,
  onCompleteSource,
  onRequestSource,
}: CommandPaletteProps) => {
  const editorState = getEditorState();
  const prompt = DraftUtils.getCommandPalettePrompt(editorState);
  const showPrompt = !!prompt;
  const comboOptions = behavior.getCommandPalette({
    commands,
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
        interactive
        onHide={() => setSelectionRect(null)}
        onClickOutside={() => setSelectionRect(null)}
        placement={comboPlacement}
        maxWidth="100%"
        arrow={false}
        appendTo={() => tippyParentRef.current as HTMLDivElement}
        plugins={tippyPlugins}
        content={
          <ComboBox
            items={comboOptions}
            inputValue={prompt.substring(1)}
            noResultsText={noResultsText}
            onSelect={(change) => {
              const item = change.selectedItem;

              if (!item) {
                return;
              }

              const itemType = item.type as string;

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
                    itemType,
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
                  onRequestSource(itemType);
                }, 50);
              }
            }}
          />
        }
      >
        <div
          className="Draftail-CommandPalette__target"
          style={
            selectionRect
              ? {
                  top: selectionRect.top,
                }
              : {}
          }
        >
          {"\u200B"}
        </div>
      </Tippy>
      <div className="Draftail-BlockToolbar__backdrop" />
    </div>
  );
};

CommandPalette.defaultProps = {
  // right-start also works in RTL mode.
  comboPlacement: "bottom-end",
  noResultsText: "No results found",
};

export default CommandPalette;
