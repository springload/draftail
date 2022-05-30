// @flow
import React from "react";
import type { ComponentType } from "react";
import { EditorState } from "draft-js";

import type { IconProp } from "../Icon";
import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";
import { showButton, getButtonLabel, getButtonTitle } from "./ToolbarDefaults";

type ControlProps = {|
  getEditorState: () => EditorState,
  onChange: (EditorState) => void,
|};
type ControlComponent = ComponentType<ControlProps>;
type LegacyControlConfig = ControlComponent;
type CurrentControlConfig = {|
  inline?: ControlComponent,
  block?: ControlComponent,
  meta?: ControlComponent,
|};
type ControlConfig = CurrentControlConfig;

export type MetaToolbarProps = {
  showBlockEntities: ?boolean,
  entityTypes: $ReadOnlyArray<{
    type: string,
    // Describes the control in the editor UI, concisely.
    label?: ?string,
    // Describes the control in the editor UI.
    description?: string,
    // Represents the control in the editor UI.
    icon?: IconProp,
    block?: ComponentType<{}>,
  }>,
  controls: $ReadOnlyArray<ControlConfig>,
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
}: MetaToolbarProps) => (
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

        // Support the legacy and current controls APIs.
        // $FlowFixMe
        const Control = control.meta || (control: LegacyControlConfig);

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
