import React from "react";

import { getVisibleSelectionRect } from "draft-js";

import Tooltip, { TooltipPlacement } from "../../Tooltip/Tooltip";
import { ToolbarProps } from "../Toolbar";
import ToolbarDefaults from "../ToolbarDefaults";
import ToolbarGroup from "../ToolbarGroup";

export interface FloatingToolbarProps extends ToolbarProps {
  tooltipPlacement?: TooltipPlacement;
  tooltipZIndex?: number;
  className?: string;
}

/**
 * Position the tooltip according to the current selection, relative to the editor, with an offset.
 */
const getTargetPosition = (editorRect: DOMRect) => {
  const clientRect = getVisibleSelectionRect(window);
  if (clientRect) {
    return {
      top: clientRect.top - editorRect.top,
      left: `calc(${
        clientRect.left - editorRect.left
      }px + var(--draftail-offset-inline-start, 0))`,
    };
  }

  return null;
};

const FloatingToolbar = ({
  controls,
  getEditorState,
  onChange,
  tooltipZIndex = 100,
  tooltipPlacement = "top" as TooltipPlacement,
  className,
  ...otherProps
}: FloatingToolbarProps) => {
  const editorState = getEditorState();
  const selection = editorState.getSelection();

  return (
    <Tooltip
      shouldOpen={selection.getHasFocus() && !selection.isCollapsed()}
      getTargetPosition={getTargetPosition}
      placement={tooltipPlacement}
      zIndex={tooltipZIndex}
      content={
        <div
          className={`Draftail-FloatingToolbar ${className || ""}`}
          role="toolbar"
        >
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          <ToolbarDefaults {...otherProps} />

          <ToolbarGroup name="controls">
            {controls.map((control, i) => {
              const Control = control.inline;

              if (!Control) {
                return null;
              }

              return (
                <Control
                  // eslint-disable-next-line react/no-array-index-key
                  key={i}
                  getEditorState={getEditorState}
                  onChange={onChange}
                />
              );
            })}
          </ToolbarGroup>
        </div>
      }
    />
  );
};

export default FloatingToolbar;
