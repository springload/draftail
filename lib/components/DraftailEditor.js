// @flow
import React, { Component } from "react";
import type { ComponentType } from "react";
import { EditorState, RichUtils, ContentBlock, Modifier } from "draft-js";
import type { EntityInstance } from "draft-js";
import type { RawDraftContentState } from "draft-js/lib/RawDraftContentState";
import type { DraftEditorCommand } from "draft-js/lib/DraftEditorCommand";
import type { DraftDecorator } from "draft-js/lib/DraftDecorator";
// flowlint untyped-import:off
import Editor from "draft-js-plugins-editor";
import {
  ListNestingStyles,
  registerCopySource,
  handleDraftEditorPastedText,
  createEditorStateFromRaw,
  serialiseEditorStateToRaw,
} from "draftjs-conductor";
import decorateComponentWithProps from "decorate-component-with-props";

import {
  ENTITY_TYPE,
  BLOCK_TYPE,
  KEY_COMMANDS,
  HANDLED,
  NOT_HANDLED,
  UNDO_TYPE,
  REDO_TYPE,
} from "../api/constants";

import DraftUtils from "../api/DraftUtils";
import behavior from "../api/behavior";

import Toolbar from "./Toolbar";
import type { ToolbarProps } from "./Toolbar";
import type { IconProp } from "./Icon";

import DividerBlock from "../blocks/DividerBlock";

type ControlProp = {|
  /** Describes the control in the editor UI, concisely. */
  label?: ?string,
  /** Describes the control in the editor UI. */
  description?: string,
  /** Represents the control in the editor UI. */
  icon?: IconProp,
|};

type Props = {|
  /** Initial content of the editor. Use this to edit pre-existing content. */
  rawContentState: ?RawDraftContentState,
  /** Called when changes occured. Use this to persist editor content. */
  onSave: ?(content: null | RawDraftContentState) => void,
  /** Content of the editor, when using the editor as a controlled component. Incompatible with `rawContentState` and `onSave`. */
  editorState: ?EditorState,
  /** Called whenever the editor state is updated. Use this to manage the content of a controlled editor. Incompatible with `rawContentState` and `onSave`. */
  onChange: ?(editorState: EditorState) => void,
  /** Called when the editor receives focus. */
  onFocus: ?() => void,
  /** Called when the editor loses focus. */
  onBlur: ?() => void,
  /** Displayed when the editor is empty. Hidden if the user changes styling. */
  placeholder: ?string,
  /** Enable the use of horizontal rules in the editor. */
  enableHorizontalRule: boolean | ControlProp,
  /** Enable the use of line breaks in the editor. */
  enableLineBreak: boolean | ControlProp,
  /** Show undo control in the toolbar. */
  showUndoControl: boolean | ControlProp,
  /** Show redo control in the toolbar. */
  showRedoControl: boolean | ControlProp,
  /** Disable copy/paste of rich text in the editor. */
  stripPastedStyles: boolean,
  /** Set whether spellcheck is turned on for your editor.
   * See https://draftjs.org/docs/api-reference-editor.html#spellcheck.
   */
  spellCheck: boolean,
  /** Set whether the editor should be rendered in readOnly mode.
   * See https://draftjs.org/docs/api-reference-editor.html#readonly
   */
  readOnly: boolean,
  /** Optionally set the overriding text alignment for this editor.
   * See https://draftjs.org/docs/api-reference-editor.html#textalignment.
   */
  textAlignment: ?string,
  /** Optionally set the overriding text directionality for this editor.
   * See https://draftjs.org/docs/api-reference-editor.html#textdirectionality.
   */
  textDirectionality: ?string,
  /** Set if auto capitalization is turned on and how it behaves.
   * See https://draftjs.org/docs/api-reference-editor.html#autocapitalize-string.
   */
  autoCapitalize: ?string,
  /** Set if auto complete is turned on and how it behaves.
   * See https://draftjs.org/docs/api-reference-editor.html#autocomplete-string.
   */
  autoComplete: ?string,
  /** Set if auto correct is turned on and how it behaves.
   * See https://draftjs.org/docs/api-reference-editor.html#autocorrect-string.
   */
  autoCorrect: ?string,
  /** See https://draftjs.org/docs/api-reference-editor.html#aria-props. */
  ariaDescribedBy: ?string,
  /** List of the available block types. */
  blockTypes: $ReadOnlyArray<{|
    ...ControlProp,
    /** Unique type shared between block instances. */
    type: string,
    /** DOM element used to display the block within the editor area. */
    element?: string,
  |}>,
  /** List of the available inline styles. */
  inlineStyles: $ReadOnlyArray<{|
    ...ControlProp,
    /** Unique type shared between inline style instances. */
    type: string,
    /** CSS properties (in JS format) to apply for styling within the editor area. */
    style?: {},
  |}>,
  /** List of the available entity types. */
  entityTypes: $ReadOnlyArray<{|
    ...ControlProp,
    /** Unique type shared between entity instances. */
    type: string,
    /** React component providing the UI to manage entities of this type. */
    source: ComponentType<{}>,
    /** React component to display inline entities. */
    decorator?: ComponentType<{}>,
    /** React component to display block-level entities. */
    block?: ComponentType<{}>,
    /** Array of attributes the entity uses, to preserve when filtering entities on paste.
     * If undefined, all entity data is preserved.
     */
    attributes?: $ReadOnlyArray<string>,
    /** Attribute - regex mapping, to preserve entities based on their data on paste.
     * For example, { url: '^https:' } will only preserve links that point to HTTPS URLs.
     */
    allowlist?: {},
    /** Attribute - regex mapping, to preserve entities based on their data on paste.
     * For example, { url: '^https:' } will only preserve links that point to HTTPS URLs.
     */
    whitelist?: {},
  |}>,
  /** List of active decorators. */
  decorators: $ReadOnlyArray<DraftDecorator>,
  /** List of extra toolbar controls. */
  controls: $ReadOnlyArray<
    ComponentType<{|
      getEditorState: () => EditorState,
      onChange: (EditorState) => void,
    |}>,
  >,
  /** List of plugins of the draft-js-plugins architecture. */
  plugins: $ReadOnlyArray<{}>,
  /** Optionally override the default Draftail toolbar, removing or replacing it. */
  topToolbar: ?ComponentType<ToolbarProps>,
  /** Optionally add a custom toolbar underneath the editor, e.g. for metrics. */
  bottomToolbar: ?ComponentType<ToolbarProps>,
  /** Max level of nesting for list items. 0 = no nesting. Maximum = 10. */
  maxListNesting: number,
  /** Frequency at which to call the onSave callback (ms). */
  stateSaveInterval: number,
|};

const defaultProps = {
  /** Initial content of the editor. Use this to edit pre-existing content. */
  rawContentState: null,
  /** Called when changes occured. Use this to persist editor content. */
  onSave: null,
  /** Content of the editor, when using the editor as a controlled component. Incompatible with `rawContentState` and `onSave`. */
  editorState: null,
  /** Called whenever the editor state is updated. Use this to manage the content of a controlled editor. Incompatible with `rawContentState` and `onSave`. */
  onChange: null,
  /** Called when the editor receives focus. */
  onFocus: null,
  /** Called when the editor loses focus. */
  onBlur: null,
  /** Displayed when the editor is empty. Hidden if the user changes styling. */
  placeholder: null,
  /** Enable the use of horizontal rules in the editor. */
  enableHorizontalRule: false,
  /** Enable the use of line breaks in the editor. */
  enableLineBreak: false,
  /** Show undo control in the toolbar. */
  showUndoControl: false,
  /** Show redo control in the toolbar. */
  showRedoControl: false,
  /** Disable copy/paste of rich text in the editor. */
  stripPastedStyles: true,
  /** Set whether spellcheck is turned on for your editor.
   * See https://draftjs.org/docs/api-reference-editor.html#spellcheck.
   */
  spellCheck: false,
  /** Set whether the editor should be rendered in readOnly mode.
   * See https://draftjs.org/docs/api-reference-editor.html#readonly
   */
  readOnly: false,
  /** Optionally set the overriding text alignment for this editor.
   * See https://draftjs.org/docs/api-reference-editor.html#textalignment.
   */
  textAlignment: null,
  /** Optionally set the overriding text directionality for this editor.
   * See https://draftjs.org/docs/api-reference-editor.html#textdirectionality.
   */
  textDirectionality: null,
  /** Set if auto capitalization is turned on and how it behaves.
   * See https://draftjs.org/docs/api-reference-editor.html#autocapitalize-string.
   */
  autoCapitalize: null,
  /** Set if auto complete is turned on and how it behaves.
   * See https://draftjs.org/docs/api-reference-editor.html#autocomplete-string.
   */
  autoComplete: null,
  /** Set if auto correct is turned on and how it behaves.
   * See https://draftjs.org/docs/api-reference-editor.html#autocorrect-string.
   */
  autoCorrect: null,
  /** See https://draftjs.org/docs/api-reference-editor.html#aria-props. */
  ariaDescribedBy: null,
  /** List of the available block types. */
  blockTypes: [],
  /** List of the available inline styles. */
  inlineStyles: [],
  /** List of the available entity types. */
  entityTypes: [],
  /** List of active decorators. */
  decorators: [],
  /** List of extra toolbar controls. */
  controls: [],
  /** List of plugins of the draft-js-plugins architecture. */
  plugins: [],
  /** Optionally override the default Draftail toolbar, removing or replacing it. */
  topToolbar: Toolbar,
  /** Optionally add a custom toolbar underneath the editor, e.g. for metrics. */
  bottomToolbar: null,
  /** Max level of nesting for list items. 0 = no nesting. Maximum = 10. */
  maxListNesting: 1,
  /** Frequency at which to call the onSave callback (ms). */
  stateSaveInterval: 250,
};

type State = {|
  // editorState is only part of the local state if the editor is uncontrolled.
  editorState?: EditorState,
  hasFocus: boolean,
  readOnlyState: boolean,
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
  /* :: getEditorState: () => EditorState; */

  constructor(props: Props) {
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

    const { editorState, rawContentState } = props;

    this.state = {
      readOnlyState: false,
      hasFocus: false,
      sourceOptions: null,
    };

    if (editorState !== null) {
      this.getEditorState = this.getEditorStateProp.bind(this);
    } else {
      // If editorState is not used as a prop, create it in local state from rawContentState.
      this.state.editorState = createEditorStateFromRaw(rawContentState);
      this.getEditorState = this.getEditorStateState.bind(this);
    }
  }

  componentDidMount() {
    this.copySource = registerCopySource(this.editorRef.editor);
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
    const editorState = this.getEditorState();
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
      onChange,
    } = this.props;
    const editorState = this.getEditorState();
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

    if (onChange) {
      onChange(filteredState);
    } else {
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
  }

  /* :: onEditEntity: (entityKey: string) => void; */
  onEditEntity(entityKey: string) {
    const { entityTypes } = this.props;
    const editorState = this.getEditorState();
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
    const editorState = this.getEditorState();
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
    const editorState = this.getEditorState();
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
    const editorState = this.getEditorState();
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
          this.setState({ readOnlyState: false }, () => {
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
      readOnlyState: false,
    });
  }

  /* :: getEditorStateProp: () => EditorState; */
  getEditorStateProp() {
    const { editorState } = this.props;
    return editorState;
  }

  /* :: getEditorStateState: () => EditorState; */
  getEditorStateState() {
    const { editorState } = this.state;
    return editorState;
  }

  /* :: saveState: () => void; */
  saveState() {
    const { onSave } = this.props;
    const editorState = this.getEditorState();

    if (onSave) {
      onSave(serialiseEditorStateToRaw(editorState));
    }
  }

  /* :: toggleEditor: (readOnlyState: boolean) => void; */
  toggleEditor(readOnlyState: boolean) {
    this.setState({
      readOnlyState,
    });
  }

  /* :: toggleSource: (type:string, entityKey: ?string, entity: ?EntityInstance) => void; */
  toggleSource(type: string, entityKey: ?string, entity: ?EntityInstance) {
    const { entityTypes } = this.props;
    const entityType = entityTypes.find((item) => item.type === type);

    this.setState({
      readOnlyState: true,
      sourceOptions: {
        entity,
        entityKey,
        entityType,
      },
    });
  }

  /* :: handleReturn: (e: SyntheticKeyboardEvent<>) => 'not-handled' | 'handled'; */
  handleReturn(e: SyntheticKeyboardEvent<>) {
    const { enableLineBreak, inlineStyles } = this.props;
    const editorState = this.getEditorState();
    let ret = NOT_HANDLED;

    // alt + enter opens links and other entities with a `url` property.
    if (e.altKey) {
      // Mark the return as handled even if there is no entity.
      // alt + enter should never create a newline anyway.
      ret = HANDLED;

      const entityKey = DraftUtils.getSelectionEntity(editorState);

      if (entityKey) {
        const content = editorState.getCurrentContent();
        const entityData = content.getEntity(entityKey).getData();

        if (entityData.url) {
          window.open(entityData.url);
        }
      }
    } else {
      if (!enableLineBreak) {
        // Quick hack to disable soft line breaks.
        e.which = 0;
      }

      let newState = editorState;
      let newStyle = false;

      const selection = newState.getSelection();
      // Check whether we should apply a Markdown styles shortcut.
      if (selection.isCollapsed()) {
        const block = DraftUtils.getSelectedBlock(editorState);
        newStyle = behavior.handleBeforeInputInlineStyle(
          block.getText(),
          inlineStyles,
        );

        if (newStyle) {
          newState = DraftUtils.applyMarkdownStyle(newState, newStyle, "");
        }
      }

      const newLineState = DraftUtils.handleNewLine(newState, e);

      // Manually handle the return if there is a style to apply.
      if (!newLineState && newStyle) {
        const content = newState.getCurrentContent();
        const newContent = Modifier.splitBlock(content, selection);
        newState = EditorState.push(newState, newContent, "split-block");
        // Do not propagate the style from the last block.
        newState = RichUtils.toggleInlineStyle(newState, newStyle.type);
      } else {
        newState = newLineState;
      }

      if (newState && newState !== editorState) {
        ret = HANDLED;
        this.onChange(newState);
      }
    }

    return ret;
  }

  /* :: handleKeyCommand: (command: DraftEditorCommand) => 'handled' | 'not-handled'; */
  handleKeyCommand(command: DraftEditorCommand) {
    const { entityTypes, blockTypes, inlineStyles } = this.props;
    const editorState = this.getEditorState();

    if (entityTypes.some((t) => t.type === command)) {
      this.onRequestSource(command);
      return HANDLED;
    }

    if (blockTypes.some((t) => t.type === command)) {
      this.toggleBlockType(command);
      return HANDLED;
    }

    if (inlineStyles.some((t) => t.type === command)) {
      this.toggleInlineStyle(command);
      return HANDLED;
    }

    // Special case – some delete commands on atomic blocks are not covered by RichUtils.
    if (command === "delete") {
      const newState = DraftUtils.handleDeleteAtomic(editorState);

      if (newState) {
        this.onChange(newState);
        return HANDLED;
      }
    }

    // If the command is known but not whitelisted for this editor, treat it as handled but don't do anything.
    if (KEY_COMMANDS.includes(command)) {
      return HANDLED;
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      this.onChange(newState);
      return HANDLED;
    }

    return NOT_HANDLED;
  }

  /* :: handleBeforeInput: (char: string) => 'handled' | 'not-handled'; */
  handleBeforeInput(char: string) {
    const { blockTypes, inlineStyles, enableHorizontalRule } = this.props;
    const editorState = this.getEditorState();
    const selection = editorState.getSelection();

    if (selection.isCollapsed()) {
      const block = DraftUtils.getSelectedBlock(editorState);
      const startOffset = selection.getStartOffset();
      const text = block.getText();
      const beforeInput = text.slice(0, startOffset);
      const mark = `${beforeInput}${char}`;
      let newEditorState = editorState;

      const newBlockType = behavior.handleBeforeInputBlockType(
        mark,
        blockTypes,
      );

      if (newBlockType) {
        newEditorState = DraftUtils.resetBlockWithType(
          newEditorState,
          newBlockType,
          text.replace(beforeInput, ""),
        );
      }

      if (enableHorizontalRule && behavior.handleBeforeInputHR(mark, block)) {
        newEditorState = DraftUtils.removeBlock(
          DraftUtils.addHorizontalRuleRemovingSelection(newEditorState),
          block.getKey(),
        );
      }

      const newStyle = behavior.handleBeforeInputInlineStyle(
        beforeInput,
        inlineStyles,
      );

      if (newStyle) {
        newEditorState = DraftUtils.applyMarkdownStyle(
          newEditorState,
          newStyle,
          char,
        );
      }

      if (newEditorState !== editorState) {
        this.onChange(newEditorState);
        return HANDLED;
      }
    }

    return NOT_HANDLED;
  }

  /* :: handlePastedText: (text: string, html: ?string, editorState: EditorState) => 'handled' | 'not-handled'; */
  handlePastedText(text: string, html: ?string, editorState: EditorState) {
    const { stripPastedStyles } = this.props;

    // Leave paste handling to Draft.js when stripping styles is desirable.
    if (stripPastedStyles) {
      return NOT_HANDLED;
    }

    const pastedState = handleDraftEditorPastedText(html, editorState);

    if (pastedState) {
      this.onChange(pastedState);
      return HANDLED;
    }

    return NOT_HANDLED;
  }

  /* :: toggleBlockType: (blockType: string) => void; */
  toggleBlockType(blockType: string) {
    const editorState = this.getEditorState();
    this.onChange(RichUtils.toggleBlockType(editorState, blockType));
  }

  /* :: toggleInlineStyle: (inlineStyle: string) => void; */
  toggleInlineStyle(inlineStyle: string) {
    const editorState = this.getEditorState();
    this.onChange(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  }

  /* :: addHR: () => void; */
  addHR() {
    const editorState = this.getEditorState();
    this.onChange(DraftUtils.addHorizontalRuleRemovingSelection(editorState));
  }

  /* :: addBR: () => void; */
  addBR() {
    const editorState = this.getEditorState();
    this.onChange(DraftUtils.addLineBreak(editorState));
  }

  /* :: blockRenderer: (block: ContentBlock) => {}; */
  blockRenderer(block: ContentBlock) {
    const { entityTypes } = this.props;
    const editorState = this.getEditorState();
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
        /** The editorState is available for arbitrary content manipulation. */
        editorState,
        /** Current entity to manage. */
        entity,
        /** Current entityKey to manage. */
        entityKey,
        /** Whole entityType configuration, as provided to the editor. */
        entityType,
        /** Make the whole editor read-only, except for the block. */
        lockEditor: this.lockEditor,
        /** Make the editor editable again. */
        unlockEditor: this.unlockEditor,
        /** Shorthand to edit entity data. */
        onEditEntity: this.onEditEntity.bind(null, entityKey),
        /** Shorthand to remove an entity, and the related block. */
        onRemoveEntity: this.onRemoveEntity.bind(
          null,
          entityKey,
          block.getKey(),
        ),
        /** Update the editorState with arbitrary changes. */
        onChange: this.onChange,
      },
    };
  }

  /**
   * Imperative focus API similar to that of Draft.js.
   * See https://draftjs.org/docs/advanced-topics-managing-focus.html#content.
   */
  /* :: focus: () => void; */
  focus() {
    this.editorRef.focus();
  }

  /* :: renderSource: () => ?Node; */
  renderSource() {
    const { sourceOptions } = this.state;
    const editorState = this.getEditorState();

    if (sourceOptions && sourceOptions.entityType) {
      const Source = sourceOptions.entityType.source;

      return (
        <Source
          /** The editorState is available for arbitrary content manipulation. */
          editorState={editorState}
          /** Takes the updated editorState, or null if there are no changes, and focuses the editor. */
          onComplete={this.onCompleteSource}
          /** Closes the source, without focusing the editor again. */
          onClose={this.onCloseSource}
          /** Current entity to edit, if any. */
          entity={sourceOptions.entity}
          /** Current entityKey to edit, if any. */
          entityKey={sourceOptions.entityKey}
          /** Whole entityType configuration, as provided to the editor. */
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
      decorators,
      controls,
      readOnly,
      maxListNesting,
      plugins,
      topToolbar,
      bottomToolbar,
    } = this.props;
    const { hasFocus, readOnlyState } = this.state;
    const editorState = this.getEditorState();
    const isReadOnly = readOnlyState || readOnly;
    const hidePlaceholder = DraftUtils.shouldHidePlaceholder(editorState);
    const entityDecorators = entityTypes
      .filter((type) => !!type.decorator)
      .map((type) => ({
        strategy: DraftUtils.getEntityTypeStrategy(type.type),
        // $FlowFixMe
        component: decorateComponentWithProps(type.decorator, {
          onEdit: this.onEditEntity,
          onRemove: this.onRemoveEntity,
        }),
      }));

    const TopToolbar = topToolbar;
    const BottomToolbar = bottomToolbar;
    const toolbarProps = {
      currentStyles: editorState.getCurrentInlineStyle(),
      currentBlock: DraftUtils.getSelectedBlock(editorState).getType(),
      enableHorizontalRule,
      enableLineBreak,
      showUndoControl,
      showRedoControl,
      blockTypes,
      inlineStyles,
      entityTypes,
      controls,
      readOnly: isReadOnly,
      toggleBlockType: this.toggleBlockType,
      toggleInlineStyle: this.toggleInlineStyle,
      addHR: this.addHR,
      addBR: this.addBR,
      onUndoRedo: this.onUndoRedo,
      onRequestSource: this.onRequestSource,
      getEditorState: this.getEditorState,
      onChange: this.onChange,
    };

    return (
      <div
        className={`Draftail-Editor${
          isReadOnly ? " Draftail-Editor--readonly" : ""
        }${hidePlaceholder ? " Draftail-Editor--hide-placeholder" : ""}${
          hasFocus ? " Draftail-Editor--focus" : ""
        }`}
      >
        {TopToolbar ? <TopToolbar {...toolbarProps} /> : null}

        <Editor
          customStyleMap={behavior.getCustomStyleMap(inlineStyles)}
          ref={(ref) => {
            this.editorRef = ref;
          }}
          editorState={editorState}
          onChange={this.onChange}
          placeholder={placeholder}
          readOnly={isReadOnly}
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
          plugins={plugins}
          // $FlowFixMe
          decorators={decorators.concat(entityDecorators)}
        />

        {BottomToolbar ? <BottomToolbar {...toolbarProps} /> : null}

        {this.renderSource()}

        <ListNestingStyles max={maxListNesting} />
      </div>
    );
  }
}

DraftailEditor.defaultProps = defaultProps;

export default DraftailEditor;
