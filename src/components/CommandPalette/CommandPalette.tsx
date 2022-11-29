import React, { useEffect, useState } from "react";
import { getVisibleSelectionRect } from "draft-js";

import { ENTITY_TYPE } from "../../api/constants";
import DraftUtils from "../../api/DraftUtils";
import behavior from "../../api/behavior";

import ComboBox, { UseComboboxStateChange } from "../ComboBox/ComboBox";
import { ToolbarProps } from "../Toolbar/Toolbar";
import Tooltip, { TooltipPlacement } from "../Tooltip/Tooltip";
import {
  getControlLabel,
  getControlDescription,
  getControlSearchFields,
} from "../../api/ui";
import { CommandControl } from "../../api/types";

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
  if (!editor) {
    return;
  }
  const input = editor.querySelector<HTMLInputElement>(
    "[data-draftail-command-palette-input]",
  );
  if (!input) {
    return;
  }
  input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  event.preventDefault();
};

/**
 * Position the tooltip according to the current selection, relative to the editor, with an offset.
 */
const getTargetPosition = (editorRect: DOMRect) => {
  const clientRect = getVisibleSelectionRect(window);
  if (clientRect) {
    return {
      top: clientRect.top - editorRect.top,
      left: clientRect.left - editorRect.left,
    };
  }

  return null;
};

export interface CommandPaletteProps extends ToolbarProps {
  comboPlacement?: TooltipPlacement;
  noResultsText?: string;
  tooltipZIndex?: number;
}

const CommandPalette = ({
  blockTypes,
  entityTypes,
  enableHorizontalRule,
  comboPlacement,
  noResultsText,
  tooltipZIndex,
  commands,
  getEditorState,
  onCompleteSource,
  onRequestSource,
}: CommandPaletteProps) => {
  const editorState = getEditorState();
  const prompt = DraftUtils.getCommandPalettePrompt(editorState);
  const [shouldOpen, setShouldOpen] = useState(false);
  useEffect(() => {
    setShouldOpen(Boolean(prompt));
  }, [prompt, setShouldOpen]);

  if (!shouldOpen) {
    return null;
  }

  const items = behavior.getCommandPalette({
    commands,
    blockTypes,
    entityTypes,
    enableHorizontalRule,
  });

  const onSelect = (change: UseComboboxStateChange<CommandControl>) => {
    const item = change.selectedItem;

    if (!item) {
      return;
    }

    const itemType = item.type as string;

    if (item.onSelect) {
      onCompleteSource(item.onSelect({ editorState, prompt }));
    } else if (item.category === "blockTypes") {
      const nextState = DraftUtils.resetBlockWithType(editorState, itemType);
      onCompleteSource(nextState);
    } else if (item.type === ENTITY_TYPE.HORIZONTAL_RULE) {
      const nextState = DraftUtils.resetBlockWithType(editorState);
      onCompleteSource(
        DraftUtils.addHorizontalRuleRemovingSelection(nextState),
      );
    } else if (item.category === "entityTypes") {
      const nextState = DraftUtils.resetBlockWithType(editorState);
      onCompleteSource(nextState);
      setTimeout(() => {
        onRequestSource(itemType);
      }, 50);
    }
  };
  return (
    <Tooltip
      shouldOpen={shouldOpen}
      onHide={() => setShouldOpen(false)}
      getTargetPosition={getTargetPosition}
      showBackdrop
      placement={comboPlacement}
      zIndex={tooltipZIndex}
      content={
        shouldOpen ? (
          <ComboBox
            items={items}
            getItemLabel={getControlLabel}
            getItemDescription={getControlDescription}
            getSearchFields={getControlSearchFields}
            inputValue={prompt.substring(1)}
            noResultsText={noResultsText}
            onSelect={onSelect}
          />
        ) : null
      }
    />
  );
};

CommandPalette.defaultProps = {
  // right-start also works in RTL mode.
  comboPlacement: "bottom-end" as TooltipPlacement,
  noResultsText: "No results found",
  tooltipZIndex: 100,
};

export default CommandPalette;
