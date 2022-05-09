// @flow
import React, { PureComponent } from "react";

import ToolbarButton from "./ToolbarButton";
import ToolbarGroup from "./ToolbarGroup";

import {
  BR_TYPE,
  ENTITY_TYPE,
  UNDO_TYPE,
  REDO_TYPE,
  LABELS,
  DESCRIPTIONS,
} from "../../api/constants";
import behavior from "../../api/behavior";
import type { IconProp } from "./Icon";

type ControlProp = {
  // Describes the control in the editor UI, concisely.
  label?: ?string,
  // Describes the control in the editor UI.
  description?: string,
  // Represents the control in the editor UI.
  icon?: IconProp,
};

const getButtonLabel = (type: string, config: boolean | ControlProp) => {
  const icon = typeof config === "boolean" ? undefined : config.icon;

  if (typeof config.label === "string" || config.label === null) {
    return config.label;
  }

  if (typeof icon !== "undefined") {
    return null;
  }

  return LABELS[type];
};

const showButton = (config: ControlProp & { type: string }) =>
  Boolean(config.icon) || Boolean(getButtonLabel(config.type, config));

const getButtonTitle = (type: string, config: boolean | ControlProp) => {
  const description =
    typeof config === "boolean" || typeof config.description === "undefined"
      ? DESCRIPTIONS[type]
      : config.description;
  const hasShortcut = behavior.hasKeyboardShortcut(type);
  let title = description;

  if (hasShortcut) {
    const desc = description ? `${description}\n` : "";
    title = `${desc}${behavior.getKeyboardShortcut(type)}`;
  }

  return title;
};

export type ToolbarDefaultProps = {
  currentStyles: {
    has: (style: string) => boolean,
  },
  currentBlock: string,
  enableHorizontalRule: boolean | ControlProp,
  enableLineBreak: boolean | ControlProp,
  showUndoControl: boolean | ControlProp,
  showRedoControl: boolean | ControlProp,
  entityTypes: $ReadOnlyArray<{
    ...ControlProp,
    type: string,
  }>,
  blockTypes: $ReadOnlyArray<{
    ...ControlProp,
    type: string,
  }>,
  inlineStyles: $ReadOnlyArray<{
    ...ControlProp,
    type: string,
  }>,
  toggleBlockType: (blockType: string) => void,
  toggleInlineStyle: (inlineStyle: string) => void,
  addHR: () => void,
  addBR: () => void,
  onUndoRedo: (type: string) => void,
  onRequestSource: (entityType: string) => void,
};

class ToolbarDefaults extends PureComponent<ToolbarDefaultProps> {
  render() {
    const {
      currentStyles,
      currentBlock,
      blockTypes,
      inlineStyles,
      enableHorizontalRule,
      enableLineBreak,
      showUndoControl,
      showRedoControl,
      entityTypes,
      toggleBlockType,
      toggleInlineStyle,
      addHR,
      addBR,
      onUndoRedo,
      onRequestSource,
    } = this.props;
    return [
      <ToolbarGroup key="styles">
        {inlineStyles.filter(showButton).map((t) => (
          <ToolbarButton
            key={t.type}
            name={t.type}
            active={currentStyles.has(t.type)}
            label={getButtonLabel(t.type, t)}
            title={getButtonTitle(t.type, t)}
            icon={t.icon}
            onClick={toggleInlineStyle}
          />
        ))}
      </ToolbarGroup>,

      <ToolbarGroup key="blocks">
        {blockTypes.filter(showButton).map((t) => (
          <ToolbarButton
            key={t.type}
            name={t.type}
            active={currentBlock === t.type}
            label={getButtonLabel(t.type, t)}
            title={getButtonTitle(t.type, t)}
            icon={t.icon}
            onClick={toggleBlockType}
          />
        ))}
      </ToolbarGroup>,

      <ToolbarGroup key="hr-br">
        {enableHorizontalRule ? (
          <ToolbarButton
            name={ENTITY_TYPE.HORIZONTAL_RULE}
            onClick={addHR}
            label={getButtonLabel(
              ENTITY_TYPE.HORIZONTAL_RULE,
              enableHorizontalRule,
            )}
            title={getButtonTitle(
              ENTITY_TYPE.HORIZONTAL_RULE,
              enableHorizontalRule,
            )}
            icon={
              typeof enableHorizontalRule !== "boolean"
                ? enableHorizontalRule.icon
                : null
            }
          />
        ) : null}

        {enableLineBreak ? (
          <ToolbarButton
            name={BR_TYPE}
            onClick={addBR}
            label={getButtonLabel(BR_TYPE, enableLineBreak)}
            title={getButtonTitle(BR_TYPE, enableLineBreak)}
            icon={
              typeof enableLineBreak !== "boolean" ? enableLineBreak.icon : null
            }
          />
        ) : null}
      </ToolbarGroup>,

      <ToolbarGroup key="entities">
        {entityTypes.filter(showButton).map((t) => (
          <ToolbarButton
            key={t.type}
            name={t.type}
            onClick={onRequestSource}
            label={getButtonLabel(t.type, t)}
            title={getButtonTitle(t.type, t)}
            icon={t.icon}
          />
        ))}
      </ToolbarGroup>,

      <ToolbarGroup key="undo-redo">
        {showUndoControl ? (
          <ToolbarButton
            name={UNDO_TYPE}
            onClick={onUndoRedo}
            label={getButtonLabel(UNDO_TYPE, showUndoControl)}
            title={getButtonTitle(UNDO_TYPE, showUndoControl)}
            icon={
              typeof showUndoControl !== "boolean" ? showUndoControl.icon : null
            }
          />
        ) : null}

        {showRedoControl ? (
          <ToolbarButton
            name={REDO_TYPE}
            onClick={onUndoRedo}
            label={getButtonLabel(REDO_TYPE, showRedoControl)}
            title={getButtonTitle(REDO_TYPE, showRedoControl)}
            icon={
              typeof showRedoControl !== "boolean" ? showRedoControl.icon : null
            }
          />
        ) : null}
      </ToolbarGroup>,
    ];
  }
}

export default ToolbarDefaults;
