import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Editor, EditorState, RichUtils } from 'draft-js';

import {
    ENTITY_TYPE,
    BLOCK_TYPE,
    INLINE_STYLE,
    HANDLED,
    NOT_HANDLED,
    UNDO_TYPE,
    REDO_TYPE,
} from '../api/constants';

import DraftUtils from '../api/DraftUtils';
import behavior from '../api/behavior';
import conversion from '../api/conversion';
import normalize from '../api/normalize';

import { iconPropType } from '../components/Icon';

import Toolbar from '../components/Toolbar';
import Portal from '../components/Portal';

import DividerBlock from '../blocks/DividerBlock';
import InlineTooltip from './InlineTooltip';

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
    // Show undo/redo controls in the toolbar.
    showUndoRedoControls: false,
    // Disable copy/paste of rich text in the editor.
    stripPastedStyles: true,
    // Set whether spellcheck is turned on for your editor.
    spellCheck: false,
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
    showUndoRedoControls: PropTypes.bool,
    stripPastedStyles: PropTypes.bool,
    spellCheck: PropTypes.bool,
    blockTypes: PropTypes.arrayOf(
        PropTypes.shape({
            // Unique type shared between block instances.
            type: PropTypes.string.isRequired,
            // Describes the block in the editor UI, concisely.
            label: PropTypes.string,
            // Describes the block in the editor UI.
            description: PropTypes.string,
            // Represents the block in the editor UI.
            icon: iconPropType,
            // DOM element used to display the block within the editor area.
            element: PropTypes.string,
            // CSS class(es) added to the block for styling within the editor area.
            className: PropTypes.string,
        }),
    ),
    inlineStyles: PropTypes.arrayOf(
        PropTypes.shape({
            // Unique type shared between inline style instances.
            type: PropTypes.string.isRequired,
            // Describes the inline style in the editor UI, concisely.
            label: PropTypes.string,
            // Describes the inline style in the editor UI.
            description: PropTypes.string,
            // Represents the inline style in the editor UI.
            icon: iconPropType,
            // CSS properties (in JS format) to apply for styling within the editor area.
            style: PropTypes.Object,
        }),
    ),
    entityTypes: PropTypes.arrayOf(
        PropTypes.shape({
            // Unique type shared between entity instances.
            type: PropTypes.string.isRequired,
            // Describes the entity in the editor UI, concisely.
            label: PropTypes.string,
            // Describes the entity in the editor UI.
            description: PropTypes.string,
            // Represents the entity in the editor UI.
            icon: iconPropType,
            // React component providing the UI to manage entities of this type.
            source: PropTypes.func.isRequired,
            // Determines which pieces of content correspond to this entity.
            strategy: PropTypes.func,
            // React component to display inline entities.
            decorator: PropTypes.func,
            // React component to display block-level entities.
            block: PropTypes.func,
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
        this.onUndoRedo = this.onUndoRedo.bind(this);

        this.blockRenderer = this.blockRenderer.bind(this);
        this.onRequestDialog = this.onRequestDialog.bind(this);
        this.onDialogComplete = this.onDialogComplete.bind(this);

        this.renderDialog = this.renderDialog.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
    }

    onChange(nextEditorState) {
        const {
            stateSaveInterval,
            maxListNesting,
            enableHorizontalRule,
            stripPastedStyles,
            blockTypes,
            inlineStyles,
            entityTypes,
        } = this.props;
        const { editorState } = this.state;
        const content = editorState.getCurrentContent();
        const nextContent = nextEditorState.getCurrentContent();
        const shouldFilterPaste =
            nextContent !== content &&
            !stripPastedStyles &&
            nextEditorState.getLastChangeType() === 'insert-fragment';

        let filteredEditorState = nextEditorState;
        if (shouldFilterPaste) {
            filteredEditorState = normalize.filterEditorState(
                nextEditorState,
                maxListNesting,
                enableHorizontalRule,
                blockTypes,
                inlineStyles,
                entityTypes,
            );
        }

        this.setState(
            {
                editorState: filteredEditorState,
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

    toggleTooltip(tooltip = false) {
        const shouldShowTooltip = !!tooltip;
        this.tooltip = tooltip || null;

        this.setState({ shouldShowTooltip });
    }

    toggleDialog(entityType, entityKey, entity) {
        const { entityTypes } = this.props;
        const entityConfig = entityTypes.find(item => item.type === entityType);

        this.setState({
            readOnly: true,
            dialogOptions: {
                entity,
                entityKey,
                entityType,
                entityConfig,
            },
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
        this.toggleTooltip(e.target.closest('[data-tooltip]'));
    }

    onKeyUp() {
        this.toggleTooltip();
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

    handleBeforeInput(char) {
        const { blockTypes, enableHorizontalRule } = this.props;
        const { editorState } = this.state;
        const selection = editorState.getSelection();

        if (selection.isCollapsed()) {
            const block = DraftUtils.getSelectedBlock(editorState);
            let newEditorState = editorState;

            // Necessary to prevent entities from continuing when inserting text afterwards.
            // See https://github.com/springload/draftail/issues/86.
            // See https://github.com/facebook/draft-js/issues/430.
            if (DraftUtils.hasNoSelectionStartEntity(selection, block)) {
                newEditorState = DraftUtils.insertTextWithoutEntity(
                    newEditorState,
                    char,
                );
            }

            const newBlockType = behavior.handleBeforeInputBlockType(
                char,
                block,
                blockTypes,
            );

            if (newBlockType) {
                newEditorState = DraftUtils.resetBlockWithType(
                    newEditorState,
                    newBlockType,
                    {
                        text: '',
                    },
                );
            }

            if (
                enableHorizontalRule &&
                behavior.handleBeforeInputHR(char, block)
            ) {
                newEditorState = DraftUtils.removeBlock(
                    DraftUtils.addHorizontalRuleRemovingSelection(
                        newEditorState,
                    ),
                    block.getKey(),
                );
            }

            if (newEditorState !== editorState) {
                this.onChange(newEditorState);
                return HANDLED;
            }
        }

        return NOT_HANDLED;
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
        const { entityTypes } = this.props;
        const { editorState } = this.state;
        const content = editorState.getCurrentContent();
        const entity = content.getEntity(entityKey);
        const entityConfig = entityTypes.find(t => t.type === entity.type);

        if (!entityConfig.block) {
            // TODO It seems strange to update the selection state when requesting an edit.
            const entitySelection = DraftUtils.getEntitySelection(
                editorState,
                entityKey,
            );
            const nextState = EditorState.acceptSelection(
                editorState,
                entitySelection,
            );

            this.onChange(nextState);
        }

        this.toggleDialog(entity.getType(), entityKey, entity);
    }

    onRemoveEntity(entityKey, blockKey) {
        const { entityTypes } = this.props;
        const { editorState } = this.state;
        const content = editorState.getCurrentContent();
        const entity = content.getEntity(entityKey);
        const entityConfig = entityTypes.find(t => t.type === entity.type);
        let newState;

        this.toggleTooltip();

        if (entityConfig.block) {
            newState = EditorState.push(
                editorState,
                content.merge({
                    blockMap: content.getBlockMap().remove(blockKey),
                }),
                'remove-range',
            );
        } else {
            const entitySelection = DraftUtils.getEntitySelection(
                editorState,
                entityKey,
            );

            newState = RichUtils.toggleLink(editorState, entitySelection, null);
        }

        this.onChange(newState);
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

    onUndoRedo(type) {
        const { editorState } = this.state;
        let newEditorState = editorState;

        if (type === UNDO_TYPE) {
            newEditorState = EditorState.undo(editorState);
        } else if (type === REDO_TYPE) {
            newEditorState = EditorState.redo(editorState);
        }

        this.onChange(newEditorState);
    }

    blockRenderer(block) {
        const { entityTypes } = this.props;
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();

        if (block.getType() !== BLOCK_TYPE.ATOMIC) {
            return null;
        }

        const entityKey = block.getEntityAt(0);
        const entity = contentState.getEntity(entityKey);
        const isHorizontalRule = entity.type === ENTITY_TYPE.HORIZONTAL_RULE;

        if (isHorizontalRule) {
            return {
                component: DividerBlock,
                editable: false,
            };
        }

        const entityConfig = entityTypes.find(t => t.type === entity.type);

        return {
            component: entityConfig.block,
            editable: false,
            props: {
                editorState,
                entity,
                entityKey,
                entityConfig,
                lockEditor: this.lockEditor,
                unlockEditor: this.unlockEditor,
                onEditEntity: this.onEditEntity.bind(null, entityKey),
                onRemoveEntity: this.onRemoveEntity.bind(
                    null,
                    entityKey,
                    block.getKey(),
                ),
                onChange: this.onChange,
            },
        };
    }

    onRequestDialog(entityType) {
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const entityKey = DraftUtils.getSelectionEntity(editorState);

        this.toggleDialog(
            entityType,
            entityKey,
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
        const { editorState, dialogOptions } = this.state;

        if (dialogOptions && dialogOptions.entityConfig) {
            const Dialog = dialogOptions.entityConfig.source;

            return (
                <Dialog
                    onClose={this.onDialogComplete}
                    onUpdate={this.onDialogComplete}
                    entity={dialogOptions.entity}
                    entityKey={dialogOptions.entityKey}
                    editorState={editorState}
                    options={dialogOptions.entityConfig}
                />
            );
        }

        return null;
    }

    renderTooltip() {
        const { editorState, shouldShowTooltip } = this.state;
        const contentState = editorState.getCurrentContent();
        const entityKey = this.tooltip && this.tooltip.dataset.tooltip;
        const blockKey = this.tooltip && this.tooltip.dataset.block;

        return (
            <Portal>
                {shouldShowTooltip && entityKey ? (
                    <InlineTooltip
                        onRemove={this.onRemoveEntity.bind(
                            this,
                            entityKey,
                            blockKey,
                        )}
                        onEdit={this.onEditEntity.bind(
                            this,
                            entityKey,
                            blockKey,
                        )}
                        entityData={contentState.getEntity(entityKey).getData()}
                        position={{
                            top:
                                this.tooltip.getBoundingClientRect().top +
                                window.pageYOffset +
                                this.tooltip.offsetHeight,
                            left:
                                this.tooltip.getBoundingClientRect().left +
                                window.pageXOffset +
                                this.tooltip.offsetWidth / 2,
                        }}
                    />
                ) : null}
            </Portal>
        );
    }

    render() {
        const {
            placeholder,
            enableHorizontalRule,
            enableLineBreak,
            showUndoRedoControls,
            stripPastedStyles,
            spellCheck,
            blockTypes,
            inlineStyles,
            entityTypes,
        } = this.props;
        const { editorState, hasFocus, readOnly } = this.state;
        const hidePlaceholder = DraftUtils.shouldHidePlaceholder(editorState);

        /* eslint-disable springload/jsx-a11y/no-static-element-interactions */
        return (
            <div
                className={`editor${readOnly ? ' editor--readonly' : ''}${
                    hidePlaceholder ? ' editor--hide-placeholder' : ''
                }${hasFocus ? ' editor--focus' : ''}`}
                onBlur={this.saveState}
                onMouseUp={this.onMouseUp}
                onKeyUp={this.onKeyUp}
            >
                <Toolbar
                    editorState={editorState}
                    enableHorizontalRule={enableHorizontalRule}
                    enableLineBreak={enableLineBreak}
                    showUndoRedoControls={showUndoRedoControls}
                    blockTypes={blockTypes}
                    inlineStyles={inlineStyles}
                    entityTypes={entityTypes}
                    readOnly={readOnly}
                    toggleBlockType={this.toggleBlockType}
                    toggleInlineStyle={this.toggleInlineStyle}
                    addHR={this.addHR}
                    addBR={this.addBR}
                    onUndoRedo={this.onUndoRedo}
                    onRequestDialog={this.onRequestDialog}
                />

                <Editor
                    customStyleMap={behavior.getCustomStyleMap(inlineStyles)}
                    ref={ref => {
                        this.editorRef = ref;
                    }}
                    editorState={editorState}
                    onChange={this.onChange}
                    placeholder={placeholder}
                    readOnly={readOnly}
                    stripPastedStyles={stripPastedStyles}
                    spellCheck={spellCheck}
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
