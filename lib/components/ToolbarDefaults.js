import PropTypes from "prop-types";
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
} from "../api/constants";
import behavior from "../api/behavior";

const getButtonLabel = (type, icon, label = icon ? null : LABELS[type]) =>
  label;

const getButtonTitle = (type, description = DESCRIPTIONS[type]) => {
  const hasShortcut = behavior.hasKeyboardShortcut(type);
  let title = description;

  if (hasShortcut) {
    const desc = description ? `${description}\n` : "";
    title = `${desc}${behavior.getKeyboardShortcut(type)}`;
  }

  return title;
};

class ToolbarDefaults extends PureComponent {
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
        {inlineStyles.map((t) => (
          <ToolbarButton
            key={t.type}
            name={t.type}
            active={currentStyles.has(t.type)}
            label={getButtonLabel(t.type, t.icon, t.label)}
            title={getButtonTitle(t.type, t.description)}
            icon={t.icon}
            onClick={toggleInlineStyle}
          />
        ))}
      </ToolbarGroup>,

      <ToolbarGroup key="blocks">
        {blockTypes.map((t) => (
          <ToolbarButton
            key={t.type}
            name={t.type}
            active={currentBlock === t.type}
            label={getButtonLabel(t.type, t.icon, t.label)}
            title={getButtonTitle(t.type, t.description)}
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
              enableHorizontalRule.icon,
              enableHorizontalRule.label,
            )}
            title={getButtonTitle(
              ENTITY_TYPE.HORIZONTAL_RULE,
              enableHorizontalRule.description,
            )}
            icon={enableHorizontalRule.icon}
          />
        ) : null}

        {enableLineBreak ? (
          <ToolbarButton
            name={BR_TYPE}
            onClick={addBR}
            label={getButtonLabel(
              BR_TYPE,
              enableLineBreak.icon,
              enableLineBreak.label,
            )}
            title={getButtonTitle(BR_TYPE, enableLineBreak.description)}
            icon={enableLineBreak.icon}
          />
        ) : null}
      </ToolbarGroup>,

      <ToolbarGroup key="entities">
        {entityTypes.map((t) => (
          <ToolbarButton
            key={t.type}
            name={t.type}
            onClick={onRequestSource}
            label={getButtonLabel(t.type, t.icon, t.label)}
            title={getButtonTitle(t.type, t.description)}
            icon={t.icon}
          />
        ))}
      </ToolbarGroup>,

      <ToolbarGroup key="undo-redo">
        {showUndoControl ? (
          <ToolbarButton
            name={UNDO_TYPE}
            onClick={onUndoRedo}
            label={getButtonLabel(
              UNDO_TYPE,
              showUndoControl.icon,
              showUndoControl.label,
            )}
            title={getButtonTitle(UNDO_TYPE, showUndoControl.description)}
          />
        ) : null}

        {showRedoControl ? (
          <ToolbarButton
            name={REDO_TYPE}
            onClick={onUndoRedo}
            label={getButtonLabel(
              REDO_TYPE,
              showRedoControl.icon,
              showRedoControl.label,
            )}
            title={getButtonTitle(REDO_TYPE, showRedoControl.description)}
          />
        ) : null}
      </ToolbarGroup>,
    ];
  }
}

ToolbarDefaults.propTypes = {
  currentStyles: PropTypes.object.isRequired,
  currentBlock: PropTypes.string.isRequired,
  enableHorizontalRule: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      // Describes the control in the editor UI, concisely.
      label: PropTypes.string,
      // Describes the control in the editor UI.
      description: PropTypes.string,
      // Represents the control in the editor UI.
      icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.node,
      ]),
    }),
  ]).isRequired,
  enableLineBreak: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      // Describes the control in the editor UI, concisely.
      label: PropTypes.string,
      // Describes the control in the editor UI.
      description: PropTypes.string,
      // Represents the control in the editor UI.
      icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.node,
      ]),
    }),
  ]).isRequired,
  showUndoControl: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      // Describes the control in the editor UI, concisely.
      label: PropTypes.string,
      // Describes the control in the editor UI.
      description: PropTypes.string,
      // Represents the control in the editor UI.
      icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.node,
      ]),
    }),
  ]).isRequired,
  showRedoControl: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      // Describes the control in the editor UI, concisely.
      label: PropTypes.string,
      // Describes the control in the editor UI.
      description: PropTypes.string,
      // Represents the control in the editor UI.
      icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.node,
      ]),
    }),
  ]).isRequired,
  entityTypes: PropTypes.array.isRequired,
  blockTypes: PropTypes.array.isRequired,
  inlineStyles: PropTypes.array.isRequired,
  toggleBlockType: PropTypes.func.isRequired,
  toggleInlineStyle: PropTypes.func.isRequired,
  addHR: PropTypes.func.isRequired,
  addBR: PropTypes.func.isRequired,
  onUndoRedo: PropTypes.func.isRequired,
  onRequestSource: PropTypes.func.isRequired,
};

export default ToolbarDefaults;
