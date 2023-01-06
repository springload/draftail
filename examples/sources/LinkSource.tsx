import React, { Component } from "react";

import { EditorState, Modifier, RichUtils } from "draft-js";

import { EntitySourceProps } from "../../src/api/types";

import Modal from "../components/Modal";

type State = {
  url: string;
};

class LinkSource extends Component<EntitySourceProps, State> {
  inputRef?: HTMLInputElement | null;

  constructor(props: EntitySourceProps) {
    super(props);

    const { entity } = this.props;
    const state = {
      url: "",
    };

    if (entity) {
      const data = entity.getData();
      state.url = data.url;
    }

    this.state = state;

    this.onRequestClose = this.onRequestClose.bind(this);
    this.onAfterOpen = this.onAfterOpen.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onChangeURL = this.onChangeURL.bind(this);
  }

  onConfirm(e: React.FormEvent<HTMLFormElement>) {
    const { editorState, entityType, onComplete } = this.props;
    const { url } = this.state;

    e.preventDefault();

    const contentState = editorState.getCurrentContent();

    const data = {
      url: url.replace(/\s/g, ""),
    };
    const contentStateWithEntity = contentState.createEntity(
      entityType.type,
      "MUTABLE",
      data,
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const selection = editorState.getSelection();
    const shouldReplaceText = selection.isCollapsed();

    let nextState;
    if (shouldReplaceText) {
      // If there is a title attribute, use it. Otherwise we inject the URL.
      const newText = data.url;
      const newContent = Modifier.replaceText(
        contentStateWithEntity,
        selection,
        newText,
        undefined,
        entityKey,
      );
      nextState = EditorState.push(
        editorState,
        newContent,
        "insert-characters",
      );
    } else {
      nextState = RichUtils.toggleLink(editorState, selection, entityKey);
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

  onChangeURL(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target instanceof HTMLInputElement) {
      const url = e.target.value;
      this.setState({ url });
    }
  }

  render() {
    const { textDirectionality } = this.props;
    const { url } = this.state;
    return (
      <Modal
        onRequestClose={this.onRequestClose}
        onAfterOpen={this.onAfterOpen}
        isOpen
        contentLabel="Link chooser"
      >
        <form
          dir={textDirectionality === "RTL" ? "rtl" : undefined}
          className="LinkSource"
          onSubmit={this.onConfirm}
        >
          <label className="form-field">
            <span className="form-field__label">Link URL</span>
            <input
              ref={(inputRef) => {
                this.inputRef = inputRef;
              }}
              type="text"
              onChange={this.onChangeURL}
              value={url}
              placeholder="www.example.com"
            />
          </label>

          <button type="submit">Save</button>
        </form>
      </Modal>
    );
  }
}

export default LinkSource;
