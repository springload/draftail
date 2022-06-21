import React, { useEffect, useRef, useState } from "react";
import Tippy, { TippyProps } from "@tippyjs/react";

import { ENTITY_TYPE } from "../../../api/constants";

import { ToolbarProps } from "../Toolbar";
import { showButton } from "../ToolbarDefaults";
import ComboBox, { ComboBoxOption } from "./ComboBox";
import DraftUtils from "../../../api/DraftUtils";
import { RichUtils } from "draft-js";

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
  controls,
  getEditorState,
  focus,
  onChange,
  blockTypes,
  currentBlock,
  currentBlockKey,
  toggleBlockType,
  onRequestSource,
  onCompleteSource,
  entityTypes,
  addHR,
  enableHorizontalRule,
}: BlockToolbarProps) => {
  const tippyParentRef = useRef(null);
  const [focusedBlockTop, setFocusedBlockTop] = useState<number>(0);
  const [visible, setVisible] = useState(false);
  const [toggleVisible, setToggleVisible] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const isCollapsed = selection.isCollapsed();
  const isStart = selection.getAnchorOffset() === 0;
  const anchorKey = selection.getAnchorKey();
  const showToggle =
    isCollapsed &&
    isStart &&
    DraftUtils.getSelectedBlock(editorState).getText() === "";

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
  }, [showToggle, anchorKey]);

  const items: ComboBoxOption[] = [
    ...blockTypes.filter(showButton).map((t) => ({
      ...t,
      onSelect: () => {
        return RichUtils.toggleBlockType(getEditorState(), t.type);
      },
    })),
    ...entityTypes
      .filter(showButton)
      .filter((t) => Boolean(t.block))
      .map((t) => ({
        ...t,
        onSelect: onRequestSource.bind(null, t.type),
      })),
  ];

  if (enableHorizontalRule) {
    items.push({
      type: ENTITY_TYPE.HORIZONTAL_RULE,
      onSelect: addHR,
      ...(typeof enableHorizontalRule === "object" ? enableHorizontalRule : {}),
    });
  }

  return (
    <div
      className={`Draftail-BlockToolbar Draftail-BlockToolbar--${
        visible ? "open" : "closed"
      }`}
    >
      <div ref={tippyParentRef} />
      <Tippy
        maxWidth="100%"
        interactive
        visible={visible}
        onClickOutside={() => setVisible(false)}
        trigger="click"
        placement={comboBox.placement}
        arrow={false}
        appendTo={() => tippyParentRef.current}
        onMount={(instance) => {
          const field = instance.popper.querySelector<HTMLInputElement>(
            '[aria-autocomplete="list"]',
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
        plugins={tippyPlugins}
        content={
          <ComboBox
            key={`${currentBlockKey}-${currentBlock}`}
            label={comboBox.label}
            placeholder={comboBox.placeholder}
            selectedItem={selectedItem}
            items={items}
            onSelect={(selection) => {
              setSelectedItem(selection.selectedItem);
              setVisible(false);
              onCompleteSource(selection.selectedItem!.onSelect());
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
    placement: "auto-end",
  },
};

export default BlockToolbar;
