import React, { PureComponent } from "react";
import { DraftInlineStyle } from "draft-js";

import ToolbarButton from "../ToolbarButton";
import ToolbarGroup from "../ToolbarGroup";

import {
  BlockTypeControl,
  BoolControl,
  Control,
  EntityTypeControl,
  InlineStyleControl,
} from "../../../api/types";
import { DESCRIPTIONS, KnownFormatType } from "../../../api/constants";
import { getControlLabel } from "../../../api/ui";
import behavior from "../../../api/behavior";

const showButton = (config: Control) =>
  Boolean(config.icon) || Boolean(getControlLabel(config.type, config));

const showEntityButton = (config: EntityTypeControl) =>
  showButton(config) && Boolean(config.decorator);

const getButtonTitle = (type: string, config: BoolControl) => {
  const description =
    typeof config === "boolean" || typeof config.description === "undefined"
      ? DESCRIPTIONS[type as KnownFormatType]
      : config.description;
  const hasShortcut = behavior.hasKeyboardShortcut(type);
  let title = description;

  if (hasShortcut) {
    const desc = description ? `${description}\n` : "";
    title = `${desc}${behavior.getKeyboardShortcut(type)}`;
  }

  return title;
};

export interface ToolbarDefaultProps {
  currentStyles: DraftInlineStyle;
  currentBlock: string;
  entityTypes: ReadonlyArray<EntityTypeControl>;
  blockTypes: ReadonlyArray<BlockTypeControl>;
  inlineStyles: ReadonlyArray<InlineStyleControl>;
  toggleBlockType: (blockType: string) => void;
  toggleInlineStyle: (inlineStyle: string) => void;
  onRequestSource: (entityType: string) => void;
}

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
