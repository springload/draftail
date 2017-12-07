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
    showUndoRedoControls,
    entityTypes,
    toggleBlockType,
    toggleInlineStyle,
    addHR,
    addBR,
    onUndoRedo,
    onRequestDialog,
}) => (
    <div className="editor__toolbar" role="toolbar">
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
                    label={getButtonLabel(ENTITY_TYPE.HORIZONTAL_RULE)}
                    title={getButtonTitle(ENTITY_TYPE.HORIZONTAL_RULE)}
                />
            ) : null}

            {enableLineBreak ? (
                <ToolbarButton
                    name={BR_TYPE}
                    onClick={addBR}
                    label={getButtonLabel(BR_TYPE)}
                    title={getButtonTitle(BR_TYPE)}
                />
            ) : null}
        </ToolbarGroup>

        <ToolbarGroup>
            {entityTypes.map(entity => (
                <ToolbarButton
                    key={entity.type}
                    name={entity.type}
                    onClick={onRequestDialog.bind(null, entity.type)}
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
            {showUndoRedoControls ? (
                <ToolbarButton
                    name={UNDO_TYPE}
                    onClick={onUndoRedo.bind(null, UNDO_TYPE)}
                    label={getButtonLabel(UNDO_TYPE)}
                    title={getButtonTitle(UNDO_TYPE)}
                />
            ) : null}

            {showUndoRedoControls ? (
                <ToolbarButton
                    name={REDO_TYPE}
                    onClick={onUndoRedo.bind(null, REDO_TYPE)}
                    label={getButtonLabel(REDO_TYPE)}
                    title={getButtonTitle(REDO_TYPE)}
                />
            ) : null}
        </ToolbarGroup>
    </div>
);

Toolbar.propTypes = {
    editorState: PropTypes.object.isRequired,
    enableHorizontalRule: PropTypes.bool.isRequired,
    enableLineBreak: PropTypes.bool.isRequired,
    showUndoRedoControls: PropTypes.bool.isRequired,
    entityTypes: PropTypes.array.isRequired,
    blockTypes: PropTypes.array.isRequired,
    inlineStyles: PropTypes.array.isRequired,
    toggleBlockType: PropTypes.func.isRequired,
    toggleInlineStyle: PropTypes.func.isRequired,
    addHR: PropTypes.func.isRequired,
    addBR: PropTypes.func.isRequired,
    onUndoRedo: PropTypes.func.isRequired,
    onRequestDialog: PropTypes.func.isRequired,
};

export default Toolbar;
