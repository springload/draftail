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

import { getComponentWrapper } from '../utils/utils';

import Toolbar from '../components/Toolbar';

import DividerBlock from '../blocks/DividerBlock';

/**
 * Main component of the Draftail editor.
 * Contains the Draft.js editor instance, and ties together UI and behavior.
 */
class DraftailEditor extends Component {
    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.saveState = this.saveState.bind(this);

        this.toggleSource = this.toggleSource.bind(this);
        this.toggleEditor = this.toggleEditor.bind(this);
        this.lockEditor = this.toggleEditor.bind(this, true);
        this.unlockEditor = this.toggleEditor.bind(this, false);

        this.handleReturn = this.handleReturn.bind(this);
        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onTab = this.onTab.bind(this);
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
        this.onRequestSource = this.onRequestSource.bind(this);
        this.onCompleteSource = this.onCompleteSource.bind(this);
        this.onCloseSource = this.onCloseSource.bind(this);

        this.focus = this.focus.bind(this);

        this.renderSource = this.renderSource.bind(this);

        const { rawContentState, decorators, entityTypes } = props;

        const entityDecorators = entityTypes
            .filter(type => !!type.decorator)
            .map(type => ({
                strategy: DraftUtils.getEntityTypeStrategy(type.type),
                component: getComponentWrapper(type.decorator, {
                    onEdit: this.onEditEntity,
                    onRemove: this.onRemoveEntity,
                }),
            }));

        this.state = {
            editorState: conversion.createEditorState(
                rawContentState,
                decorators.concat(entityDecorators),
            ),
            hasFocus: false,
            readOnly: false,
            sourceOptions: null,
        };
    }

    onChange(editorState) {
        const {
            stateSaveInterval,
            maxListNesting,
            enableHorizontalRule,
            enableLineBreak,
            blockTypes,
            inlineStyles,
            entityTypes,
        } = this.props;
        const shouldFilterPaste =
            editorState.getLastChangeType() === 'insert-fragment';
        let nextState = editorState;

        if (shouldFilterPaste) {
            nextState = behavior.filterPaste(
                {
                    maxListNesting,
                    enableHorizontalRule,
                    enableLineBreak,
                    blockTypes,
                    inlineStyles,
                    entityTypes,
                },
                nextState,
            );
        }

        this.setState(
            {
                editorState: nextState,
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

    toggleSource(type, entityKey, entity) {
        const { entityTypes } = this.props;
        const entityType = entityTypes.find(item => item.type === type);

        this.setState({
            readOnly: true,
            sourceOptions: {
                entity,
                entityKey,
                entityType,
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

        this.saveState();
    }

    onTab(event) {
        const { maxListNesting } = this.props;
        const { editorState } = this.state;
        const newState = RichUtils.onTab(event, editorState, maxListNesting);

        this.onChange(newState);
        return true;
    }

    handleKeyCommand(command) {
        const { editorState } = this.state;
        const isKnownCommand = (commands, comm) =>
            Object.keys(commands).find(key => commands[key] === comm);
        let newState;
        let ret = false;

        if (isKnownCommand(ENTITY_TYPE, command)) {
            ret = true;
            this.onRequestSource(command);
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
            const startOffset = selection.getStartOffset();
            const text = block.getText();
            const beforeBeforeInput = text.slice(0, startOffset);
            const mark = `${beforeBeforeInput}${char}`;
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
                mark,
                blockTypes,
            );

            if (newBlockType) {
                newEditorState = DraftUtils.resetBlockWithType(
                    newEditorState,
                    newBlockType,
                    text.replace(beforeBeforeInput, ''),
                );
            }

            if (
                enableHorizontalRule &&
                behavior.handleBeforeInputHR(mark, block)
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
        const entityType = entityTypes.find(t => t.type === entity.type);

        if (!entityType.block) {
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

        this.toggleSource(entity.getType(), entityKey, entity);
    }

    onRemoveEntity(entityKey, blockKey) {
        const { entityTypes } = this.props;
        const { editorState } = this.state;
        const content = editorState.getCurrentContent();
        const entity = content.getEntity(entityKey);
        const entityType = entityTypes.find(t => t.type === entity.type);
        let newState;

        if (entityType.block) {
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
        this.onChange(DraftUtils.addLineBreak(editorState));
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

        const entityType = entityTypes.find(t => t.type === entity.type);

        return {
            component: entityType.block,
            editable: false,
            props: {
                // The editorState is available for arbitrary content manipulation.
                editorState,
                // Current entity to manage.
                entity,
                // Current entityKey to manage.
                entityKey,
                // Whole entityType configuration, as provided to the editor.
                entityType,
                // Make the whole editor read-only, except for the block.
                lockEditor: this.lockEditor,
                // Make the editor editable again.
                unlockEditor: this.unlockEditor,
                // Shorthand to edit entity data.
                onEditEntity: this.onEditEntity.bind(null, entityKey),
                // Shorthand to remove an entity, and the related block.
                onRemoveEntity: this.onRemoveEntity.bind(
                    null,
                    entityKey,
                    block.getKey(),
                ),
                // Update the editorState with arbitrary changes.
                onChange: this.onChange,
            },
        };
    }

    onRequestSource(entityType) {
        const { editorState } = this.state;
        const contentState = editorState.getCurrentContent();
        const entityKey = DraftUtils.getSelectionEntity(editorState);

        this.toggleSource(
            entityType,
            entityKey,
            entityKey ? contentState.getEntity(entityKey) : null,
        );
    }

    onCompleteSource(nextState) {
        this.setState(
            {
                sourceOptions: null,
            },
            () => {
                if (nextState) {
                    this.onChange(nextState);
                }

                window.setTimeout(() => {
                    this.setState({ readOnly: false }, () => {
                        window.setTimeout(() => {
                            this.focus();
                        }, 0);
                    });
                }, 0);
            },
        );
    }

    onCloseSource() {
        this.setState({
            sourceOptions: null,
            readOnly: false,
        });
    }

    // Imperative focus API similar to that of Draft.js.
    // See https://draftjs.org/docs/advanced-topics-managing-focus.html#content.
    focus() {
        this.editorRef.focus();
    }

    renderSource() {
        const { editorState, sourceOptions } = this.state;

        if (sourceOptions && sourceOptions.entityType) {
            const Source = sourceOptions.entityType.source;

            return (
                <Source
                    // The editorState is available for arbitrary content manipulation.
                    editorState={editorState}
                    // Takes the updated editorState, or null if there are no changes, and focuses the editor.
                    onComplete={this.onCompleteSource}
                    // Closes the source, without focusing the editor again.
                    onClose={this.onCloseSource}
                    // Current entity to edit, if any.
                    entity={sourceOptions.entity}
                    // Current entityKey to edit, if any.
                    entityKey={sourceOptions.entityKey}
                    // Whole entityType configuration, as provided to the editor.
                    entityType={sourceOptions.entityType}
                />
            );
        }

        return null;
    }

    render() {
        const {
            placeholder,
            enableHorizontalRule,
            enableLineBreak,
            showUndoControl,
            showRedoControl,
            stripPastedStyles,
            spellCheck,
            textAlignment,
            textDirectionality,
            autoCapitalize,
            autoComplete,
            autoCorrect,
            blockTypes,
            inlineStyles,
            entityTypes,
        } = this.props;
        const { editorState, hasFocus, readOnly } = this.state;
        const hidePlaceholder = DraftUtils.shouldHidePlaceholder(editorState);

        return (
            <div
                className={`Draftail-Editor${
                    readOnly ? ' Draftail-Editor--readonly' : ''
                }${
                    hidePlaceholder ? ' Draftail-Editor--hide-placeholder' : ''
                }${hasFocus ? ' Draftail-Editor--focus' : ''}`}
            >
                <Toolbar
                    editorState={editorState}
                    enableHorizontalRule={enableHorizontalRule}
                    enableLineBreak={enableLineBreak}
                    showUndoControl={showUndoControl}
                    showRedoControl={showRedoControl}
                    blockTypes={blockTypes}
                    inlineStyles={inlineStyles}
                    entityTypes={entityTypes}
                    readOnly={readOnly}
                    toggleBlockType={this.toggleBlockType}
                    toggleInlineStyle={this.toggleInlineStyle}
                    addHR={this.addHR}
                    addBR={this.addBR}
                    onUndoRedo={this.onUndoRedo}
                    onRequestSource={this.onRequestSource}
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
                    textAlignment={textAlignment}
                    textDirectionality={textDirectionality}
                    autoCapitalize={autoCapitalize}
                    autoComplete={autoComplete}
                    autoCorrect={autoCorrect}
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

                {this.renderSource()}
            </div>
        );
    }
}

DraftailEditor.defaultProps = {
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
    // Show undo control in the toolbar.
    showUndoControl: false,
    // Show redo control in the toolbar.
    showRedoControl: false,
    // Disable copy/paste of rich text in the editor.
    stripPastedStyles: true,
    // Set whether spellcheck is turned on for your editor.
    // See https://draftjs.org/docs/api-reference-editor.html#spellcheck.
    spellCheck: false,
    // Optionally set the overriding text alignment for this editor.
    // See https://draftjs.org/docs/api-reference-editor.html#textalignment.
    textAlignment: null,
    // Optionally set the overriding text directionality for this editor.
    // See https://draftjs.org/docs/api-reference-editor.html#textdirectionality.
    textDirectionality: null,
    // Set if auto capitalization is turned on and how it behaves.
    // See https://draftjs.org/docs/api-reference-editor.html#autocapitalize-string.
    autoCapitalize: null,
    // Set if auto complete is turned on and how it behaves.
    // See https://draftjs.org/docs/api-reference-editor.html#autocomplete-string.
    autoComplete: null,
    // Set if auto correct is turned on and how it behaves.
    // See https://draftjs.org/docs/api-reference-editor.html#autocorrect-string.
    autoCorrect: null,
    // List of the available block types.
    blockTypes: [],
    // List of the available inline styles.
    inlineStyles: [],
    // List of the available entity types.
    entityTypes: [],
    // List of active decorators.
    decorators: [],
    // Max level of nesting for unordered and ordered lists. 0 = no nesting.
    // Note: Draft.js only provides styles for list nesting up to a depth of 4.
    // Please refer to the documentation to add styles for further nesting levels.
    maxListNesting: 1,
    // Frequency at which the save callback is triggered (ms).
    stateSaveInterval: 250,
};

DraftailEditor.propTypes = {
    rawContentState: PropTypes.object,
    onSave: PropTypes.func,
    placeholder: PropTypes.string,
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
    ]),
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
    ]),
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
    ]),
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
    ]),
    stripPastedStyles: PropTypes.bool,
    spellCheck: PropTypes.bool,
    textAlignment: PropTypes.string,
    textDirectionality: PropTypes.string,
    autoCapitalize: PropTypes.string,
    autoComplete: PropTypes.string,
    autoCorrect: PropTypes.string,
    blockTypes: PropTypes.arrayOf(
        PropTypes.shape({
            // Unique type shared between block instances.
            type: PropTypes.string.isRequired,
            // Describes the block in the editor UI, concisely.
            label: PropTypes.string,
            // Describes the block in the editor UI.
            description: PropTypes.string,
            // Represents the block in the editor UI.
            icon: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.arrayOf(PropTypes.string),
                PropTypes.node,
            ]),
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
            icon: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.arrayOf(PropTypes.string),
                PropTypes.node,
            ]),
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
            icon: PropTypes.oneOfType([
                // String icon = SVG path or symbol reference.
                PropTypes.string,
                // List of SVG paths.
                PropTypes.arrayOf(PropTypes.string),
                // Arbitrary React element.
                PropTypes.node,
            ]),
            // React component providing the UI to manage entities of this type.
            source: PropTypes.func.isRequired,
            // React component to display inline entities.
            decorator: PropTypes.func,
            // React component to display block-level entities.
            block: PropTypes.func,
            // Array of attributes the entity uses, to preserve when filtering entities on paste.
            // If undefined, all entity data is preserved.
            attributes: PropTypes.arrayOf(PropTypes.string),
            // Attribute - regex mapping, to whitelist entities based on their data on paste.
            // For example, { url: '^https:' } will only preserve links that point to HTTPS URLs.
            whitelist: PropTypes.object,
        }),
    ),
    decorators: PropTypes.arrayOf(
        PropTypes.shape({
            // Determines which pieces of content are to be decorated.
            strategy: PropTypes.func,
            // React component to display the decoration.
            component: PropTypes.func,
        }),
    ),
    maxListNesting: PropTypes.number,
    stateSaveInterval: PropTypes.number,
};

export default DraftailEditor;
