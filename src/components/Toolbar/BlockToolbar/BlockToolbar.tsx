import React, { useEffect, useRef, useState } from "react";
import Tippy, { TippyProps } from "@tippyjs/react";

import { RichUtils } from "draft-js";
import { ENTITY_TYPE } from "../../../api/constants";

import { ToolbarProps } from "../Toolbar";
import ComboBox from "./ComboBox";
import DraftUtils from "../../../api/DraftUtils";
import behavior from "../../../api/behavior";

const addIcon = (
  <svg width="16" height="16" viewBox="0 0 448 512" aria-hidden="true">
    <path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99h144v-144C192 62.32 206.33 48 224 48s32 14.32 32 32.01v144h144c17.7-.01 32 14.29 32 31.99z" />
  </svg>
);

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

type BlockToolbarProps = {
  trigger: {
    icon: React.ReactNode;
    label: string;
  };
  comboBox: {
    label: string;
    placeholder: string;
    placement: TippyProps["placement"];
  };
} & ToolbarProps;

const BlockToolbar = ({
  trigger,
  comboBox,
  commandPalette,
  getEditorState,
  blockTypes,
  currentBlock,
  currentBlockKey,
  onRequestSource,
  onCompleteSource,
  entityTypes,
  addHR,
  enableHorizontalRule,
}: BlockToolbarProps) => {
  const tippyParentRef = useRef<HTMLDivElement>(null);
  const [focusedBlockTop, setFocusedBlockTop] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const [toggleVisible, setToggleVisible] = useState<boolean>(false);

  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const isCollapsed = selection.isCollapsed();
  const isStart = selection.getAnchorOffset() === 0;
  const anchorKey = selection.getAnchorKey();
  const selectedBlock = DraftUtils.getSelectedBlock(editorState);
  const blockType = selectedBlock.getType();
  const showToggle = isCollapsed && isStart && selectedBlock.getText() === "";

  useEffect(() => {
    if (showToggle) {
      const elt = document.querySelector<HTMLElement>(
        `[data-block="true"][data-offset-key="${anchorKey}-0-0"]`,
      );
      const editor = elt!.closest<HTMLDivElement>("[data-draftail-editor]");
      setFocusedBlockTop(
        elt!.getBoundingClientRect().top - editor!.getBoundingClientRect().top,
      );
      setToggleVisible(true);
    } else {
      setToggleVisible(false);
    }

    return () => {
      setToggleVisible(false);
    };
    // Account for the block type, as each type has a different height.
    // Worst-case scenario is turning a list item block into unstyled.
  }, [showToggle, anchorKey, blockType]);

  const commands = behavior.getCommandPalette({
    // We always want commands for the block toolbar, even if the main command palette is disabled.
    commandPalette: commandPalette || true,
    blockTypes,
    entityTypes,
    enableHorizontalRule,
  });

  return (
    <div
      className={`Draftail-BlockToolbar Draftail-BlockToolbar--${
        visible ? "open" : "closed"
      }`}
    >
      <div ref={tippyParentRef} />
      <Tippy
        interactive
        visible={visible}
        onHide={() => setVisible(false)}
        onClickOutside={() => setVisible(false)}
        placement={comboBox.placement}
        maxWidth="100%"
        arrow={false}
        appendTo={() => tippyParentRef.current as HTMLDivElement}
        plugins={tippyPlugins}
        onMount={(instance) => {
          const field = instance.popper.querySelector<HTMLInputElement>(
            "[data-draftail-command-palette-input]",
          );
          if (field) {
            field.focus();
          }
        }}
        onHidden={() => {
          if (!showToggle) {
            setToggleVisible(false);
          }
        }}
        content={
          <ComboBox
            key={`${currentBlockKey}-${currentBlock}`}
            label={comboBox.label}
            placeholder={comboBox.placeholder}
            items={commands}
            onSelect={(change) => {
              const item = change.selectedItem;

              if (!item) {
                return;
              }

              const itemType = item.type as string;

              setVisible(false);
              if (item.onSelect) {
                onCompleteSource(
                  item.onSelect({ editorState: getEditorState() }),
                );
              } else if (item.category === "blockTypes") {
                onCompleteSource(
                  RichUtils.toggleBlockType(getEditorState(), itemType),
                );
              } else if (itemType === ENTITY_TYPE.HORIZONTAL_RULE) {
                addHR();
              } else if (item.category === "entityTypes") {
                onRequestSource(itemType);
              }
            }}
          />
        }
      >
        <button
          type="button"
          aria-expanded={toggleVisible ? "true" : "false"}
          className="Draftail-BlockToolbar__trigger"
          style={{
            top: focusedBlockTop,
            visibility: toggleVisible ? "visible" : "hidden",
          }}
          aria-label={trigger.label}
          onClick={() => setVisible(true)}
        >
          {trigger.icon}
        </button>
      </Tippy>
      <div className="Draftail-BlockToolbar__backdrop" />
    </div>
  );
};

BlockToolbar.defaultProps = {
  trigger: {
    icon: addIcon,
    label: "Insert block",
  },
  comboBox: {
    label: "Choose an item:",
    placeholder: "Search blocks",
    placement: "right-start",
  },
};

export default BlockToolbar;
