// @flow
import React, { Component } from "react";
import {
  RichUtils,
  EditorState,
  ContentState,
  CharacterMetadata,
  SelectionState,
} from "draft-js";
import type { RawDraftContentState } from "draft-js/lib/RawDraftContentState";
// $FlowFixMe
import { ChromePicker } from "react-color";

import { ToolbarButton } from "../../lib";

import Modal from "./Modal";

/**
 * Retrieve all of the COLOR_ inline style identifiers.
 */
export const getColorInlineStyles = (rawContentState: RawDraftContentState) =>
  Array.from<string>(
    new Set(
      rawContentState.blocks.reduce((acc, b) => {
        if (!b.inlineStyleRanges) {
          return acc;
        }

        return acc.concat(
          b.inlineStyleRanges
            .filter((r) => r.style.startsWith("COLOR_"))
            .map((r) => r.style),
        );
      }, []),
    ),
  );

/**
 * Remove all of the COLOR_ styles from the current selection.
 * This is to ensure only one COLOR_ style is applied per range of text.
 * Replicated from https://github.com/thibaudcolas/draftjs-filters/blob/f997416a0c076eb6e850f13addcdebb5e52898e5/src/lib/filters/styles.js#L7,
 * with additional "is the character in the selection" logic.
 */
export const filterColorStylesFromSelection = (
  content: ContentState,
  selection: SelectionState,
) => {
  const blockMap = content.getBlockMap();
  const startKey = selection.getStartKey();
  const endKey = selection.getEndKey();
  const startOffset = selection.getStartOffset();
  const endOffset = selection.getEndOffset();

  let isAfterStartKey = false;
  let isAfterEndKey = false;

  const blocks = blockMap.map((block) => {
    const isStartBlock = block.getKey() === startKey;
    const isEndBlock = block.getKey() === endKey;
    isAfterStartKey = isAfterStartKey || isStartBlock;
    isAfterEndKey = isAfterEndKey || isEndBlock;
    const isBeforeEndKey = isEndBlock || !isAfterEndKey;
    const isBlockInSelection = isAfterStartKey && isBeforeEndKey;

    // Skip filtering through the block chars if out of selection.
    if (!isBlockInSelection) {
      return block;
    }

    let altered = false;

    const chars = block.getCharacterList().map((char, i) => {
      const isAfterStartOffset = i >= startOffset;
      const isBeforeEndOffset = i < endOffset;
      const isCharInSelection =
        // If the selection is on a single block, the char needs to be in-between start and end offsets.
        (isStartBlock &&
          isEndBlock &&
          isAfterStartOffset &&
          isBeforeEndOffset) ||
        // Start block only: after start offset
        (isStartBlock && !isEndBlock && isAfterStartOffset) ||
        // End block only: before end offset.
        (isEndBlock && !isStartBlock && isBeforeEndOffset) ||
        // Neither start nor end: just "in selection".
        (isBlockInSelection && !isStartBlock && !isEndBlock);

      let newChar = char;

      if (isCharInSelection) {
        char
          .getStyle()
          .filter((type) => type.startsWith("COLOR_"))
          .forEach((type) => {
            altered = true;
            newChar = CharacterMetadata.removeStyle(newChar, type);
          });
      }

      return newChar;
    });

    return altered ? block.set("characterList", chars) : block;
  });

  return content.merge({
    blockMap: blockMap.merge(blocks),
  });
};

const DROP_ICON =
  "M985.827 38.178c-50.904-50.904-133.428-50.904-184.32 0l-153.602 153.61-42.405-42.405c-22.289-22.289-58.414-22.289-80.703 0s-22.289 58.413 0 80.702l42.405 42.404L94.908 744.753c-23.2 23.199-35.829 52.974-37.877 83.33-.83 12.367-3.948 35.327-7.68 60.21-.603 4.085-2.412 8.033-5.54 11.184l-35.329 35.34c-11.31 11.309-11.31 29.65 0 40.959l39.743 39.742c11.31 11.31 29.65 11.31 40.96 0l35.34-35.328c3.151-3.129 7.077-4.926 11.161-5.53 24.884-3.742 47.844-6.849 60.223-7.68 30.356-2.047 60.132-14.676 83.343-37.887L751.523 456.83l42.406 42.404c22.289 22.29 58.414 22.29 80.703 0 22.289-22.289 22.289-58.413 0-80.701L733.945 277.837l110.33 86.208 141.541-141.55c50.916-50.892 50.904-133.414.011-184.317zM683.245 429.5L449.658 663.084c-11.31 11.31-29.65 11.31-40.96 0l-37.206-37.205c-11.31-11.298-29.64-11.298-40.949.011l-7.008 7.009-.023-.023-167.573 167.559c-3.834 3.834-9.318 4.562-12.243 1.627-2.924-2.936-2.207-8.42 1.627-12.243l271.26-271.254.045.045 177.87-177.866c11.31-11.31 29.65-11.31 40.96 0l47.787 47.797c11.31 11.31 11.31 29.65 0 40.96z";

type Props = {|
  getEditorState: () => EditorState,
  onChange: (EditorState) => void,
|};

type State = {|
  isOpen: boolean,
  color: string,
|};

/**
 * A basic control showing a color picker.
 */
class ColorPicker extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false,
      color: "#fff",
    };

    this.onRequestClose = this.onRequestClose.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
    this.onClickButton = this.onClickButton.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  /* :: onConfirm: () => void; */
  onConfirm() {
    const { color } = this.state;
    const { getEditorState, onChange } = this.props;
    const editorState = getEditorState();
    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();
    const newContent = filterColorStylesFromSelection(content, selection);
    let nextState = editorState;

    nextState = EditorState.set(nextState, {
      currentContent: newContent,
    });

    nextState = RichUtils.toggleInlineStyle(
      nextState,
      `COLOR_${color.replace("#", "").toUpperCase()}`,
    );
    nextState = EditorState.forceSelection(nextState, selection);

    onChange(nextState);
    this.onRequestClose();
  }

  /* :: onRequestClose: () => void; */
  onRequestClose() {
    this.setState({
      isOpen: false,
    });
  }

  /* :: onChangeColor: (color: {| hex: string |}) => void; */
  onChangeColor(color: {| hex: string |}) {
    this.setState({ color: color.hex });
  }

  /* :: onClickButton: () => void; */
  onClickButton() {
    this.setState({
      isOpen: true,
    });
  }

  render() {
    const { isOpen, color } = this.state;
    const { getEditorState } = this.props;
    const editorState = getEditorState();

    return (
      <React.Fragment>
        <ToolbarButton
          name="COLORPICKER"
          icon={DROP_ICON}
          onClick={this.onClickButton}
          active={editorState
            .getCurrentInlineStyle()
            .some((s) => s.startsWith("COLOR_"))}
        />
        <Modal
          onRequestClose={this.onRequestClose}
          onAfterOpen={() => {}}
          isOpen={isOpen}
          contentLabel="Pick a color"
        >
          <div className="ColorPicker">
            <ChromePicker onChangeComplete={this.onChangeColor} color={color} />
            <button type="button" onClick={this.onConfirm}>
              Save
            </button>
          </div>
        </Modal>
      </React.Fragment>
    );
  }
}

ColorPicker.type = "INLINE_CONTROL";

export default ColorPicker;
