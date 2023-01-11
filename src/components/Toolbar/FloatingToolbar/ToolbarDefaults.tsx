import React, { PureComponent } from "react";

import ToolbarButton from "../ToolbarButton";
import ToolbarGroup from "../ToolbarGroup";

import { EntityTypeControl } from "../../../api/types";
import { getControlLabel, showControl } from "../../../api/ui";
import { getButtonTitle, ToolbarDefaultProps } from "../ToolbarDefaults";

const showEntityButton = (config: EntityTypeControl) =>
  showControl(config) && Boolean(config.decorator);

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
      <ToolbarGroup key="styles" name="styles">
        {inlineStyles.filter(showControl).map((t) => (
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

      <ToolbarGroup key="blocks" name="blocks">
        {blockTypes.filter(showControl).map((t) => (
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

      <ToolbarGroup key="entities" name="entities">
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
