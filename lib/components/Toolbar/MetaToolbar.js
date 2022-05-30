// @flow
import React from "react";
import type { ComponentType } from "react";
import { EditorState } from "draft-js";

import type { ToolbarProps } from "./Toolbar";
import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";
import { showButton, getButtonLabel, getButtonTitle } from "./ToolbarDefaults";

type ControlProps = {|
  getEditorState: () => EditorState,
  onChange: (EditorState) => void,
|};

export type MetaToolbarProps = {
  showBlockEntities: ?boolean,
  entityTypes: ?$ReadOnlyArray<{}>,
  controls: $ReadOnlyArray<
    | ComponentType<ControlProps>
    | {|
        type: string,
        meta?: ?ComponentType<ControlProps>,
        inline?: ?ComponentType<ControlProps>,
        block?: ?ComponentType<ControlProps>,
      |},
  >,
  getEditorState: () => EditorState,
  onChange: (EditorState) => void,
  onRequestSource: (entityType: string) => void,
};

const MetaToolbar = ({
  showBlockEntities,
  entityTypes,
  controls,
  getEditorState,
  onChange,
  onRequestSource,
}: ToolbarProps) => (
  <div className="Draftail-MetaToolbar">
    {showBlockEntities ? (
      <ToolbarGroup key="entities">
        {entityTypes
          .filter((entityType) => showButton(entityType) && entityType.block)
          .map((t) => (
            <ToolbarButton
              key={t.type}
              name={t.type}
              onClick={onRequestSource}
              label={getButtonLabel(t.type, t)}
              title={getButtonTitle(t.type, t)}
              icon={t.icon}
            />
          ))}
      </ToolbarGroup>
    ) : null}
    <ToolbarGroup>
      {controls.map((control, i) => {
        if (control.inline || control.block) {
          return null;
        }

        const Control =
          typeof control.meta !== "undefined" ? control.meta : control;
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
);

export default MetaToolbar;
