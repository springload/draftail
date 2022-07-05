import React, { Component } from "react";

import { AtomicBlockUtils, EditorState } from "draft-js";

import Modal from "../components/Modal";
import { EntitySourceProps } from "../../src";

type State = {
  src: string;
};

class ImageSource extends Component<EntitySourceProps, State> {
  inputRef?: HTMLInputElement | null;

  constructor(props: EntitySourceProps) {
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

  onConfirm(e: React.FormEvent<HTMLFormElement>) {
    const { editorState, entity, entityKey, entityType, onComplete } =
      this.props;
    const { src } = this.state;
    const content = editorState.getCurrentContent();
    let nextState;

    e.preventDefault();

    if (entity && entityKey) {
      const nextContent = content.mergeEntityData(entityKey, { src });
      nextState = EditorState.push(editorState, nextContent, "apply-entity");
    } else {
      const contentWithEntity = content.createEntity(
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

  onRequestClose(e: React.SyntheticEvent) {
    const { onClose } = this.props;
    e.preventDefault();

    onClose();
  }

  onAfterOpen() {
    const input = this.inputRef;

    if (input) {
      input.focus();
      input.select();
    }
  }

  onChangeSource(e: React.ChangeEvent<HTMLInputElement>) {
    const src = e.target.value;
    this.setState({ src });
  }

  render() {
    const { textDirectionality } = this.props;
    const { src } = this.state;
    return (
      <Modal
        onRequestClose={this.onRequestClose}
        onAfterOpen={this.onAfterOpen}
        isOpen
        contentLabel="Image chooser"
      >
        <form
          dir={textDirectionality === "RTL" ? "rtl" : undefined}
          className="ImageSource"
          onSubmit={this.onConfirm}
        >
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
