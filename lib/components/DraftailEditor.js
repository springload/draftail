import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Editor, EditorState, RichUtils } from 'draft-js';

import {
    ENTITY_TYPE,
    BLOCK_TYPE,
    INLINE_STYLE,
    HANDLED,
    NOT_HANDLED,
} from '../api/constants';

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
    // Initial content of the editor. Use this to edit pre-existing content.
    rawContentState: null,
    // Called when changes occured. Use this to persist editor content.
    onSave: () => {},
    // Displayed when the editor is empty. Hidden if the user changes styling.
    placeholder: null,
    // Enable the use of horizontal rules in the editor.
    enableHorizontalRule: false,
    // Enable the use of line breaks in the editor.
    enableLineBreak: false,
    // Disable copy/paste of rich text in the editor.
    // TODO Make this false by default once copy/paste is better supported.
    stripPastedStyles: true,
    // List of the available block types.
    blockTypes: [],
    // List of the available inline styles.
    inlineStyles: [],
    // List of the available entity types.
    entityTypes: [],
    // Max level of nesting for unordered and ordered lists. 0 = no nesting.
    maxListNesting: 1,
    // Frequency at which the save callback is triggered (ms).
    stateSaveInterval: 250,
};

const propTypes = {
    rawContentState: PropTypes.object,
    onSave: PropTypes.func,
    placeholder: PropTypes.string,
    enableHorizontalRule: PropTypes.bool,
    enableLineBreak: PropTypes.bool,
    stripPastedStyles: PropTypes.bool,
    blockTypes: PropTypes.arrayOf(
        PropTypes.shape({
            // Describes the block in the editor UI.
            label: PropTypes.string.isRequired,
            // Unique type shared between block instances.
            type: PropTypes.string.isRequired,
            // Represents the block in the editor UI.
            icon: PropTypes.string,
            // DOM element used to display the block within the editor area.
            element: PropTypes.string,
            // CSS class(es) added to the block for styling within the editor area.
            className: PropTypes.string,
        }),
    ),
    inlineStyles: PropTypes.arrayOf(
        PropTypes.shape({
            // Describes the inline style in the editor UI.
            label: PropTypes.string.isRequired,
            // Unique type shared between inline style instances.
            type: PropTypes.string.isRequired,
            // Represents the inline style in the editor UI.
            icon: PropTypes.string,
        }),
    ),
    entityTypes: PropTypes.arrayOf(
        PropTypes.shape({
            // Describes the entity in the editor UI.
            label: PropTypes.string.isRequired,
            // Unique type shared between entity instances.
            type: PropTypes.string.isRequired,
            // Represents the entity in the editor UI.
            icon: PropTypes.string,
            // React component providing the UI to manage entities of this type.
            source: PropTypes.func.isRequired,
            // Determines which pieces of content correspond to this entity.
            strategy: PropTypes.func,
            // React component to display the entity within the editor area.
            decorator: PropTypes.func,
            // A bit dodgy. Specific to the IMAGE type or whatever uses the ImageBlock.
            // TODO This is where a plugins or custom blocks would be appropriate.
            imageFormats: PropTypes.arrayOf(
                PropTypes.shape({
                    label: PropTypes.string.isRequired,
                    value: PropTypes.string.isRequired,
                }),
            ),
        }),
    ),
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
        const decorators = entityTypes
            .filter(type => !!type.decorator)
            .map(type => ({
                strategy:
                    type.strategy ||
                    DraftUtils.getEntityTypeStrategy(type.type),
                component: type.decorator,
            }));

        this.state = {
            editorState: conversion.createEditorState(
                rawContentState,
                decorators,
            ),
            hasFocus: false,
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
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
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

        if (
            nextContentState !== contentState &&
            nextEditorState.getLastChangeType() === 'insert-fragment'
        ) {
            // eslint-disable-next-line no-param-reassign
            nextEditorState = DraftUtils.normaliseBlockDepth(
                nextEditorState,
                maxListNesting,
            );
        }

        this.setState(
            {
                editorState: nextEditorState,
            },
            () => {
                window.clearTimeout(this.updateTimeout);
                this.updateTimeout = window.setTimeout(
                    this.saveState,
                    stateSaveInterval,
                );
            },
        );
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
        const dialogOptions = entityTypes.find(
            item => item.type === entityType,
        );

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
                    window.open(entityData.url);
                }
            }
        } else {
            if (!enableLineBreak) {
                // Quick hack to disable soft line breaks.
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

    onFocus() {
        this.setState({
            hasFocus: true,
        });
    }

    onBlur() {
        this.setState({
            hasFocus: false,
        });
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
        const isKnownCommand = (commands, comm) =>
            Object.keys(commands).find(key => commands[key] === comm);
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
        const newBlockType = behavior.getBeforeInputBlockType(
            `${block.getText()[0] || ''}${block.getText()[1] || ''}${str}`,
            blockTypes,
        );

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

        this.onChange(
            DraftUtils.resetBlockWithType(editorState, newBlockType, {
                text: '',
            }),
        );

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
        const entitySelectionState = DraftUtils.getSelectedEntitySelection(
            editorState,
        );
        const nextState = EditorState.acceptSelection(
            editorState,
            entitySelectionState,
        );

        this.onChange(nextState);

        this.toggleDialog(entity.type, entity);
    }

    onRemoveEntity() {
        const { editorState } = this.state;
        const entitySelectionState = DraftUtils.getSelectedEntitySelection(
            editorState,
        );

        this.setState({
            shouldShowTooltip: false,
        });

        this.onChange(
            RichUtils.toggleLink(editorState, entitySelectionState, null),
        );
    }

    addHR() {
        const { editorState } = this.state;
        this.onChange(
            DraftUtils.addHorizontalRuleRemovingSelection(editorState),
        );
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
                            entityConfig: entityTypes.find(
                                item => item.type === entity.type,
                            ),
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

        this.toggleDialog(
            entityType,
            entityKey ? contentState.getEntity(entityKey) : null,
        );
    }

    onDialogComplete(nextState) {
        this.setState(
            {
                dialogOptions: null,
            },
            () => {
                if (nextState) {
                    this.onChange(nextState);
                }

                window.setTimeout(() => {
                    this.setState({ readOnly: false }, () => {
                        window.setTimeout(() => {
                            this.editorRef.focus();
                        }, 0);
                    });
                }, 0);
            },
        );
    }

    renderDialog() {
        const { entity, editorState, dialogOptions } = this.state;
        let ret;

        if (dialogOptions) {
            const Dialog = dialogOptions.source;

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
        const entityKey =
            this.tooltip && this.tooltip.getAttribute('data-tooltip');

        return (
            <Portal>
                {shouldShowTooltip && entityKey
                    ? <Tooltip
                          onRemove={this.onRemoveEntity}
                          onEdit={this.onEditEntity.bind(this, entityKey)}
                          entityData={contentState
                              .getEntity(entityKey)
                              .getData()}
                          position={{
                              top:
                                  this.tooltip.getBoundingClientRect().top +
                                  document.body.scrollTop +
                                  this.tooltip.offsetHeight,
                              left:
                                  this.tooltip.getBoundingClientRect().left +
                                  document.body.scrollLeft,
                          }}
                      />
                    : null}
            </Portal>
        );
    }

    render() {
        const {
            enableHorizontalRule,
            enableLineBreak,
            placeholder,
            stripPastedStyles,
            blockTypes,
            inlineStyles,
            entityTypes,
        } = this.props;
        const { editorState, hasFocus, readOnly } = this.state;
        const hidePlaceholder = DraftUtils.shouldHidePlaceholder(editorState);

        /* eslint-disable springload/jsx-a11y/no-static-element-interactions */
        return (
            <div
                className={`editor${readOnly
                    ? ' editor--readonly'
                    : ''}${hidePlaceholder
                    ? ' editor--hide-placeholder'
                    : ''}${hasFocus ? ' editor--focus' : ''}`}
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
                    ref={ref => {
                        this.editorRef = ref;
                    }}
                    editorState={editorState}
                    onChange={this.onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    stripPastedStyles={stripPastedStyles}
                    handleReturn={this.handleReturn}
                    keyBindingFn={behavior.getKeyBindingFn(
                        blockTypes,
                        inlineStyles,
                        entityTypes,
                    )}
                    handleKeyCommand={this.handleKeyCommand}
                    handleBeforeInput={this.handleBeforeInput}
                    onFocus={this.onFocus}
                    onBlur={this.onBlur}
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
