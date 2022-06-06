import React, { useEffect, useRef, useState } from "react";
import Tippy from "@tippyjs/react";

import { getVisibleSelectionRect } from "draft-js";

import { ENTITY_TYPE } from "../../../api/constants";

import Icon from "../../Icon";
import ToolbarGroup from "../ToolbarGroup";
import type { ToolbarProps } from "../Toolbar";
import { showButton, getButtonLabel, getButtonTitle } from "../ToolbarDefaults";
import ComboBox from "./ComboBox";

const getReferenceClientRect = () => getVisibleSelectionRect(window);

const BlockToolbar = ({
  controls,
  getEditorState,
  onChange,
  blockTypes,
  currentBlock,
  toggleBlockType,
  onRequestSource,
  entityTypes,
  addHR,
  enableHorizontalRule,
}: ToolbarProps) => {
  // Support the legacy and current controls APIs.
  const tippyParentRef = useRef(null);
  const [selectionRect, setSelectionRect] = useState();

  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const isCollapsed = selection.getHasFocus() && !selection.isCollapsed();

  useEffect(() => {
    if (isCollapsed) {
      setSelectionRect(getReferenceClientRect());
    } else {
      setSelectionRect(null);
    }
  }, [isCollapsed]);

  const items = []
    .concat(
      blockTypes.filter(showButton).map((t) => ({
        name: t.type,
        active: currentBlock === t.type,
        label: getButtonLabel(t.type, t),
        title: getButtonTitle(t.type, t),
        icon: t.icon,
        onClick: toggleBlockType.bind(null, t.type),
      })),
    )
    .concat(
      enableHorizontalRule
        ? [
            {
              name: ENTITY_TYPE.HORIZONTAL_RULE,
              onClick: addHR,
              label: getButtonLabel(
                ENTITY_TYPE.HORIZONTAL_RULE,
                enableHorizontalRule,
              ),
              title: getButtonTitle(
                ENTITY_TYPE.HORIZONTAL_RULE,
                enableHorizontalRule,
              ),
              icon:
                typeof enableHorizontalRule !== "boolean"
                  ? enableHorizontalRule.icon
                  : null,
            },
          ]
        : [],
    )
    .concat(
      entityTypes.filter(showButton).map((t) => ({
        name: t.type,
        onClick: onRequestSource.bind(null, t.type),
        label: getButtonLabel(t.type, t),
        title: getButtonTitle(t.type, t),
        icon: t.icon,
      })),
    );

  return (
    <div className="Draftail-BlockToolbar__wrapper">
      <Tippy
        maxWidth="100%"
        interactive
        trigger="click"
        placement="bottom"
        appendTo={() => tippyParentRef.current}
        content={
          <ComboBox
            label="Favorite Animal"
            defaultInputValue="red"
            items={items}
            handleSelectedItemChange={(item) => item.selectedItem.onClick()}
          />
        }
      >
        <button
          type="button"
          aria-expanded="false"
          className="Draftail-BlockToolbar__trigger"
        >
          <Icon
            icon={
              <svg width="16" height="16" viewBox="0 0 448 512">
                <path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99h144v-144C192 62.32 206.33 48 224 48s32 14.32 32 32.01v144h144c17.7-.01 32 14.29 32 31.99z" />
              </svg>
            }
          />
        </button>
      </Tippy>
      <div ref={tippyParentRef} />
    </div>
  );
};

export default BlockToolbar;
