import React, { PureComponent } from "react";
import type { ComponentType } from "react";

import ToolbarButton from "../ToolbarButton";
import ToolbarGroup from "../ToolbarGroup";

import { LABELS, DESCRIPTIONS } from "../../../api/constants";
import { getControlLabel } from "../../../api/ui";
import behavior from "../../../api/behavior";
import type { IconProp } from "../../Icon";

type ControlProp = {
  // Describes the control in the editor UI, concisely.
  label?: string | null | undefined;
  // Describes the control in the editor UI.
  description?: string;
  // Represents the control in the editor UI.
  icon?: IconProp;
};

const showButton = (
  config: ControlProp & {
    type: string;
  },
) => Boolean(config.icon) || Boolean(getControlLabel(config.type, config));

const showEntityButton = (
  config: ControlProp & {
    type: string;
    decorator?: ComponentType<{}>;
  },
) => showButton(config) && Boolean(config.decorator);

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
    has: (style: string) => boolean;
  };
  currentBlock: string;
  entityTypes: ReadonlyArray<
    ControlProp & {
      type: string;
      decorator?: ComponentType<{}>;
    }
  >;
  blockTypes: ReadonlyArray<
    ControlProp & {
      type: string;
    }
  >;
  inlineStyles: ReadonlyArray<
    ControlProp & {
      type: string;
    }
  >;
  toggleBlockType: (blockType: string) => void;
  toggleInlineStyle: (inlineStyle: string) => void;
  onRequestSource: (entityType: string) => void;
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
            label={getControlLabel(t.type, t)}
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
            label={getControlLabel(t.type, t)}
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
            label={getControlLabel(t.type, t)}
            title={getButtonTitle(t.type, t)}
            icon={t.icon}
          />
        ))}
      </ToolbarGroup>,
    ];
  }
}

export default ToolbarDefaults;
