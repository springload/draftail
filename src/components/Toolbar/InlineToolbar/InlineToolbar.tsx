import React, { useEffect, useRef, useState } from "react";
import Tippy from "@tippyjs/react";

import { getVisibleSelectionRect } from "draft-js";

import { ToolbarProps } from "../Toolbar";
import ToolbarDefaults from "./ToolbarDefaults";
import ToolbarGroup from "../ToolbarGroup";

const getReferenceClientRect = () => getVisibleSelectionRect(window);

type FakeRect = ReturnType<typeof getVisibleSelectionRect>;

type InlineToolbarProps = ToolbarProps;

const InlineToolbar = (props: InlineToolbarProps) => {
  const { controls, getEditorState, onChange } = props;
  const tippyParentRef = useRef<HTMLDivElement>(null);
  const [selectionRect, setSelectionRect] = useState<FakeRect | null>();

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

  const isVisible = isCollapsed && Boolean(selectionRect);

  return (
    <>
      <div ref={tippyParentRef} />
      {isVisible ? (
        <Tippy
          visible={isVisible}
          getReferenceClientRect={() => selectionRect as DOMRect}
          maxWidth="100%"
          interactive
          arrow={false}
          appendTo={() => tippyParentRef.current as HTMLDivElement}
          content={
            <div className="Draftail-Toolbar" role="toolbar">
              <ToolbarDefaults {...props} />

              <ToolbarGroup>
                {controls
                  .filter((control) => Boolean(control.inline))
                  .map((control, i) => {
                    const Control = control.inline;
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
      ) : null}
    </>
  );
};

InlineToolbar.defaultProps = {
  tooltip: {
    placement: "top",
  },
};

export default InlineToolbar;
