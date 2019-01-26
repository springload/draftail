// @flow
import React from "react";
import type { ComponentType } from "react";
import { EditorState } from "draft-js";

// $FlowFixMe
import ToolbarDefaults from "./ToolbarDefaults";
import ToolbarGroup from "./ToolbarGroup";

type ControlProps = {|
  getEditorState: () => EditorState,
  onChange: (EditorState) => void,
|};

type Props = {|
  controls: $ReadOnlyArray<ComponentType<ControlProps>>,
  getEditorState: () => EditorState,
  onChange: (EditorState) => void,
|};

const Toolbar = (props: Props) => {
  const { controls, getEditorState, onChange } = props;
  return (
    <div className="Draftail-Toolbar" role="toolbar">
      <ToolbarDefaults {...props} />

      <ToolbarGroup>
        {controls.map((Control, i) => (
          <Control
            // eslint-disable-next-line @thibaudcolas/cookbook/react/no-array-index-key
            key={i}
            getEditorState={getEditorState}
            onChange={onChange}
          />
        ))}
      </ToolbarGroup>
    </div>
  );
};

export default Toolbar;
