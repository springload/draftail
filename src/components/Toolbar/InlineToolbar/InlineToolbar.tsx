import React, { useEffect, useRef, useState } from "react";
import Tippy, { TippyProps } from "@tippyjs/react";

import { getVisibleSelectionRect } from "draft-js";

import { ToolbarProps } from "../Toolbar";
import ToolbarDefaults from "./ToolbarDefaults";
import ToolbarGroup from "../ToolbarGroup";

const getReferenceClientRect = () => getVisibleSelectionRect(window);

export interface InlineToolbarProps extends ToolbarProps {
  tooltipPlacement?: TippyProps["placement"];
}

const InlineToolbar = (props: InlineToolbarProps) => {
  const { controls, getEditorState, onChange } = props;
  const tippyParentRef = useRef<HTMLDivElement>(null);
  const [selectionRect, setSelectionRect] = useState<{
    top: number;
    left: number | string;
  } | null>();

  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const hasSelection = selection.getHasFocus() && !selection.isCollapsed();

  useEffect(() => {
    if (hasSelection && tippyParentRef.current) {
      const editor = tippyParentRef.current.closest<HTMLDivElement>(
        "[data-draftail-editor]",
      );
      const editorRect = editor!.getBoundingClientRect();
      const clientRect = getReferenceClientRect();
      setSelectionRect({
        top: clientRect.top - editorRect.top,
        left: `calc(${
          clientRect.left - editorRect.left
        }px + var(--draftail-offset-inline-start, 0))`,
      });
    } else {
      setSelectionRect(null);
    }
  }, [hasSelection]);

  const isVisible = hasSelection && Boolean(selectionRect);

  return (
    <>
      {isVisible ? (
        <Tippy
          visible={isVisible}
          maxWidth="100%"
          interactive
          arrow={false}
          appendTo={() => tippyParentRef.current as HTMLDivElement}
          content={
            <div className="Draftail-InlineToolbar" role="toolbar">
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <ToolbarDefaults {...props} />

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
        >
          <div
            className="Draftail-InlineToolbar__target"
            style={
              selectionRect
                ? {
                    top: selectionRect.top,
                    insetInlineStart: selectionRect.left,
                  }
                : undefined
            }
          >
            {"\u200B"}
          </div>
        </Tippy>
      ) : null}
      <div ref={tippyParentRef} />
    </>
  );
};

InlineToolbar.defaultProps = {
  tooltipPlacement: "top" as TippyProps["placement"],
};

export default InlineToolbar;
