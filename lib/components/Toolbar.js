import PropTypes from 'prop-types';
import React from 'react';

import DraftUtils from '../api/DraftUtils';

import Button from '../components/Button';
import ToolbarGroup from '../components/ToolbarGroup';

import { BR_TYPE, ENTITY_TYPE, UNDO_TYPE, REDO_TYPE } from '../api/constants';
import behavior from '../api/behavior';

const getButtonTitle = (description, name) => {
    const hasShortcut = behavior.hasKeyboardShortcut(name);
    let title = description;

    if (hasShortcut) {
        const desc = description ? `${description} ` : '';
        title = `${desc}(${behavior.getKeyboardShortcut(name)})`;
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
                <Button
                    key={style.type}
                    name={style.type}
                    active={DraftUtils.hasCurrentInlineStyle(
                        editorState,
                        style.type,
                    )}
                    label={style.label}
                    title={getButtonTitle(style.description, style.type)}
                    icon={style.icon}
                    onClick={toggleInlineStyle.bind(null, style.type)}
                />
            ))}
        </ToolbarGroup>

        <ToolbarGroup>
            {blockTypes.map(block => (
                <Button
                    key={block.type}
                    name={block.type}
                    active={DraftUtils.isSelectedBlockType(
                        editorState,
                        block.type,
                    )}
                    label={block.label}
                    title={getButtonTitle(block.description, block.type)}
                    icon={block.icon}
                    onClick={toggleBlockType.bind(null, block.type)}
                />
            ))}
        </ToolbarGroup>

        <ToolbarGroup>
            {enableHorizontalRule ? (
                <Button
                    name={ENTITY_TYPE.HORIZONTAL_RULE}
                    onClick={addHR}
                    label="―"
                    title="Horizontal line"
                />
            ) : null}

            {enableLineBreak ? (
                <Button
                    name={BR_TYPE}
                    onClick={addBR}
                    label="↵"
                    title={getButtonTitle('Line break', BR_TYPE)}
                />
            ) : null}
        </ToolbarGroup>

        <ToolbarGroup>
            {entityTypes.map(entity => (
                <Button
                    key={entity.type}
                    name={entity.type}
                    onClick={onRequestDialog.bind(null, entity.type)}
                    label={entity.label}
                    title={getButtonTitle(entity.description, entity.type)}
                    icon={entity.icon}
                />
            ))}
        </ToolbarGroup>

        <ToolbarGroup>
            {showUndoRedoControls ? (
                <Button
                    name={UNDO_TYPE}
                    onClick={onUndoRedo.bind(null, UNDO_TYPE)}
                    label="↺"
                    title={getButtonTitle('Undo', UNDO_TYPE)}
                />
            ) : null}

            {showUndoRedoControls ? (
                <Button
                    name={REDO_TYPE}
                    onClick={onUndoRedo.bind(null, REDO_TYPE)}
                    label="↻"
                    title={getButtonTitle('Redo', REDO_TYPE)}
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
