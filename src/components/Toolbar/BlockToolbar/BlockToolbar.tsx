import React, { useCallback, useEffect, useRef, useState } from "react";
import { RichUtils } from "draft-js";

import { ENTITY_TYPE } from "../../../api/constants";

import DraftUtils from "../../../api/DraftUtils";
import behavior from "../../../api/behavior";
import {
  getControlDescription,
  getControlLabel,
  getControlSearchFields,
} from "../../../api/ui";

import Tooltip, {
  PopperInstance,
  TooltipPlacement,
} from "../../Tooltip/Tooltip";
import { ToolbarProps } from "../Toolbar";
import ComboBox, { UseComboboxStateChange } from "../../ComboBox/ComboBox";
import { CommandControl } from "../../../api/types";

const addIcon = <span aria-hidden="true">+</span>;

const getFocusOffset = (toolbarElt: HTMLElement | null, anchorKey: string) => {
  if (!toolbarElt) {
    return "50%";
  }

  const editor = toolbarElt.closest<HTMLDivElement>("[data-draftail-editor]");
  const block = editor!.querySelector<HTMLElement>(
    `[data-block="true"][data-offset-key="${anchorKey}-0-0"]`,
  );
  if (block) {
    const topOffset =
      block.getBoundingClientRect().top +
      block.getBoundingClientRect().height / 2 -
      editor!.getBoundingClientRect().top;
    // If the top offset cannot be calculated, it’s likely because
    // the editor is rendered in a hidden element.
    // In this case, default to showing the trigger in the middle of the editor.
    return topOffset === 0 ? "50%" : topOffset;
  }

  return "50%";
};

export interface BlockToolbarProps extends ToolbarProps {
  triggerLabel?: string;
  triggerIcon?: React.ReactNode;
  comboLabel?: string;
  comboPlaceholder?: string;
  comboPlacement?: TooltipPlacement;
  noResultsText?: string;
  tooltipZIndex?: number;
  showBackdrop?: boolean;
  ComboBoxComponent?: typeof ComboBox;
}

const BlockToolbar = ({
  commands,
  getEditorState,
  blockTypes,
  currentBlock,
  currentBlockKey,
  onRequestSource,
  onCompleteSource,
  entityTypes,
  addHR,
  enableHorizontalRule,
  triggerLabel = "Insert block",
  triggerIcon = addIcon,
  comboLabel = "Choose an item",
  comboPlaceholder = "Search blocks",
  // right-start also works in RTL mode.
  comboPlacement = "right-start" as TooltipPlacement,
  noResultsText = "No results found",
  tooltipZIndex = 100,
  showBackdrop = false,
  ComboBoxComponent = ComboBox,
}: BlockToolbarProps) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [focusOffset, setFocusOffset] = useState<number | string>("50%");
  const [visible, setVisible] = useState<boolean>(false);

  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const anchorKey = selection.getAnchorKey();
  const selectedBlock = DraftUtils.getSelectedBlock(editorState);
  const blockType = selectedBlock.getType();

  const updateTriggerOffset = useCallback(() => {
    if (!toolbarRef.current) {
      return;
    }
    requestAnimationFrame(() => {
      setFocusOffset(getFocusOffset(toolbarRef.current, anchorKey));
    });

    // Account for the block type, as each type has a different height.
    // Worst-case scenario is turning a list item block into unstyled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anchorKey, blockType]);

  useEffect(() => {
    updateTriggerOffset();

    document.addEventListener("draftail:toolbar", updateTriggerOffset);

    return () => {
      document.removeEventListener("draftail:toolbar", updateTriggerOffset);
    };
  }, [updateTriggerOffset]);

  const comboOptions = behavior.getCommandPalette({
    // We always want commands for the block toolbar, even if the main command palette is disabled.
    commands: commands || true,
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

    setVisible(false);
    if (item.onSelect) {
      onCompleteSource(item.onSelect({ editorState: getEditorState() }));
    } else if (item.category === "blockTypes") {
      onCompleteSource(RichUtils.toggleBlockType(getEditorState(), itemType));
    } else if (itemType === ENTITY_TYPE.HORIZONTAL_RULE) {
      addHR();
    } else if (item.category === "entityTypes") {
      onRequestSource(itemType);
    }
  };

  return (
    <div className="Draftail-BlockToolbar" ref={toolbarRef}>
      <Tooltip
        shouldOpen={visible}
        onHide={() => setVisible(false)}
        placement={comboPlacement}
        zIndex={tooltipZIndex}
        showBackdrop={showBackdrop}
        onMount={(instance: PopperInstance) => {
          const field =
            instance.popper.querySelector<HTMLInputElement>(
              '[role="combobox"]',
            );
          if (field) {
            field.focus();
          }
        }}
        content={
          visible ? (
            <ComboBoxComponent
              key={`${currentBlockKey}-${currentBlock}`}
              label={comboLabel}
              placeholder={comboPlaceholder}
              items={comboOptions}
              getItemLabel={getControlLabel}
              getItemDescription={getControlDescription}
              getSearchFields={getControlSearchFields}
              noResultsText={noResultsText}
              onSelect={onSelect}
            />
          ) : null
        }
      >
        <button
          type="button"
          aria-expanded={visible ? "true" : "false"}
          className="Draftail-BlockToolbar__trigger"
          style={{ top: focusOffset }}
          aria-label={triggerLabel}
          onClick={() => setVisible(true)}
        >
          {triggerIcon}
        </button>
      </Tooltip>
    </div>
  );
};

export default BlockToolbar;
