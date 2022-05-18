// @flow
import React, { useRef } from "react";
import Tippy from "@tippyjs/react";

import { getVisibleSelectionRect } from "draft-js";

import ToolbarDefaults from "./ToolbarDefaults";
import ToolbarGroup from "../ToolbarGroup";

const getReferenceClientRect = () => getVisibleSelectionRect(window);

const InlineToolbar = (props: ToolbarProps) => {
  const { controls, getEditorState, onChange } = props;
  const tippyParentRef = useRef(null);

  const editorState = getEditorState();
  const selection = editorState.getSelection();
  const isVisible =
    selection.getHasFocus() &&
    !selection.isCollapsed() &&
    Boolean(getReferenceClientRect());

  // if (!isVisible) {
  //   return null;
  // }

  return (
    <>
      {isVisible ? (
        <Tippy
          visible={isVisible}
          getReferenceClientRect={getReferenceClientRect}
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
