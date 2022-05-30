// @flow
import React, { useEffect, useRef, useState } from "react";
import Tippy from "@tippyjs/react";

import { getVisibleSelectionRect } from "draft-js";

import type { ToolbarProps } from "../Toolbar";
import ToolbarDefaults from "./ToolbarDefaults";
import ToolbarGroup from "../ToolbarGroup";

const getReferenceClientRect = () => getVisibleSelectionRect(window);

const InlineToolbar = (props: ToolbarProps) => {
  // Support the legacy and current controls APIs.
  // $FlowFixMe
  const { controls, getEditorState, onChange } = props;
  const tippyParentRef = useRef(null);
  const [selectionRect, setSelectionRect] = useState();

  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const isCollapsed = selection.getHasFocus() && !selection.isCollapsed();

  useEffect(() => {
    if (isCollapsed) {
      // $FlowFixMe
      setSelectionRect(getReferenceClientRect());
    } else {
      setSelectionRect(null);
    }
  }, [isCollapsed]);

  const isVisible = isCollapsed && Boolean(selectionRect);

  return (
    <>
      {isVisible ? (
        <Tippy
          visible={isVisible}
          getReferenceClientRect={() => selectionRect}
          maxWidth="100%"
          interactive
          appendTo={() => tippyParentRef.current}
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
                        // eslint-disable-next-line @thibaudcolas/cookbook/react/no-array-index-key
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
      <div ref={tippyParentRef} />
    </>
  );
};

export default InlineToolbar;
