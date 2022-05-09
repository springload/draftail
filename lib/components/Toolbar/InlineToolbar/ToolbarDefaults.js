// @flow
import React, { PureComponent } from "react";
import type { ComponentType } from "react";

import ToolbarButton from "../ToolbarButton";
import ToolbarGroup from "../ToolbarGroup";

import {
  BR_TYPE,
  ENTITY_TYPE,
  UNDO_TYPE,
  REDO_TYPE,
  LABELS,
  DESCRIPTIONS,
} from "../../../api/constants";
import behavior from "../../../api/behavior";
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

const showEntityButton = (config: ControlProp & { type: string }) =>
  showButton(config) && Boolean(config.decorator);

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
  entityTypes: $ReadOnlyArray<{
    ...ControlProp,
    type: string,
    decorator?: ComponentType<{}>,
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
  onRequestSource: (entityType: string) => void,
};

class ToolbarDefaults extends PureComponent<ToolbarDefaultProps> {
  render() {
    const {
      currentStyles,
      currentBlock,
      blockTypes,
      inlineStyles,
      entityTypes,
      toggleBlockType,
      toggleInlineStyle,
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

      <ToolbarGroup key="entities">
        {entityTypes.filter(showEntityButton).map((t) => (
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
    ];
  }
}

export default ToolbarDefaults;
