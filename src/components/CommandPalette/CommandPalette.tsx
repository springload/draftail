import React, { useEffect, useState } from "react";
import {
  EditorState,
  getVisibleSelectionRect,
  Modifier,
  RichUtils,
} from "draft-js";

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
  const promptText = prompt?.text || "";
  const [shouldOpen, setShouldOpen] = useState(false);
  const [dismissedPrefix, setDismissedPrefix] = useState<string | null>(null);
  useEffect(() => {
    if (promptText) {
      if (dismissedPrefix) {
        const open = !promptText.startsWith(dismissedPrefix);
        setShouldOpen(open);
        if (open) {
          setDismissedPrefix(null);
        }
      } else {
        setShouldOpen(true);
      }
    } else {
      setShouldOpen(false);
    }
  }, [dismissedPrefix, promptText]);

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
      onCompleteSource(item.onSelect({ editorState, prompt: prompt?.text }));
    } else if (item.category === "blockTypes") {
      const selection = editorState.getSelection();
      const promptSelection = selection.merge({
        anchorOffset: prompt?.position,
      });
      const nextContent = Modifier.replaceText(
        editorState.getCurrentContent(),
        promptSelection,
        "",
      );
      const nextState = EditorState.push(
        editorState,
        nextContent,
        "remove-range",
      );
      onCompleteSource(RichUtils.toggleBlockType(nextState, itemType));
    } else if (item.type === ENTITY_TYPE.HORIZONTAL_RULE) {
      const selection = editorState.getSelection();
      const promptSelection = selection.merge({
        anchorOffset: prompt?.position,
      });
      const nextContent = Modifier.replaceText(
        editorState.getCurrentContent(),
        promptSelection,
        "",
      );
      const nextState = EditorState.push(
        editorState,
        nextContent,
        "remove-range",
      );
      onCompleteSource(
        DraftUtils.addHorizontalRuleRemovingSelection(nextState),
      );
    } else if (item.category === "entityTypes") {
      const selection = editorState.getSelection();
      const promptSelection = selection.merge({
        anchorOffset: prompt?.position,
      });
      const nextContent = Modifier.replaceText(
        editorState.getCurrentContent(),
        promptSelection,
        "",
      );
      const nextState = EditorState.push(
        editorState,
        nextContent,
        "remove-range",
      );
      onCompleteSource(nextState);
      setTimeout(() => {
        onRequestSource(itemType);
      }, 50);
    }
  };
  return (
    <Tooltip
      shouldOpen={shouldOpen}
      onHide={() => {
        if (prompt) {
          setDismissedPrefix(prompt.text);
        }
        setShouldOpen(false);
      }}
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
            inputValue={promptText.substring(1) || ""}
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
