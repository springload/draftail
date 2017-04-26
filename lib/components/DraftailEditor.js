import PropTypes from 'prop-types';
import React, { Component } from 'react';

import {
    Editor,
    EditorState,
    RichUtils,
} from 'draft-js';

import { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE, HANDLED, NOT_HANDLED } from '../api/constants';

import DraftUtils from '../api/DraftUtils';
import behavior from '../api/behavior';
import conversion from '../api/conversion';

import Toolbar from '../components/Toolbar';
import Portal from '../components/Portal';
import Tooltip from '../components/Tooltip';

import DividerBlock from '../blocks/DividerBlock';
import MediaBlock from '../blocks/MediaBlock';

/**
 * Main component of the Draftail editor.
 * Contains the Draft.js editor instance, and ties together UI and behavior.
 */

const defaultProps = {
    // Initial content of the editor.
    rawContentState: null,
    // Called when the latest editor content is ready to be saved.
    onSave: () => {},
    // Enable the use of horizontal rules in the editor.
    enableHorizontalRule: false,
    // Enable the use of line breaks in the editor.
    enableLineBreak: false,
    // Disable copy/paste of rich text in the editor.
    // TODO Make this false by default once copy/paste is better supported.
    stripPastedStyles: true,
    // List of the available entity types.
    entityTypes: [],
    // List of the available block types.
    blockTypes: [],
    // List of the available inline styles.
    inlineStyles: [],
    // Max level of nesting for unordered and ordered lists. 0 = no nesting.
    maxListNesting: 1,
    // Frequency at which the save callback is triggered (ms).
    stateSaveInterval: 250,
};

const propTypes = {
    rawContentState: PropTypes.object,
    onSave: PropTypes.func,
    enableHorizontalRule: PropTypes.bool,
    enableLineBreak: PropTypes.bool,
    stripPastedStyles: PropTypes.bool,
    entityTypes: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        icon: PropTypes.string,
        control: PropTypes.func.isRequired,
        strategy: PropTypes.func,
        component: PropTypes.func,
        // A bit dodgy. Specific to the IMAGE type or whatever uses the ImageBlock.
        imageFormats: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
        })),
    })),
    blockTypes: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        icon: PropTypes.string,
        element: PropTypes.string,
        className: PropTypes.string,
    })),
    inlineStyles: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        icon: PropTypes.string,
    })),
    maxListNesting: PropTypes.number,
    stateSaveInterval: PropTypes.number,
};

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
        this.handleBeforeInput = this.handleBeforeInput.bind(this);

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

    onChange(nextEditorState) {
        const { stateSaveInterval, maxListNesting } = this.props;
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const nextContentState = nextEditorState.getCurrentContent();

        if (nextContentState !== contentState && nextEditorState.getLastChangeType() === 'insert-fragment') {
            // eslint-disable-next-line no-param-reassign
            nextEditorState = DraftUtils.normaliseBlockDepth(nextEditorState, maxListNesting);
        }

        this.setState({
            editorState: nextEditorState,
        }, () => {
            global.clearTimeout(this.updateTimeout);
            this.updateTimeout = global.setTimeout(this.saveState, stateSaveInterval);
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
        const contentState = editorState.getCurrentContent();
        let ret = false;

        // alt + enter opens links and other entities with a `url` property.
        if (e.altKey) {
            // Mark the return as handled even if there is no entity.
            // alt + enter should never create a newline anyway.
            ret = true;

            const entityKey = DraftUtils.getSelectionEntity(editorState);

            if (entityKey) {
                const entityData = contentState.getEntity(entityKey).getData();

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
        const { maxListNesting } = this.props;
        const { editorState } = this.state;
        const newState = RichUtils.onTab(event, editorState, maxListNesting);

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

    handleBeforeInput(str) {
        const { blockTypes } = this.props;
        const { editorState } = this.state;
        const selection = editorState.getSelection();
        const block = DraftUtils.getSelectedBlock(editorState);
        const blockType = block.getType();
        // TODO Refactor unreadable string concat.
        const newBlockType = behavior.getBeforeInputBlockType(`${block.getText()[0] || ''}${block.getText()[1] || ''}${str}`, blockTypes);

        const isNotHandled = [
            // Restrict block type replacement to unstyled blocks.
            blockType !== BLOCK_TYPE.UNSTYLED,
            selection.getAnchorOffset() > 2,
            block.getLength() > 2,
            !newBlockType,
        ];

        if (isNotHandled.some(cond => cond)) {
            return NOT_HANDLED;
        }

        this.onChange(DraftUtils.resetBlockWithType(editorState, newBlockType, { text: '' }));

        return HANDLED;
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
        const contentState = editorState.getCurrentContent();
        const entity = contentState.getEntity(entityKey);

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
        const contentState = editorState.getCurrentContent();
        let entity;
        let isHorizontalRule;
        let ret;

        switch (block.getType()) {
        case BLOCK_TYPE.ATOMIC:
            entity = contentState.getEntity(block.getEntityAt(0));
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
        const contentState = editorState.getCurrentContent();
        const entityKey = DraftUtils.getSelectionEntity(editorState);

        this.toggleDialog(entityType, entityKey ? contentState.getEntity(entityKey) : null);
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
        const contentState = editorState.getCurrentContent();
        const entityKey = this.tooltip && this.tooltip.getAttribute('data-tooltip');

        return (
            <Portal>
                {shouldShowTooltip && entityKey ? (
                    <Tooltip
                        onRemove={this.onRemoveEntity}
                        onEdit={this.onEditEntity.bind(this, entityKey)}
                        entityData={contentState.getEntity(entityKey).getData()}
                        position={{
                            top: this.tooltip.getBoundingClientRect().top + document.body.scrollTop + this.tooltip.offsetHeight,
                            left: this.tooltip.getBoundingClientRect().left + document.body.scrollLeft,
                        }}
                    />
                ) : null}
            </Portal>
        );
    }

    render() {
        const { enableHorizontalRule, enableLineBreak, stripPastedStyles, blockTypes, inlineStyles, entityTypes } = this.props;
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
                    stripPastedStyles={stripPastedStyles}
                    handleReturn={this.handleReturn}
                    keyBindingFn={behavior.getKeyBindingFn(blockTypes, inlineStyles, entityTypes)}
                    handleKeyCommand={this.handleKeyCommand}
                    handleBeforeInput={this.handleBeforeInput}
                    onTab={this.onTab}
                    blockRendererFn={this.blockRenderer}
                    blockRenderMap={behavior.getBlockRenderMap(blockTypes)}
                    blockStyleFn={behavior.getBlockStyleFn(blockTypes)}
                />

                {this.renderTooltip()}

                {this.renderDialog()}
            </div>
        );
    }
}

DraftailEditor.propTypes = propTypes;
DraftailEditor.defaultProps = defaultProps;

export default DraftailEditor;
