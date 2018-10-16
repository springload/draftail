// @flow
import React, { Component } from "react";
import { RichUtils, EditorState } from "draft-js";
import type { EntityInstance } from "draft-js";

// $FlowFixMe
import { ChromePicker } from "react-color";

import Modal from "../components/Modal";

type Props = {|
  editorState: EditorState,
  onComplete: (EditorState) => void,
  onClose: () => void,
  entityType: {
    type: string,
  },
  entity: ?EntityInstance,
|};

type State = {|
  color: string,
|};

class ColorSource extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { entity } = this.props;
    const state = {
      color: "#fff",
    };

    if (entity) {
      const data = entity.getData();
      state.color = data.color;
    }

    this.state = state;

    this.onRequestClose = this.onRequestClose.bind(this);
    this.onChangeColor = this.onChangeColor.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  /* :: onConfirm: () => void; */
  onConfirm() {
    const { color } = this.state;
    const { editorState, entityType, onComplete } = this.props;

    const contentState = editorState.getCurrentContent();
    const data = { color };
    const contentStateWithEntity = contentState.createEntity(
      // Fixed in https://github.com/facebook/draft-js/commit/6ba124cf663b78c41afd6c361a67bd29724fa617, to be released.
      // $FlowFixMe
      entityType.type,
      "MUTABLE",
      data,
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const nextState = RichUtils.toggleLink(
      editorState,
      editorState.getSelection(),
      entityKey,
    );
    onComplete(nextState);
  }

  /* :: onRequestClose: (e: SyntheticEvent<>) => void; */
  onRequestClose(e: SyntheticEvent<>) {
    const { onClose } = this.props;
    e.preventDefault();

    onClose();
  }

  /* :: onChangeColor: (color: {| hex: string |}) => void; */
  onChangeColor(color: {| hex: string |}) {
    this.setState({ color: color.hex });
  }

  render() {
    const { color } = this.state;
    return (
      <Modal
        onRequestClose={this.onRequestClose}
        onAfterOpen={() => {}}
        isOpen
        contentLabel="Pick a color"
      >
        <div className="ColorSource">
          <ChromePicker onChangeComplete={this.onChangeColor} color={color} />
          <button type="button" onClick={this.onConfirm}>
            Save
          </button>
        </div>
      </Modal>
    );
  }
}

export default ColorSource;
