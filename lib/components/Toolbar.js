import PropTypes from 'prop-types';
import React, { Component } from 'react';

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

// eslint-disable-next-line springload/react/prefer-stateless-function
class Toolbar extends Component {
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
            controls,
            toggleBlockType,
            toggleInlineStyle,
            addHR,
            addBR,
            onUndoRedo,
            onRequestSource,
            getEditorState,
            onChange,
        } = this.props;
        return (
            <div className="Draftail-Toolbar" role="toolbar">
                <ToolbarGroup>
                    {inlineStyles.map(style => (
                        <ToolbarButton
                            key={style.type}
                            name={style.type}
                            active={currentStyles.has(style.type)}
                            label={getButtonLabel(
                                style.type,
                                style.icon,
                                style.label,
                            )}
                            title={getButtonTitle(
                                style.type,
                                style.description,
                            )}
                            icon={style.icon}
                            onClick={toggleInlineStyle}
                        />
                    ))}
                </ToolbarGroup>

                <ToolbarGroup>
                    {blockTypes.map(block => (
                        <ToolbarButton
                            key={block.type}
                            name={block.type}
                            active={currentBlock === block.type}
                            label={getButtonLabel(
                                block.type,
                                block.icon,
                                block.label,
                            )}
                            title={getButtonTitle(
                                block.type,
                                block.description,
                            )}
                            icon={block.icon}
                            onClick={toggleBlockType}
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
                            title={getButtonTitle(
                                BR_TYPE,
                                enableLineBreak.description,
                            )}
                            icon={enableLineBreak.icon}
                        />
                    ) : null}
                </ToolbarGroup>

                <ToolbarGroup>
                    {entityTypes.map(entity => (
                        <ToolbarButton
                            key={entity.type}
                            name={entity.type}
                            onClick={onRequestSource}
                            label={getButtonLabel(
                                entity.type,
                                entity.icon,
                                entity.label,
                            )}
                            title={getButtonTitle(
                                entity.type,
                                entity.description,
                            )}
                            icon={entity.icon}
                        />
                    ))}
                </ToolbarGroup>

                <ToolbarGroup>
                    {showUndoControl ? (
                        <ToolbarButton
                            name={UNDO_TYPE}
                            onClick={onUndoRedo}
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
                            onClick={onUndoRedo}
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

                    {controls.map((Control, i) => (
                        <Control
                            // eslint-disable-next-line springload/react/no-array-index-key
                            key={i}
                            getEditorState={getEditorState}
                            onChange={onChange}
                        />
                    ))}
                </ToolbarGroup>
            </div>
        );
    }
}

Toolbar.propTypes = {
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
    controls: PropTypes.array.isRequired,
    toggleBlockType: PropTypes.func.isRequired,
    toggleInlineStyle: PropTypes.func.isRequired,
    addHR: PropTypes.func.isRequired,
    addBR: PropTypes.func.isRequired,
    onUndoRedo: PropTypes.func.isRequired,
    onRequestSource: PropTypes.func.isRequired,
    getEditorState: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Toolbar;
