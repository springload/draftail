import PropTypes from "prop-types";
import React from "react";
import { AtomicBlockUtils, EditorState } from "draft-js";

import Modal from "../components/Modal";

/* global EMBEDLY_API_KEY */
const key = typeof EMBEDLY_API_KEY === "undefined" ? "key" : EMBEDLY_API_KEY;
const EMBEDLY_ENDPOINT = `https://api.embedly.com/1/oembed?key=${key}`;

const getJSON = (endpoint, data, successCallback) => {
  const request = new XMLHttpRequest();
  request.open("GET", endpoint, true);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      successCallback(JSON.parse(request.responseText));
    }
  };
  request.send(data);
};

class EmbedSource extends React.Component {
  constructor(props) {
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

  onConfirm(e) {
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

    getJSON(
      `${EMBEDLY_ENDPOINT}&url=${encodeURIComponent(url)}`,
      null,
      (embed) => {
        if (entity) {
          const nextContent = content.mergeEntityData(entityKey, {
            url: embed.url,
            title: embed.title,
            thumbnail: embed.thumbnail_url,
          });
          nextState = EditorState.push(
            editorState,
            nextContent,
            "apply-entity",
          );
        } else {
          const contentWithEntity = content.createEntity(
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
      },
    );
  }

  onRequestClose(e) {
    const { onClose } = this.props;
    e.preventDefault();

    onClose();
  }

  onAfterOpen() {
    if (this.inputRef) {
      this.inputRef.focus();
      this.inputRef.select();
    }
  }

  onChangeSource(e) {
    const url = e.target.value;
    this.setState({ url });
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

EmbedSource.propTypes = {
  editorState: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  entityType: PropTypes.object.isRequired,
  entityKey: PropTypes.string,
  entity: PropTypes.object,
};

EmbedSource.defaultProps = {
  entity: null,
  entityKey: null,
};

export default EmbedSource;
