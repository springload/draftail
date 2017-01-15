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

import Toolbar from '../components/Toolbar';
import Portal from '../components/Portal';
import Tooltip from '../components/Tooltip';

import DividerBlock from '../blocks/DividerBlock';
import MediaBlock from '../blocks/MediaBlock';

/**
 * The top-level component for the Draftail Draft.js editor.
 */
class DraftailEditor extends Component {
    constructor(props) {
        super(props);
        const { rawContentState, entityTypes } = props;
        const decorators = entityTypes.filter(type => !!type.strategy);

        this.state = {
            editorState: conversion.createEditorState(rawContentState, decorators),
            readOnly: false,
            dialogOptions: null,
            entity: null,
        };

        this.onChange = this.onChange.bind(this);
        this.saveState = this.saveState.bind(this);

        this.toggleTooltip = this.toggleTooltip.bind(this);
        this.toggleDialog = this.toggleDialog.bind(this);
        this.toggleEditor = this.toggleEditor.bind(this);
        this.lockEditor = this.toggleEditor.bind(this, true);
        this.unlockEditor = this.toggleEditor.bind(this, false);

        this.handleReturn = this.handleReturn.bind(this);
        this.onTab = this.onTab.bind(this);
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.handleKeyCommand = this.handleKeyCommand.bind(this);

        this.toggleBlockType = this.toggleBlockType.bind(this);
        this.toggleInlineStyle = this.toggleInlineStyle.bind(this);

        this.onEditEntity = this.onEditEntity.bind(this);
        this.onRemoveEntity = this.onRemoveEntity.bind(this);

        this.addHR = this.addHR.bind(this);
        this.addBR = this.addBR.bind(this);

        this.blockRenderer = this.blockRenderer.bind(this);
        this.onRequestDialog = this.onRequestDialog.bind(this);
        this.onDialogComplete = this.onDialogComplete.bind(this);

        this.renderDialog = this.renderDialog.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
    }

    onChange(editorState) {
        this.setState({ editorState }, () => {
            global.clearTimeout(this.updateTimeout);
            this.updateTimeout = global.setTimeout(this.saveState, STATE_SAVE_INTERVAL);
        });
    }

    saveState() {
        const { onSave } = this.props;
        const { editorState } = this.state;

        onSave(conversion.serialiseEditorState(editorState));
    }

    toggleEditor(readOnly) {
        this.setState({
            readOnly: readOnly,
        });
    }

    toggleTooltip(shouldShowTooltip) {
        this.setState({
            shouldShowTooltip: shouldShowTooltip,
        });
    }

    toggleDialog(entityType, entity = null) {
        const { entityTypes } = this.props;
        const dialogOptions = entityTypes.find(item => item.type === entityType);

        this.setState({
            readOnly: true,
            dialogOptions: dialogOptions,
            entity: entity,
        });
    }

    handleReturn(e) {
        const { enableLineBreak } = this.props;
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
            if (!enableLineBreak) {
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

    onMouseUp(e) {
        this.tooltip = e.target.closest('[data-tooltip]');
        this.toggleTooltip(!!this.tooltip);
    }

    onKeyUp() {
        this.toggleTooltip(false);
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
        const { editorState } = this.state;
        const entity = Entity.get(entityKey);

        // TODO It seems strange to update the selection state when requesting an edit.
        const entitySelectionState = DraftUtils.getSelectedEntitySelection(editorState);
        const nextState = EditorState.acceptSelection(editorState, entitySelectionState);

        this.onChange(nextState);

        this.toggleDialog(entity.type, entity);
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

    blockRenderer(block) {
        const { entityTypes } = this.props;
        const { editorState } = this.state;
        let entity;
        let isHorizontalRule;
        let ret;

        switch (block.getType()) {
        case BLOCK_TYPE.ATOMIC:
            entity = Entity.get(block.getEntityAt(0));
            isHorizontalRule = entity.type === ENTITY_TYPE.HORIZONTAL_RULE;

            if (isHorizontalRule) {
                ret = {
                    component: DividerBlock,
                    editable: false,
                    props: {},
                };
            } else {
                ret = {
                    component: MediaBlock,
                    editable: false,
                    props: {
                        entity: entity,
                        entityConfig: entityTypes.find(item => item.type === entity.type),
                        lockEditor: this.lockEditor,
                        unlockEditor: this.unlockEditor,
                        editorState: editorState,
                        onUpdate: this.onDialogComplete,
                    },
                };
            }
            break;
        default:
            ret = null;
            break;
        }

        return ret;
    }

    onRequestDialog(entityType) {
        const { editorState } = this.state;
        const entityKey = DraftUtils.getSelectionEntity(editorState);

        this.toggleDialog(entityType, entityKey ? Entity.get(entityKey) : null);
    }

    onDialogComplete(nextState) {
        this.setState({
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

    renderDialog() {
        const { entity, editorState, dialogOptions } = this.state;
        let ret;

        if (dialogOptions) {
            const Dialog = dialogOptions.control;

            ret = (
                <Dialog
                    onClose={this.onDialogComplete}
                    onUpdate={this.onDialogComplete}
                    entity={entity}
                    editorState={editorState}
                    options={dialogOptions}
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

            tooltip = entityKey ? (
                <Tooltip
                    onRemove={this.onRemoveEntity}
                    onEdit={this.onEditEntity.bind(this, entityKey)}
                    entityData={Entity.get(entityKey).getData()}
                    position={{
                        top: this.tooltip.getBoundingClientRect().top + document.body.scrollTop + this.tooltip.offsetHeight,
                        left: this.tooltip.getBoundingClientRect().left + document.body.scrollLeft,
                    }}
                />
            ) : null;
        }

        return (
            <Portal id="tooltip-portal">
                {tooltip}
            </Portal>
        );
    }

    render() {
        const { enableHorizontalRule, enableLineBreak, blockTypes, inlineStyles, entityTypes } = this.props;
        const { editorState, readOnly } = this.state;

        /* eslint-disable jsx-a11y/no-static-element-interactions */
        return (
            <div
                className={readOnly ? 'editor--readonly' : null}
                onBlur={this.saveState}
                onMouseUp={this.onMouseUp}
                onKeyUp={this.onKeyUp}
            >
                <Toolbar
                    editorState={editorState}
                    enableHorizontalRule={enableHorizontalRule}
                    enableLineBreak={enableLineBreak}
                    blockTypes={blockTypes}
                    inlineStyles={inlineStyles}
                    entityTypes={entityTypes}
                    readOnly={readOnly}
                    toggleBlockType={this.toggleBlockType}
                    toggleInlineStyle={this.toggleInlineStyle}
                    addHR={this.addHR}
                    addBR={this.addBR}
                    onRequestDialog={this.onRequestDialog}
                />

                <Editor
                    ref={(ref) => { this.editorRef = ref; }}
                    editorState={editorState}
                    onChange={this.onChange}
                    readOnly={readOnly}
                    handleReturn={this.handleReturn}
                    keyBindingFn={config.getKeyBindingFn(blockTypes, inlineStyles, entityTypes)}
                    handleKeyCommand={this.handleKeyCommand}
                    onTab={this.onTab}
                    blockRendererFn={this.blockRenderer}
                    blockRenderMap={config.getBlockRenderMap(blockTypes)}
                    blockStyleFn={config.getBlockStyleFn(blockTypes)}
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
    enableHorizontalRule: React.PropTypes.bool,
    enableLineBreak: React.PropTypes.bool,
    entityTypes: React.PropTypes.arrayOf(React.PropTypes.shape({
        label: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string,
        control: React.PropTypes.func.isRequired,
        strategy: React.PropTypes.func,
        component: React.PropTypes.func,
        // A bit dodgy. Specific to the IMAGE type or whatever uses the ImageBlock.
        imageFormats: React.PropTypes.arrayOf(React.PropTypes.shape({
            label: React.PropTypes.string.isRequired,
            value: React.PropTypes.string.isRequired,
        })),
    })),
    blockTypes: React.PropTypes.arrayOf(React.PropTypes.shape({
        label: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string,
        element: React.PropTypes.string,
        className: React.PropTypes.string,
    })),
    inlineStyles: React.PropTypes.arrayOf(React.PropTypes.shape({
        label: React.PropTypes.string.isRequired,
        type: React.PropTypes.string.isRequired,
        icon: React.PropTypes.string,
    })),
};

DraftailEditor.defaultProps = {
    rawContentState: {},
    onSave: () => {},
    enableHorizontalRule: false,
    enableLineBreak: false,
    entityTypes: [],
    blockTypes: [],
    inlineStyles: [],
};

export default DraftailEditor;
