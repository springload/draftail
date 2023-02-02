import React, { useEffect, useState } from "react";
import { ContentBlock, getVisibleSelectionRect, RichUtils } from "draft-js";

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
    return false;
  }
  const input = editor.querySelector<HTMLInputElement>('[role="combobox"]');
  if (!input) {
    return false;
  }

  if (key === "Enter") {
    const selected = editor.querySelector(
      `#${input.getAttribute("aria-controls")} [aria-selected="true"]`,
    );
    if (!selected) {
      return false;
    }
  }

  input.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true }));
  event.preventDefault();
  return true;
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

type Prompt = {
  text: string;
  position: number;
  block: ContentBlock;
};

export interface CommandPaletteProps extends ToolbarProps {
  comboPlacement?: TooltipPlacement;
  noResultsText?: string;
  tooltipZIndex?: number;
  showBackdrop?: boolean;
  ComboBoxComponent?: typeof ComboBox;
}

const CommandPalette = ({
  blockTypes,
  entityTypes,
  enableHorizontalRule,
  comboPlacement,
  noResultsText,
  tooltipZIndex,
  showBackdrop,
  commands,
  getEditorState,
  onCompleteSource,
  onRequestSource,
  ComboBoxComponent = ComboBox,
}: CommandPaletteProps) => {
  const editorState = getEditorState();
  const prompt = DraftUtils.getCommandPalettePrompt(editorState);
  const promptText = prompt?.text || "";
  const promptPos = prompt?.position;
  const promptBlock = prompt?.block.getKey();
  const [shouldOpen, setShouldOpen] = useState(false);
  const [dismissedPrompt, setDismissedPrompt] = useState<Prompt | null>(null);
  useEffect(() => {
    if (promptText) {
      // When there is a previously-dismissed prompt, only open the palette if the prompt has changed:
      // - new position (char offset, block)
      // - new starting text
      if (dismissedPrompt) {
        const open =
          dismissedPrompt.position !== promptPos ||
          dismissedPrompt.block.getKey() !== promptBlock ||
          !promptText.startsWith(dismissedPrompt.text);
        setShouldOpen(open);
        if (open) {
          setDismissedPrompt(null);
        }
      } else {
        setShouldOpen(true);
      }
    } else {
      setShouldOpen(false);
    }
  }, [dismissedPrompt, promptText, promptPos, promptBlock]);

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
      const nextState = DraftUtils.removeCommandPalettePrompt(editorState);
      onCompleteSource(RichUtils.toggleBlockType(nextState, itemType));
    } else if (item.type === ENTITY_TYPE.HORIZONTAL_RULE) {
      const nextState = DraftUtils.removeCommandPalettePrompt(editorState);
      onCompleteSource(
        DraftUtils.addHorizontalRuleRemovingSelection(nextState),
      );
    } else if (item.category === "entityTypes") {
      const nextState = DraftUtils.removeCommandPalettePrompt(editorState);
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
          setDismissedPrompt(prompt);
        }
        setShouldOpen(false);
      }}
      getTargetPosition={getTargetPosition}
      showBackdrop={showBackdrop}
      placement={comboPlacement}
      zIndex={tooltipZIndex}
      content={
        shouldOpen ? (
          <ComboBoxComponent
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
  showBackdrop: false,
};

export default CommandPalette;
