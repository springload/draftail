import React from "react";
import { EditorState } from "draft-js";

import {
  ControlControl,
  EntityTypeControl,
  LegacyControlControl,
} from "../../api/types";
import { getControlLabel, showControl } from "../../api/ui";
import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";
import { getButtonTitle } from "./ToolbarDefaults";

export interface MetaToolbarProps {
  showBlockEntities?: boolean;
  entityTypes: ReadonlyArray<EntityTypeControl>;
  controls: ReadonlyArray<ControlControl | LegacyControlControl>;
  getEditorState: () => EditorState;
  onChange: (state: EditorState) => void;
  onRequestSource: (entityType: string) => void;
}

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
      <ToolbarGroup key="entities" name="entities">
        {entityTypes
          .filter((entityType) => showControl(entityType) && entityType.block)
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
    <ToolbarGroup name="controls">
      {controls.map((control, i) => {
        if (control.inline || control.block) {
          return null;
        }

        // Support the legacy and current controls APIs.
        const Control = control.meta || (control as LegacyControlControl);

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
