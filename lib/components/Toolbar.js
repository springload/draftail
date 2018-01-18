import PropTypes from 'prop-types';
import React from 'react';

import DraftUtils from '../api/DraftUtils';

import ToolbarButton from '../components/ToolbarButton';
import ToolbarGroup from '../components/ToolbarGroup';

import {
    BR_TYPE,
    ENTITY_TYPE,
    UNDO_TYPE,
    REDO_TYPE,
    LABELS,
    DESCRIPTIONS,
} from '../api/constants';
import behavior from '../api/behavior';

const getButtonLabel = (type, icon, label = icon ? null : LABELS[type]) =>
    label;

const getButtonTitle = (type, description = DESCRIPTIONS[type]) => {
    const hasShortcut = behavior.hasKeyboardShortcut(type);
    let title = description;

    if (hasShortcut) {
        const desc = description ? `${description}\n` : '';
        title = `${desc}${behavior.getKeyboardShortcut(type)}`;
    }

    return title;
};

const Toolbar = ({
    editorState,
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
}) => (
    <div className="Draftail-Toolbar" role="toolbar">
        <ToolbarGroup>
            {inlineStyles.map(style => (
                <ToolbarButton
                    key={style.type}
                    name={style.type}
                    active={DraftUtils.hasCurrentInlineStyle(
                        editorState,
                        style.type,
                    )}
                    label={getButtonLabel(style.type, style.icon, style.label)}
                    title={getButtonTitle(style.type, style.description)}
                    icon={style.icon}
                    onClick={toggleInlineStyle.bind(null, style.type)}
                />
            ))}
        </ToolbarGroup>

        <ToolbarGroup>
            {blockTypes.map(block => (
                <ToolbarButton
                    key={block.type}
                    name={block.type}
                    active={DraftUtils.isSelectedBlockType(
                        editorState,
                        block.type,
                    )}
                    label={getButtonLabel(block.type, block.icon, block.label)}
                    title={getButtonTitle(block.type, block.description)}
                    icon={block.icon}
                    onClick={toggleBlockType.bind(null, block.type)}
                />
            ))}
        </ToolbarGroup>

        <ToolbarGroup>
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
        </ToolbarGroup>

        <ToolbarGroup>
            {entityTypes.map(entity => (
                <ToolbarButton
                    key={entity.type}
                    name={entity.type}
                    onClick={onRequestSource.bind(null, entity.type)}
                    label={getButtonLabel(
                        entity.type,
                        entity.icon,
                        entity.label,
                    )}
                    title={getButtonTitle(entity.type, entity.description)}
                    icon={entity.icon}
                />
            ))}
        </ToolbarGroup>

        <ToolbarGroup>
            {showUndoControl ? (
                <ToolbarButton
                    name={UNDO_TYPE}
                    onClick={onUndoRedo.bind(null, UNDO_TYPE)}
                    label={getButtonLabel(
                        UNDO_TYPE,
                        showUndoControl.icon,
                        showUndoControl.label,
                    )}
                    title={getButtonTitle(
                        UNDO_TYPE,
                        showUndoControl.description,
                    )}
                />
            ) : null}

            {showRedoControl ? (
                <ToolbarButton
                    name={REDO_TYPE}
                    onClick={onUndoRedo.bind(null, REDO_TYPE)}
                    label={getButtonLabel(
                        REDO_TYPE,
                        showRedoControl.icon,
                        showRedoControl.label,
                    )}
                    title={getButtonTitle(
                        REDO_TYPE,
                        showRedoControl.description,
                    )}
                />
            ) : null}
        </ToolbarGroup>
    </div>
);

Toolbar.propTypes = {
    editorState: PropTypes.object.isRequired,
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

export default Toolbar;
