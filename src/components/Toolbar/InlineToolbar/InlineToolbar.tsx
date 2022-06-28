import React, { useEffect, useRef, useState } from "react";
import Tippy, { TippyProps } from "@tippyjs/react";

import { getVisibleSelectionRect } from "draft-js";

import { ToolbarProps } from "../Toolbar";
import ToolbarDefaults from "./ToolbarDefaults";
import ToolbarGroup from "../ToolbarGroup";

const getReferenceClientRect = () => getVisibleSelectionRect(window);

type FakeRect = ReturnType<typeof getVisibleSelectionRect>;

export interface InlineToolbarProps extends ToolbarProps {
  tooltipPlacement?: TippyProps["placement"];
}

const InlineToolbar = (props: InlineToolbarProps) => {
  const { controls, getEditorState, onChange } = props;
  const tippyParentRef = useRef<HTMLDivElement>(null);
  const [selectionRect, setSelectionRect] = useState<FakeRect | null>();

  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const hasSelection = selection.getHasFocus() && !selection.isCollapsed();

  useEffect(() => {
    if (hasSelection) {
      setSelectionRect(getReferenceClientRect());
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

              <ToolbarGroup>
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
                ? { top: selectionRect.top, left: selectionRect.left }
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
