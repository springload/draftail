import React, { Component } from 'react';

import {
    Editor,
    EditorState,
    RichUtils,
    CompositeDecorator,
    Entity,
    SelectionState,
} from 'draft-js';

import { BLOCK_TYPE } from '../api/constants';
import config, { MAX_LIST_NESTING, STATE_SAVE_INTERVAL } from '../api/config';

import DraftUtils from '../api/DraftUtils';
import conversion from '../api/conversion';

import keyBindingFn from '../utils/keybindings';

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
    mediaControls: [],
    dialogControls: [],
    sources: [],
    decorators: [],
    BLOCK_TYPES: [],
    INLINE_STYLES: [],
};

/**
 * The top-level component for the Draft.js editor.
 */
class DraftailEditor extends Component {
    constructor(props) {
        super(props);
        const { rawContentState, options } = props;
        const decorators = new CompositeDecorator(options.decorators);

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

        this.toggleBlockType = this.toggleBlockType.bind(this);
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);

        this.handleReturn = this.handleReturn.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);
        this.handleTabCommand = this.handleTabCommand.bind(this);

        this.onEditEntity = this.onEditEntity.bind(this);
        this.onRemoveEntity = this.onRemoveEntity.bind(this);

        this.renderDialog = this.renderDialog.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
        this.renderControls = this.renderControls.bind(this);

        this.onRequestDialog = this.onRequestDialog.bind(this);
        this.saveState = this.saveState.bind(this);
        this.setSelectionToCurrentEntity = this.setSelectionToCurrentEntity.bind(this);
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

    // Sets a selection to encompass the containing entity.
    setSelectionToCurrentEntity() {
        const { editorState } = this.state;
        const startKey = editorState.getSelection().getStartKey();
        const block = editorState.getCurrentContent().getBlockForKey(startKey);
        const selectionState = editorState.getSelection();
        const startOffset = selectionState.getAnchorOffset();
        const endOffset = selectionState.getFocusOffset();

        // let entity;
        let nextStart;
        let nextEnd;

        block.findEntityRanges((character) => {
            const entityKey = character.getEntity();
            return entityKey !== null;
        }, (entityStart, entityEnd) => {
            if (startOffset >= entityStart && endOffset <= entityEnd) {
                // const entityKey = block.getEntityAt(entityStart);

                // if (entityKey) {
                //     entity = Entity.get(entityKey);
                // }

                nextStart = entityStart;
                nextEnd = entityEnd;
            }
        });

        if (nextEnd) {
            const nextSelection = SelectionState.createEmpty(startKey);
            const updatedSelection = nextSelection.merge({
                anchorOffset: nextStart,
                focusKey: startKey,
                focusOffset: nextEnd,
            });
            const nextState = EditorState.acceptSelection(editorState, updatedSelection);
            this.onChange(nextState);

            global.setTimeout(() => this.editorRef.focus(), 0);
        }
    }

    handleReturn(e) {
        const { options } = this.props;
        const { editorState } = this.state;
        let ret = false;

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

        return ret;
    }

    handleTabCommand(event) {
        const { editorState } = this.state;
        const newState = RichUtils.onTab(event, editorState, MAX_LIST_NESTING);

        this.onChange(newState);
        return true;
    }

    handleKeyCommand(command) {
        const { editorState } = this.state;
        const newState = RichUtils.handleKeyCommand(editorState, command);
        let ret = false;

        if (newState) {
            ret = true;
            this.onChange(newState);
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
        const entity = Entity.get(entityKey);
        const entityData = entity.getData();
        const { contentType } = entityData;

        this.setSelectionToCurrentEntity();

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

    onRequestDialog(entityName) {
        const { editorState } = this.state;
        const selection = editorState.getSelection();

        if (selection.isCollapsed()) {
            this.setState({
                activeEntityDialog: entityName,
                entity: null,
                readOnly: true,
            });
        } else {
            const selectionState = editorState.getSelection();
            const selStart = selectionState.getStartOffset();
            const startKey = editorState.getSelection().getStartKey();
            const selectedBlock = editorState.getCurrentContent().getBlockForKey(startKey);

            let entity;
            const entityId = selectedBlock.getEntityAt(selStart);

            if (entityId) {
                entity = Entity.get(entityId);
            }

            this.setState({
                activeEntityDialog: entityName,
                entity: entityId ? entity : null,
                readOnly: true,
            });
        }
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
        const activeDialogType = activeEntityDialog || activeBlockDialog;
        let dialog;
        let Klass;
        let props;

        if (activeDialogType) {
            dialog = options.sources.find(src => src.entity === activeDialogType);

            Klass = dialog.control;
            props = {
                onClose: this.onDialogComplete,
                onUpdate: this.onDialogComplete,
                entityType: activeDialogType,
                entity,
                editorState,
            };

            if (dialogOptions) {
                props = Object.assign({}, props, dialogOptions);
            }

            if (entity) {
                props.contentType = entity.getData().contentType;
            }

            return (
                <Klass {...props} />
            );
        }

        return null;
    }

    renderTooltip() {
        const { editorState, shouldShowTooltip } = this.state;
        let tooltip = null;

        if (shouldShowTooltip) {
            const entityKey = DraftUtils.getSelectionEntity(editorState);
            const entityData = DraftUtils.getEntityData(entityKey);

            const position = {
                top: this.tooltip.getBoundingClientRect().top + document.body.scrollTop + this.tooltip.offsetHeight,
                left: this.tooltip.getBoundingClientRect().left + document.body.scrollLeft,
            };

            tooltip = entityData ? (
                <Tooltip
                    onRemove={this.onRemoveEntity}
                    onEdit={this.onEditEntity.bind(this, entityKey)}
                    entityData={entityData}
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

        // const addMedia = (type) => {
        //     this.setState({
        //         activeBlockDialog: type,
        //         readOnly: true,
        //     });
        // };

        return (
            <div className={`editor__controls${readOnly ? ' editor--readonly' : ''}`} role="toolbar">
                <BlockControls
                    styles={options.BLOCK_TYPES}
                    editorState={editorState}
                    onToggle={this.toggleBlockType}
                />
                <InlineStyleControls
                    styles={options.INLINE_STYLES}
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

                {options.mediaControls.map(control => (
                    <Button
                        key={control.entity}
                        onClick={this.onRequestDialog.bind(this, control.entity)}
                        label={control.label}
                        icon={control.icon}
                    />
                ))}

                {options.dialogControls.map(control => (
                    <Button
                        key={control.entity}
                        onClick={this.onRequestDialog.bind(this, control.entity)}
                        label={control.label}
                        icon={control.icon}
                    />
                ))}

                {options.modelPickerOptions.map(picker => (
                    <Button
                        key={picker.contentType}
                        onClick={this.addModel.bind(this, options.MODEL, picker.contentType)}
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
                ref={(ref) => { this.wrapperRef = ref; }}
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
                    handleKeyCommand={this.handleKeyCommand}
                    keyBindingFn={keyBindingFn}
                    onTab={this.handleTabCommand}
                    spellCheck={false}
                    blockRendererFn={this.blockRenderer}
                    blockRenderMap={config.getBlockRenderMap(options.BLOCK_TYPES)}
                    blockStyleFn={config.getBlockStyleFn(options.BLOCK_TYPES)}
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
        mediaControls: React.PropTypes.arrayOf(React.PropTypes.shape({
            entity: React.PropTypes.string.isRequired,
            label: React.PropTypes.string.isRequired,
            icon: React.PropTypes.string.isRequired,
        })).isRequired,
        dialogControls: React.PropTypes.arrayOf(React.PropTypes.shape({
            entity: React.PropTypes.string.isRequired,
            label: React.PropTypes.string.isRequired,
            icon: React.PropTypes.string.isRequired,
        })).isRequired,
        sources: React.PropTypes.arrayOf(React.PropTypes.shape({
            entity: React.PropTypes.string.isRequired,
            control: React.PropTypes.func.isRequired,
        })).isRequired,
        decorators: React.PropTypes.arrayOf(React.PropTypes.shape({
            strategy: React.PropTypes.func.isRequired,
            component: React.PropTypes.func.isRequired,
        })).isRequired,
        BLOCK_TYPES: React.PropTypes.arrayOf(React.PropTypes.shape({
            style: React.PropTypes.string.isRequired,
            label: React.PropTypes.string.isRequired,
            icon: React.PropTypes.string,
            element: React.PropTypes.string,
            className: React.PropTypes.string,
        })).isRequired,
        INLINE_STYLES: React.PropTypes.arrayOf(React.PropTypes.shape({
            style: React.PropTypes.string.isRequired,
            label: React.PropTypes.string.isRequired,
            icon: React.PropTypes.string.isRequired,
        })).isRequired,
    }),
};

DraftailEditor.defaultProps = {
    rawContentState: {},
    onSave: () => {},
    options: defaultOptions,
};

export default DraftailEditor;
