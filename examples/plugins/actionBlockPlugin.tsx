import React, { Component } from "react";
import {
  ContentState,
  ContentBlock,
  EditorState,
  EditorBlock,
  SelectionState,
  DraftDecorator,
} from "draft-js";

import { DraftUtils } from "../../src/index";

// https://github.com/brijeshb42/medium-draft/blob/master/src/components/blocks/todo.js

type PluginFns = {
  setEditorState: (editorState: EditorState) => void;
  getEditorState: () => EditorState;
};

const updateDataOfBlock = (
  editorState: EditorState,
  block: ContentBlock,
  newData: Record<string, unknown>,
) => {
  const contentState = editorState.getCurrentContent();
  const newBlock = block.merge({
    data: newData,
  }) as ContentBlock;
  const newContentState = contentState.merge({
    blockMap: contentState.getBlockMap().set(block.getKey(), newBlock),
  }) as ContentState;

  // forceSelection hack to make sure the selection does not attempt to go where the checkbox is.
  return EditorState.forceSelection(
    EditorState.push(editorState, newContentState, "change-block-data"),
    editorState.getSelection(),
  );
};

const onMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
  e.preventDefault();
  e.stopPropagation();
};

type Props = {
  block: ContentBlock;
  blockProps: PluginFns;
  blockStyleFn: (block: ContentBlock) => string;
  contentState: ContentState;
  customStyleFn: (
    style: string,
    block: ContentBlock,
  ) => React.CSSProperties | null | undefined;
  customStyleMap: { [key: string]: React.CSSProperties };
  decorator?: DraftDecorator | null;
  forceSelection: boolean;
  offsetKey: string;
  selection: SelectionState;
  startIndent: boolean;
  tree: unknown;
};

class ActionBlock extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const { block, blockProps } = this.props;
    const { setEditorState, getEditorState } = blockProps;

    const data = block.getData();
    const newData = data.set("checked", !data.get("checked"));
    setEditorState(updateDataOfBlock(getEditorState(), block, newData));
  }

  render() {
    const { block } = this.props;
    const checked = block.getData().get("checked", false);
    return (
      <>
        <span contentEditable={false}>
          <input
            type="checkbox"
            defaultChecked={checked}
            onChange={this.onChange}
            onMouseDown={onMouseDown}
          />
        </span>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <EditorBlock {...this.props} />
      </>
    );
  }
}

const ACTION_INPUT = {
  "[] ": false,
  "[ ] ": false,
  "- [] ": false,
  "- [ ] ": false,
  "* [] ": false,
  "* [ ] ": false,
  "[x] ": true,
  "- [x] ": true,
  "* [x] ": true,
  "[X] ": true,
  "- [X] ": true,
  "* [X] ": true,
} as const;
type ActionInput = keyof typeof ACTION_INPUT;

const actionBlockPlugin = () => ({
  blockRendererFn(block: ContentBlock, pluginFns: PluginFns) {
    if (block.getType() === "action-list-item") {
      return {
        component: ActionBlock,
        editable: true,
        props: pluginFns,
      };
    }

    return null;
  },

  handleBeforeInput(
    char: string,
    editorState: EditorState,
    { setEditorState }: PluginFns,
  ) {
    const selection = editorState.getSelection();

    if (selection.isCollapsed()) {
      const block = DraftUtils.getSelectedBlock(editorState);
      const startOffset = selection.getStartOffset();
      const text = block.getText();
      const beforeBeforeInput = text.slice(0, startOffset);
      const mark = `${beforeBeforeInput}${char}`;

      const shouldSwitchBlock =
        typeof ACTION_INPUT[mark as ActionInput] !== "undefined";

      if (shouldSwitchBlock) {
        setEditorState(
          DraftUtils.resetBlockWithType(
            editorState,
            "action-list-item",
            text.replace(beforeBeforeInput, ""),
            {
              checked: ACTION_INPUT[mark as ActionInput],
            },
          ),
        );
        return "handled";
      }
    }

    return "not-handled";
  },
});

export default actionBlockPlugin;
