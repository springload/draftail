// @flow
import React, { Component } from "react";

import { AtomicBlockUtils, EditorState } from "draft-js";
import type { EntityInstance } from "draft-js";

import Modal from "../components/Modal";

type Props = {|
  editorState: EditorState,
  onComplete: (EditorState) => void,
  onClose: () => void,
  entityType: {
    type: string,
  },
  entity: ?EntityInstance,
  entityKey: ?string,
|};

type State = {|
  src: string,
|};

class ImageSource extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { entity } = this.props;
    const state = {
      src: "",
    };

    if (entity) {
      const data = entity.getData();
      state.src = data.src;
    }

    this.state = state;

    this.onRequestClose = this.onRequestClose.bind(this);
    this.onAfterOpen = this.onAfterOpen.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onChangeSource = this.onChangeSource.bind(this);
  }

  /* :: onConfirm: (e: Event) => void; */
  onConfirm(e: Event) {
    const {
      editorState,
      entity,
      entityKey,
      entityType,
      onComplete,
    } = this.props;
    const { src } = this.state;
    const content = editorState.getCurrentContent();
    let nextState;

    e.preventDefault();

    if (entity && entityKey !== null && typeof entityKey !== "undefined") {
      const nextContent = content.mergeEntityData(entityKey, { src });
      nextState = EditorState.push(editorState, nextContent, "apply-entity");
    } else {
      const contentWithEntity = content.createEntity(
        // Fixed in https://github.com/facebook/draft-js/commit/6ba124cf663b78c41afd6c361a67bd29724fa617, to be released.
        // $FlowFixMe
        entityType.type,
        "MUTABLE",
        {
          alt: "",
          src,
        },
      );
      nextState = AtomicBlockUtils.insertAtomicBlock(
        editorState,
        contentWithEntity.getLastCreatedEntityKey(),
        " ",
      );
    }

    onComplete(nextState);
  }

  /* :: onRequestClose: (e: SyntheticEvent<>) => void; */
  onRequestClose(e: SyntheticEvent<>) {
    const { onClose } = this.props;
    e.preventDefault();

    onClose();
  }

  /* :: onAfterOpen: () => void; */
  onAfterOpen() {
    const input = this.inputRef;

    if (input) {
      input.focus();
      input.select();
    }
  }

  /* :: onChangeSource: (e: Event) => void; */
  onChangeSource(e: Event) {
    if (e.target instanceof HTMLInputElement) {
      const src = e.target.value;
      this.setState({ src });
    }
  }

  inputRef: ?HTMLInputElement;

  render() {
    const { src } = this.state;
    return (
      <Modal
        onRequestClose={this.onRequestClose}
        onAfterOpen={this.onAfterOpen}
        isOpen
        contentLabel="Image chooser"
      >
        <form className="ImageSource" onSubmit={this.onConfirm}>
          <label className="form-field">
            <span className="form-field__label">Image src</span>
            <input
              ref={(inputRef) => {
                this.inputRef = inputRef;
              }}
              type="text"
              onChange={this.onChangeSource}
              value={src}
              placeholder="/media/image.png"
            />
          </label>

          <button type="submit" className="Tooltip__button">
            Save
          </button>
        </form>
      </Modal>
    );
  }
}

export default ImageSource;
