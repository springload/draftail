// @flow
import React, { Component } from "react";
import { AtomicBlockUtils, EditorState } from "draft-js";
import type { EntityInstance } from "draft-js";

import Modal from "../components/Modal";

import embedly from "../utils/embedly";

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
  url: string,
|};

class EmbedSource extends Component<Props, State> {
  inputRef: ?HTMLInputElement;

  constructor(props: Props) {
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
    const { url } = this.state;
    const content = editorState.getCurrentContent();
    let nextState;

    e.preventDefault();

    embedly.get(url, (embed) => {
      if (entity && entityKey) {
        const nextContent = content.mergeEntityData(entityKey, {
          url: embed.url,
          title: embed.title,
          thumbnail: embed.thumbnail_url,
        });
        nextState = EditorState.push(editorState, nextContent, "apply-entity");
      } else {
        const contentWithEntity = content.createEntity(
          // Fixed in https://github.com/facebook/draft-js/commit/6ba124cf663b78c41afd6c361a67bd29724fa617, to be released.
          // $FlowFixMe
          entityType.type,
          "IMMUTABLE",
          {
            url: embed.url,
            title: embed.title,
            authorName: embed.author_name,
            thumbnail: embed.thumbnail_url,
          },
        );
        nextState = AtomicBlockUtils.insertAtomicBlock(
          editorState,
          contentWithEntity.getLastCreatedEntityKey(),
          " ",
        );
      }

      onComplete(nextState);
    });
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
      const url = e.target.value;
      this.setState({ url });
    }
  }

  render() {
    const { url } = this.state;
    return (
      <Modal
        onRequestClose={this.onRequestClose}
        onAfterOpen={this.onAfterOpen}
        isOpen
        contentLabel="Embed chooser"
      >
        <form className="EmbedSource" onSubmit={this.onConfirm}>
          <label className="form-field">
            <span className="form-field__label">Embed URL</span>
            <input
              ref={(inputRef) => {
                this.inputRef = inputRef;
              }}
              type="text"
              onChange={this.onChangeSource}
              value={url}
              placeholder="youtube.com"
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

export default EmbedSource;
