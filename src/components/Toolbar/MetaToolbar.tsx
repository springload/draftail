import React from "react";
import type { ComponentType } from "react";
import { EditorState } from "draft-js";

import { getControlLabel } from "../../api/ui";
import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";
import { showButton, getButtonTitle } from "./ToolbarDefaults";
import { EntityTypeControl } from "../../api/types";

type ControlProps = {
  getEditorState: () => EditorState;
  onChange: (arg0: EditorState) => void;
};

type ControlComponent = ComponentType<ControlProps>;
type LegacyControlConfig = ControlComponent;
type CurrentControlConfig = {
  inline?: ControlComponent;
  block?: ControlComponent;
  meta?: ControlComponent;
};

type ControlConfig = CurrentControlConfig;
export type MetaToolbarProps = {
  showBlockEntities?: boolean | null;
  entityTypes: ReadonlyArray<EntityTypeControl>;
  controls: ReadonlyArray<ControlConfig>;
  getEditorState: () => EditorState;
  onChange: (state: EditorState) => void;
  onRequestSource: (entityType: string) => void;
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
              label={getControlLabel(t.type, t)}
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
        const Control = control.meta || (control as LegacyControlConfig);

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

export default MetaToolbar;
