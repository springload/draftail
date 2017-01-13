import React, { Component } from 'react';

import {
    Editor,
    EditorState,
    RichUtils,
    Entity,
} from 'draft-js';

import { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from '../api/constants';
import config, { MAX_LIST_NESTING, STATE_SAVE_INTERVAL } from '../api/config';

import DraftUtils from '../api/DraftUtils';
import conversion from '../api/conversion';

import BlockControls from '../components/BlockControls';
import InlineStyleControls from '../components/InlineStyleControls';
import Button from '../components/Button';
import Portal from '../components/Portal';
import Tooltip from '../components/Tooltip';

import AtomicBlock from '../blocks/AtomicBlock';

const defaultOptions = {
    enableHorizontalRule: false,
    enableLineBreak: false,
    modelPickerOptions: [],
    imageFormats: [],
    entityTypes: [],
    blockTypes: [],
    inlineStyles: [],
};

/**
 * The top-level component for the Draft.js editor.
 */
class DraftailEditor extends Component {
    constructor(props) {
        super(props);
        const { rawContentState, options } = props;
        const decorators = options.entityTypes.filter(type => !!type.strategy);

        this.state = {
            editorState: conversion.createEditorState(rawContentState, decorators),
        };

        let updateTimeout;

        this.onChange = (editorState) => {
            this.setState({ editorState }, () => {
                if (updateTimeout) {
                    global.clearTimeout(updateTimeout);
                }
                updateTimeout = global.setTimeout(this.saveState, STATE_SAVE_INTERVAL);
            });
        };

        this.saveState = this.saveState.bind(this);

        this.handleReturn = this.handleReturn.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.onTab = this.onTab.bind(this);

        this.toggleBlockType = this.toggleBlockType.bind(this);
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);

        this.onEditEntity = this.onEditEntity.bind(this);
        this.onRemoveEntity = this.onRemoveEntity.bind(this);

        this.renderDialog = this.renderDialog.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
        this.renderControls = this.renderControls.bind(this);

        this.onRequestDialog = this.onRequestDialog.bind(this);
        this.onDialogComplete = this.onDialogComplete.bind(this);
        this.lockEditor = this.lockEditor.bind(this);
        this.unlockEditor = this.unlockEditor.bind(this);
        this.blockRenderer = this.blockRenderer.bind(this);

        this.onMouseUp = this.onMouseUp.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);

        this.addModel = this.addModel.bind(this);
        this.addHR = this.addHR.bind(this);
        this.addBR = this.addBR.bind(this);
    }

    saveState() {
        const { onSave } = this.props;
        const { editorState } = this.state;

        onSave(conversion.serialiseEditorState(editorState));
    }

    handleReturn(e) {
        const { options } = this.props;
        const { editorState } = this.state;
        let ret = false;

        // alt + enter opens links and other entities with a `url` property.
        if (e.altKey) {
            // Mark the return as handled even if there is no entity.
            // alt + enter should never create a newline anyway.
            ret = true;

            const entityKey = DraftUtils.getSelectionEntity(editorState);

            if (entityKey) {
                const entityData = Entity.get(entityKey).getData();

                if (entityData.url) {
                    global.open(entityData.url);
                }
            }
        } else {
            if (!options.enableLineBreak) {
                // Quick hack to disable soft line breaks.
                // eslint-disable-next-line no-param-reassign
                e.which = 0;
            }

            const newState = DraftUtils.handleNewLine(editorState, e);

            if (newState) {
                ret = true;
                this.onChange(newState);
            }
        }

        return ret;
    }

    onTab(event) {
        const { editorState } = this.state;
        const newState = RichUtils.onTab(event, editorState, MAX_LIST_NESTING);

        this.onChange(newState);
        return true;
    }

    handleKeyCommand(command) {
        const { editorState } = this.state;
        const isKnownCommand = (commands, comm) => Object.keys(commands).find(key => commands[key] === comm);
        let newState;
        let ret = false;

        if (isKnownCommand(ENTITY_TYPE, command)) {
            ret = true;
            this.onRequestDialog(command);
        } else if (isKnownCommand(BLOCK_TYPE, command)) {
            ret = true;
            this.toggleBlockType(command);
        } else if (isKnownCommand(INLINE_STYLE, command)) {
            ret = true;
            this.toggleInlineStyle(command);
        } else {
            newState = RichUtils.handleKeyCommand(editorState, command);

            if (newState) {
                ret = true;
                this.onChange(newState);
            }
        }

        return ret;
    }

    toggleBlockType(blockType) {
        const { editorState } = this.state;
        this.onChange(RichUtils.toggleBlockType(editorState, blockType));
    }

    toggleInlineStyle(inlineStyle) {
        const { editorState } = this.state;
        this.onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    }

    onEditEntity(entityKey) {
        const { options } = this.props;
        const { editorState } = this.state;
        const entity = Entity.get(entityKey);
        const entityData = entity.getData();
        const { contentType } = entityData;

        const entitySelectionState = DraftUtils.getSelectedEntitySelection(editorState);
        const nextState = EditorState.acceptSelection(editorState, entitySelectionState);
        this.onChange(nextState);

        const pickerOptions = options.modelPickerOptions.find(opt => opt.contentType === contentType);

        this.setState({
            activeEntityDialog: entity.type,
            entity,
            dialogOptions: {
                contentType,
                pickerOptions,
            },
        });
    }

    onRemoveEntity() {
        const { editorState } = this.state;
        const entitySelectionState = DraftUtils.getSelectedEntitySelection(editorState);

        this.setState({
            shouldShowTooltip: false,
        });

        this.onChange(RichUtils.toggleLink(editorState, entitySelectionState, null));
    }

    addHR() {
        const { editorState } = this.state;
        this.onChange(DraftUtils.addHorizontalRuleRemovingSelection(editorState));
    }

    addBR() {
        const { editorState } = this.state;
        this.onChange(DraftUtils.addLineBreakRemovingSelection(editorState));
    }

    addModel(entityName, contentType) {
        const { options } = this.props;
        const pickerOptions = options.modelPickerOptions.find(opt => opt.contentType === contentType);

        this.setState({
            activeBlockDialog: entityName,
            readOnly: true,
            dialogOptions: {
                contentType,
                pickerOptions,
            },
        });
    }

    blockRenderer(contentBlock) {
        const { options } = this.props;
        const { editorState } = this.state;
        const type = contentBlock.getType();

        switch (type) {
        case BLOCK_TYPE.ATOMIC:
            return {
                component: AtomicBlock,
                editable: false,
                props: {
                    options: options,
                    lockEditor: this.lockEditor,
                    unlockEditor: this.unlockEditor,
                    editorState: editorState,
                    onUpdate: this.onDialogComplete,
                },
            };

        default:
            return null;
        }
    }

    lockEditor() {
        this.setState({
            readOnly: true,
        });
    }

    unlockEditor() {
        this.setState({
            readOnly: false,
        });
    }

    onRequestDialog(entityType) {
        const { editorState } = this.state;
        const entityKey = DraftUtils.getSelectionEntity(editorState);

        this.setState({
            activeEntityDialog: entityType,
            entity: entityKey ? Entity.get(entityKey) : null,
            readOnly: true,
        });
    }

    onDialogComplete(nextState) {
        this.setState({
            activeEntityDialog: null,
            activeBlockDialog: null,
            dialogOptions: null,
        }, () => {
            if (nextState) {
                this.onChange(nextState);
            }

            global.setTimeout(() => {
                this.setState({ readOnly: false }, () => {
                    global.setTimeout(() => {
                        this.editorRef.focus();
                    }, 0);
                });
            }, 0);
        });
    }

    onMouseUp(e) {
        this.tooltip = e.target.closest('[data-tooltip]');

        this.setState({
            shouldShowTooltip: !!this.tooltip,
        });
    }

    onKeyUp() {
        this.setState({
            shouldShowTooltip: false,
        });
    }

    renderDialog() {
        const { options } = this.props;
        const { activeEntityDialog, activeBlockDialog, entity, editorState, dialogOptions } = this.state;
        const dialogType = activeEntityDialog || activeBlockDialog;
        let ret;

        if (dialogType) {
            const Dialog = options.entityTypes
                .find(item => item.type === dialogType).control;

            ret = (
                <Dialog
                    onClose={this.onDialogComplete}
                    onUpdate={this.onDialogComplete}
                    entityType={dialogType}
                    entity={entity}
                    editorState={editorState}
                    contentType={dialogOptions ? dialogOptions.contentType : null}
                    pickerOptions={dialogOptions ? dialogOptions.pickerOptions : null}
                />
            );
        } else {
            ret = null;
        }

        return ret;
    }

    renderTooltip() {
        const { editorState, shouldShowTooltip } = this.state;
        let tooltip = null;

        if (shouldShowTooltip) {
            const entityKey = DraftUtils.getSelectionEntity(editorState);

            const position = {
                top: this.tooltip.getBoundingClientRect().top + document.body.scrollTop + this.tooltip.offsetHeight,
                left: this.tooltip.getBoundingClientRect().left + document.body.scrollLeft,
            };

            tooltip = entityKey ? (
                <Tooltip
                    onRemove={this.onRemoveEntity}
                    onEdit={this.onEditEntity.bind(this, entityKey)}
                    entityData={Entity.get(entityKey).getData()}
                    position={position}
                />
            ) : null;
        }

        return (
            <Portal id="tooltip-portal">
                {tooltip}
            </Portal>
        );
    }

    renderControls() {
        const { options } = this.props;
        const { editorState, readOnly } = this.state;

        return (
            <div className={`editor__controls${readOnly ? ' editor--readonly' : ''}`} role="toolbar">
                <BlockControls
                    blockTypes={options.blockTypes}
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    inlineStyles={options.inlineStyles}
                    editorState={editorState}
                    onToggle={this.toggleInlineStyle}
                />

                {options.enableHorizontalRule ? (
                    <Button
                        onClick={this.addHR}
                        label="HR"
                        icon="horizontalrule"
                    />
                ) : null}

                {options.enableLineBreak ? (
                    <Button
                        onClick={this.addBR}
                        label="BR"
                    />
                ) : null}

                {options.entityTypes.map(entity => (
                    <Button
                        key={entity.type}
                        onClick={this.onRequestDialog.bind(this, entity.type)}
                        label={entity.label}
                        icon={entity.icon}
                    />
                ))}

                {options.modelPickerOptions.map(picker => (
                    <Button
                        key={picker.contentType}
                        onClick={this.addModel.bind(this, ENTITY_TYPE.MODEL, picker.contentType)}
                        label={picker.label}
                        icon={picker.icon}
                    />
                ))}
            </div>
        );
    }

    render() {
        const { options } = this.props;
        const { editorState, readOnly } = this.state;

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        return (
            <div
                onBlur={this.saveState}
                onMouseUp={this.onMouseUp}
                onKeyUp={this.onKeyUp}
            >
                {this.renderControls()}

                <Editor
                    ref={(ref) => { this.editorRef = ref; }}
                    editorState={editorState}
                    onChange={this.onChange}
                    readOnly={readOnly}
                    handleReturn={this.handleReturn}
                    keyBindingFn={config.getKeyBindingFn(options.blockTypes, options.inlineStyles, options.entityTypes)}
                    handleKeyCommand={this.handleKeyCommand}
                    onTab={this.onTab}
                    blockRendererFn={this.blockRenderer}
                    blockRenderMap={config.getBlockRenderMap(options.blockTypes)}
                    blockStyleFn={config.getBlockStyleFn(options.blockTypes)}
                />

                {this.renderTooltip()}

                {this.renderDialog()}
            </div>
        );
    }
}

DraftailEditor.propTypes = {
    rawContentState: React.PropTypes.object,
    onSave: React.PropTypes.func,
    options: React.PropTypes.shape({
        enableHorizontalRule: React.PropTypes.boolean,
        enableLineBreak: React.PropTypes.boolean,
        modelPickerOptions: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.string.isRequired,
            contentType: React.PropTypes.string.isRequired,
            fields: React.PropTypes.arrayOf(React.PropTypes.shape({
                label: React.PropTypes.string.isRequired,
                name: React.PropTypes.string.isRequired,
            })),
            display: React.PropTypes.string.isRequired,
        })).isRequired,
        imageFormats: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.string.isRequired,
            value: React.PropTypes.string.isRequired,
        })).isRequired,
        entityTypes: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.string.isRequired,
            type: React.PropTypes.string.isRequired,
            icon: React.PropTypes.string,
            control: React.PropTypes.func.isRequired,
            strategy: React.PropTypes.func,
            component: React.PropTypes.func,
        })).isRequired,
        blockTypes: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.string.isRequired,
            type: React.PropTypes.string.isRequired,
            icon: React.PropTypes.string,
            element: React.PropTypes.string,
            className: React.PropTypes.string,
        })).isRequired,
        inlineStyles: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.string.isRequired,
            type: React.PropTypes.string.isRequired,
            icon: React.PropTypes.string,
        })).isRequired,
    }),
};

DraftailEditor.defaultProps = {
    rawContentState: {},
    onSave: () => {},
    options: defaultOptions,
};

export default DraftailEditor;
