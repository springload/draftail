import React from "react";
import { EditorState } from "draft-js";

import { ControlControl } from "../../api/types";

import ToolbarDefaults, { ToolbarDefaultProps } from "./ToolbarDefaults";
import ToolbarGroup from "./ToolbarGroup";

export interface ToolbarProps extends ToolbarDefaultProps {
  controls: ReadonlyArray<ControlControl>;
  getEditorState: () => EditorState;
  onChange: (state: EditorState) => void;
}

const Toolbar = (props: ToolbarProps) => {
  // Support the legacy and current controls APIs.
  const { controls, getEditorState, onChange } = props;
  return (
    <div className="Draftail-Toolbar" role="toolbar">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <ToolbarDefaults {...props} />

      <ToolbarGroup>
        {controls.map((control, i) => {
          if (control.inline || control.meta) {
            return null;
          }

          const Control = control.block || control;

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
  );
};

export default Toolbar;
