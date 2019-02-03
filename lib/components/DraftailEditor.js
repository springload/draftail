// @flow
import React, { Component } from "react";
import type { ComponentType } from "react";
import { Editor, EditorState, RichUtils, ContentBlock } from "draft-js";
import type { EntityInstance } from "draft-js";
import type { RawDraftContentState } from "draft-js/lib/RawDraftContentState";
import type { DraftEditorCommand } from "draft-js/lib/DraftEditorCommand";
import type { DraftDecorator } from "draft-js/lib/DraftDecorator";
import {
  ListNestingStyles,
  registerCopySource,
  handleDraftEditorPastedText,
} from "draftjs-conductor";

import {
  ENTITY_TYPE,
  BLOCK_TYPE,
  ENTITY_TYPES,
  BLOCK_TYPES,
  INLINE_STYLES,
  HANDLED,
  NOT_HANDLED,
  UNDO_TYPE,
  REDO_TYPE,
} from "../api/constants";

import DraftUtils from "../api/DraftUtils";
import behavior from "../api/behavior";
import conversion from "../api/conversion";

import getComponentWrapper from "../utils/getComponentWrapper";

import Toolbar from "./Toolbar";
import type { IconProp } from "./Icon";

import DividerBlock from "../blocks/DividerBlock";

type ControlProp = {|
  // Describes the control in the editor UI, concisely.
  label?: string,
  // Describes the control in the editor UI.
  description?: string,
  // Represents the control in the editor UI.
  icon?: IconProp,
|};

type Props = {|
  rawContentState: ?RawDraftContentState,
  onSave: ?(content: null | RawDraftContentState) => void,
  onFocus: ?() => void,
  onBlur: ?() => void,
  placeholder: ?string,
  enableHorizontalRule: boolean | ControlProp,
  enableLineBreak: boolean | ControlProp,
  showUndoControl: boolean | ControlProp,
  showRedoControl: boolean | ControlProp,
  stripPastedStyles: boolean,
  spellCheck: boolean,
  textAlignment: ?string,
  textDirectionality: ?string,
  autoCapitalize: ?string,
  autoComplete: ?string,
  autoCorrect: ?string,
  ariaDescribedBy: ?string,
  blockTypes: $ReadOnlyArray<{|
    ...ControlProp,
    // Unique type shared between block instances.
    type: string,
    // DOM element used to display the block within the editor area.
    element?: string,
  |}>,
  inlineStyles: $ReadOnlyArray<{|
    ...ControlProp,
    // Unique type shared between inline style instances.
    type: string,
    // CSS properties (in JS format) to apply for styling within the editor area.
    style?: {},
  |}>,
  entityTypes: $ReadOnlyArray<{|
    ...ControlProp,
    // Unique type shared between entity instances.
    type: string,
    // React component providing the UI to manage entities of this type.
    source: ComponentType<{}>,
    // React component to display inline entities.
    decorator?: ComponentType<{}>,
    // React component to display block-level entities.
    block?: ComponentType<{}>,
    // Array of attributes the entity uses, to preserve when filtering entities on paste.
    // If undefined, all entity data is preserved.
    attributes?: $ReadOnlyArray<string>,
    // Attribute - regex mapping, to whitelist entities based on their data on paste.
    // For example, { url: '^https:' } will only preserve links that point to HTTPS URLs.
    whitelist?: {},
  |}>,
  decorators: $ReadOnlyArray<DraftDecorator>,
  // Additional React components to render in the toolbar.
  controls: $ReadOnlyArray<
    ComponentType<{|
      getEditorState: () => EditorState,
      onChange: (EditorState) => void,
    |}>,
  >,
  maxListNesting: number,
  stateSaveInterval: number,
|};

const defaultProps = {
  // Initial content of the editor. Use this to edit pre-existing content.
  rawContentState: null,
  // Called when changes occured. Use this to persist editor content.
  onSave: null,
  // Called when the editor receives focus.
  onFocus: null,
  // Called when the editor loses focus.
  onBlur: null,
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
  // See https://draftjs.org/docs/api-reference-editor.html#aria-props.
  ariaDescribedBy: null,
  // List of the available block types.
  blockTypes: [],
  // List of the available inline styles.
  inlineStyles: [],
  // List of the available entity types.
  entityTypes: [],
  // List of active decorators.
  decorators: [],
  // List of extra toolbar controls.
  controls: [],
  // Max level of nesting for list items. 0 = no nesting. Maximum = 10.
  maxListNesting: 1,
  // Frequency at which to call the save callback (ms).
  stateSaveInterval: 250,
};

type State = {|
  editorState: EditorState,
  hasFocus: boolean,
  readOnly: boolean,
  sourceOptions: ?{
    entity: ?EntityInstance,
    entityKey: ?string,
    entityType: ?{
      source: ComponentType<{}>,
    },
  },
|};

/* :: import type { ElementRef, Node } from "react"; */

/**
 * Main component of the Draftail editor.
 * Contains the Draft.js editor instance, and ties together UI and behavior.
 */
class DraftailEditor extends Component<Props, State> {
  static defaultProps: Props;

  /* :: editorRef: ElementRef<Editor>; */
  /* :: copySource: { unregister: () => void }; */
  /* :: updateTimeout: ?number; */
  /* :: lockEditor: () => void; */
  /* :: unlockEditor: () => void; */

  constructor(props: Props) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.saveState = this.saveState.bind(this);
    this.getEditorState = this.getEditorState.bind(this);

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
    this.handlePastedText = this.handlePastedText.bind(this);

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
      .filter((type) => !!type.decorator)
      .map((type) => ({
        strategy: DraftUtils.getEntityTypeStrategy(type.type),
        // $FlowFixMe
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

  componentDidMount() {
    this.copySource = registerCopySource(this.editorRef);
  }

  componentWillUnmount() {
    this.copySource.unregister();
  }

  /* :: onFocus: () => void; */
  onFocus() {
    this.setState({
      hasFocus: true,
    });

    const { onFocus } = this.props;

    if (onFocus) {
      onFocus();
    }
  }

  /* :: onBlur: () => void; */
  onBlur() {
    this.setState({
      hasFocus: false,
    });

    const { onBlur } = this.props;

    if (onBlur) {
      onBlur();
    }
  }

  /* :: onTab: (event: SyntheticKeyboardEvent<>) => true; */
  onTab(event: SyntheticKeyboardEvent<>) {
    const { maxListNesting } = this.props;
    const { editorState } = this.state;
    const newState = RichUtils.onTab(event, editorState, maxListNesting);

    this.onChange(newState);
    return true;
  }

  /* :: onChange: (nextState: EditorState) => void; */
  onChange(nextState: EditorState) {
    const {
      stateSaveInterval,
      maxListNesting,
      enableHorizontalRule,
      enableLineBreak,
      blockTypes,
      inlineStyles,
      entityTypes,
    } = this.props;
    const { editorState } = this.state;
    const shouldFilterPaste =
      nextState.getCurrentContent() !== editorState.getCurrentContent() &&
      nextState.getLastChangeType() === "insert-fragment";
    let filteredState = nextState;

    if (shouldFilterPaste) {
      filteredState = behavior.filterPaste(
        {
          maxListNesting,
          enableHorizontalRule,
          enableLineBreak,
          blockTypes,
          inlineStyles,
          entityTypes,
        },
        filteredState,
      );
    }

    this.setState(
      {
        editorState: filteredState,
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

  /* :: onEditEntity: (entityKey: string) => void; */
  onEditEntity(entityKey: string) {
    const { entityTypes } = this.props;
    const { editorState } = this.state;
    const content = editorState.getCurrentContent();
    const entity = content.getEntity(entityKey);
    const entityType = entityTypes.find((t) => t.type === entity.type);

    // $FlowFixMe
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

  /* :: onRemoveEntity: (entityKey: string, blockKey: string) => void; */
  onRemoveEntity(entityKey: string, blockKey: string) {
    const { entityTypes } = this.props;
    const { editorState } = this.state;
    const content = editorState.getCurrentContent();
    const entity = content.getEntity(entityKey);
    const entityType = entityTypes.find((t) => t.type === entity.type);
    let newState = editorState;

    // $FlowFixMe
    if (entityType.block) {
      newState = DraftUtils.removeBlockEntity(newState, entityKey, blockKey);
    } else {
      const entitySelection = DraftUtils.getEntitySelection(
        editorState,
        entityKey,
      );

      newState = RichUtils.toggleLink(newState, entitySelection, null);
    }

    this.onChange(newState);
  }

  /* :: onUndoRedo: (type: string) => void; */
  onUndoRedo(type: string) {
    const { editorState } = this.state;
    let newEditorState = editorState;

    if (type === UNDO_TYPE) {
      newEditorState = EditorState.undo(editorState);
    } else if (type === REDO_TYPE) {
      newEditorState = EditorState.redo(editorState);
    }

    this.onChange(newEditorState);
  }

  /* :: onRequestSource: (entityType: string) => void; */
  onRequestSource(entityType: string) {
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();
    const entityKey = DraftUtils.getSelectionEntity(editorState);

    this.toggleSource(
      entityType,
      entityKey,
      entityKey ? contentState.getEntity(entityKey) : null,
    );
  }

  /* :: onCompleteSource: (nextState: EditorState) => void; */
  onCompleteSource(nextState: EditorState) {
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

  /* :: onCloseSource: () => void; */
  onCloseSource() {
    this.setState({
      sourceOptions: null,
      readOnly: false,
    });
  }

  /* :: getEditorState: () => EditorState; */
  getEditorState() {
    const { editorState } = this.state;
    return editorState;
  }

  /* :: saveState: () => void; */
  saveState() {
    const { onSave } = this.props;
    const { editorState } = this.state;

    if (onSave) {
      onSave(conversion.serialiseEditorState(editorState));
    }
  }

  /* :: toggleEditor: (readOnly: boolean) => void; */
  toggleEditor(readOnly: boolean) {
    this.setState({
      readOnly,
    });
  }

  /* :: toggleSource: (type:string, entityKey: ?string, entity: ?EntityInstance) => void; */
  toggleSource(type: string, entityKey: ?string, entity: ?EntityInstance) {
    const { entityTypes } = this.props;
    const entityType = entityTypes.find((item) => item.type === type);

    this.setState({
      readOnly: true,
      sourceOptions: {
        entity,
        entityKey,
        entityType,
      },
    });
  }

  /* :: handleReturn: (e: SyntheticKeyboardEvent<>) => void; */
  handleReturn(e: SyntheticKeyboardEvent<>) {
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

  /* :: handleKeyCommand: (command: DraftEditorCommand) => boolean; */
  handleKeyCommand(command: DraftEditorCommand) {
    const { editorState } = this.state;

    if (ENTITY_TYPES.includes(command)) {
      this.onRequestSource(command);
      return true;
    }

    if (BLOCK_TYPES.includes(command)) {
      this.toggleBlockType(command);
      return true;
    }

    if (INLINE_STYLES.includes(command)) {
      this.toggleInlineStyle(command);
      return true;
    }

    // Special case – some delete commands on atomic blocks are not covered by RichUtils.
    if (command === "delete") {
      const newState = DraftUtils.handleDeleteAtomic(editorState);

      if (newState) {
        this.onChange(newState);
        return true;
      }
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return true;
    }

    return false;
  }

  /* :: handleBeforeInput: (char: string) => 'handled' | 'not-handled'; */
  handleBeforeInput(char: string) {
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

      const newBlockType = behavior.handleBeforeInputBlockType(
        mark,
        blockTypes,
      );

      if (newBlockType) {
        newEditorState = DraftUtils.resetBlockWithType(
          newEditorState,
          newBlockType,
          text.replace(beforeBeforeInput, ""),
        );
      }

      if (enableHorizontalRule && behavior.handleBeforeInputHR(mark, block)) {
        newEditorState = DraftUtils.removeBlock(
          DraftUtils.addHorizontalRuleRemovingSelection(newEditorState),
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

  /* :: handlePastedText: (text: string, html: ?string, editorState: EditorState) => boolean; */
  handlePastedText(text: string, html: ?string, editorState: EditorState) {
    const { stripPastedStyles } = this.props;

    // Leave paste handling to Draft.js when stripping styles is desirable.
    if (stripPastedStyles) {
      return false;
    }

    const pastedState = handleDraftEditorPastedText(html, editorState);

    if (pastedState) {
      this.onChange(pastedState);
      return true;
    }

    return false;
  }

  /* :: toggleBlockType: (blockType: string) => void; */
  toggleBlockType(blockType: string) {
    const { editorState } = this.state;
    this.onChange(RichUtils.toggleBlockType(editorState, blockType));
  }

  /* :: toggleInlineStyle: (inlineStyle: string) => void; */
  toggleInlineStyle(inlineStyle: string) {
    const { editorState } = this.state;
    this.onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  /* :: addHR: () => void; */
  addHR() {
    const { editorState } = this.state;
    this.onChange(DraftUtils.addHorizontalRuleRemovingSelection(editorState));
  }

  /* :: addBR: () => void; */
  addBR() {
    const { editorState } = this.state;
    this.onChange(DraftUtils.addLineBreak(editorState));
  }

  /* :: blockRenderer: (block: ContentBlock) => {}; */
  blockRenderer(block: ContentBlock) {
    const { entityTypes } = this.props;
    const { editorState } = this.state;
    const contentState = editorState.getCurrentContent();

    if (block.getType() !== BLOCK_TYPE.ATOMIC) {
      return null;
    }

    const entityKey = block.getEntityAt(0);

    if (!entityKey) {
      return {
        editable: false,
      };
    }

    const entity = contentState.getEntity(entityKey);
    const isHorizontalRule = entity.type === ENTITY_TYPE.HORIZONTAL_RULE;

    if (isHorizontalRule) {
      return {
        component: DividerBlock,
        editable: false,
      };
    }

    const entityType = entityTypes.find((t) => t.type === entity.type);

    return {
      // $FlowFixMe
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

  // Imperative focus API similar to that of Draft.js.
  // See https://draftjs.org/docs/advanced-topics-managing-focus.html#content.
  /* :: focus: () => void; */
  focus() {
    this.editorRef.focus();
  }

  /* :: renderSource: () => ?Node; */
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
      ariaDescribedBy,
      blockTypes,
      inlineStyles,
      entityTypes,
      controls,
      maxListNesting,
    } = this.props;
    const { editorState, hasFocus, readOnly } = this.state;
    const hidePlaceholder = DraftUtils.shouldHidePlaceholder(editorState);

    return (
      <div
        className={`Draftail-Editor${
          readOnly ? " Draftail-Editor--readonly" : ""
        }${hidePlaceholder ? " Draftail-Editor--hide-placeholder" : ""}${
          hasFocus ? " Draftail-Editor--focus" : ""
        }`}
      >
        <Toolbar
          currentStyles={editorState.getCurrentInlineStyle()}
          currentBlock={DraftUtils.getSelectedBlock(editorState).getType()}
          enableHorizontalRule={enableHorizontalRule}
          enableLineBreak={enableLineBreak}
          showUndoControl={showUndoControl}
          showRedoControl={showRedoControl}
          blockTypes={blockTypes}
          inlineStyles={inlineStyles}
          entityTypes={entityTypes}
          controls={controls}
          readOnly={readOnly}
          toggleBlockType={this.toggleBlockType}
          toggleInlineStyle={this.toggleInlineStyle}
          addHR={this.addHR}
          addBR={this.addBR}
          onUndoRedo={this.onUndoRedo}
          onRequestSource={this.onRequestSource}
          getEditorState={this.getEditorState}
          onChange={this.onChange}
        />

        <Editor
          customStyleMap={behavior.getCustomStyleMap(inlineStyles)}
          ref={(ref) => {
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
          ariaDescribedBy={ariaDescribedBy}
          handleReturn={this.handleReturn}
          keyBindingFn={behavior.getKeyBindingFn(
            blockTypes,
            inlineStyles,
            entityTypes,
          )}
          handleKeyCommand={this.handleKeyCommand}
          handleBeforeInput={this.handleBeforeInput}
          handlePastedText={this.handlePastedText}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onTab={this.onTab}
          blockRendererFn={this.blockRenderer}
          blockRenderMap={behavior.getBlockRenderMap(blockTypes)}
          blockStyleFn={behavior.blockStyleFn}
        />

        {this.renderSource()}

        <ListNestingStyles max={maxListNesting} />
      </div>
    );
  }
}

DraftailEditor.defaultProps = defaultProps;

export default DraftailEditor;
