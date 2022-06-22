import React, { Component } from "react";
import { AtomicBlockUtils, EditorState } from "draft-js";
import type { EntityInstance } from "draft-js";

import Modal from "../components/Modal";
import { getValidLinkURL } from "../entities/Link";

import embedly from "../utils/embedly";

type Props = {
  editorState: EditorState;
  onComplete: (state: EditorState) => void;
  onClose: () => void;
  entityType: {
    type: string;
  };
  entity: EntityInstance | null | undefined;
  entityKey: string | null | undefined;
  textDirectionality: "LTR" | "RTL";
};

type State = {
  url: string;
};

class EmbedSource extends Component<Props, State> {
  inputRef: HTMLInputElement | null | undefined;

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

  onConfirm(e: Event) {
    const { editorState, entity, entityKey, entityType, onComplete } =
      this.props;
    const { url } = this.state;
    const content = editorState.getCurrentContent();
    let nextState;

    e.preventDefault();

    embedly.get(url, (embed) => {
      if (entity && entityKey) {
        const nextContent = content.mergeEntityData(entityKey, {
          url: embed.url,
          title: embed.title,
          authorName: embed.author_name,
          thumbnail: embed.thumbnail_url,
        });
        nextState = EditorState.push(editorState, nextContent, "apply-entity");
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
    });
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

  onChangeSource(e: Event) {
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
        contentLabel="Embed chooser"
      >
        <form
          dir={textDirectionality === "RTL" ? "rtl" : null}
          className="EmbedSource"
          onSubmit={this.onConfirm}
        >
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

export const getValidEmbedURL = (
  text: string | false,
  hostnames: ReadonlyArray<string>,
) => {
  if (text) {
    const urlObj = new URL(text);
    return hostnames.includes(urlObj.hostname) ? text : false;
  }

  return false;
};

export const onPasteEmbed = (
  text: string,
  html: string | null | undefined,
  editorState: EditorState,
  {
    setEditorState,
    getEditorState,
  }: {
    setEditorState: (state: EditorState) => void;
    getEditorState: () => EditorState;
  },
  entityType: {
    schemes: ReadonlyArray<string>;
  },
): "handled" | "not-handled" => {
  const url = getValidEmbedURL(getValidLinkURL(text, ["https:"]), [
    "www.youtube.com",
  ]);

  if (!url) {
    return "not-handled";
  }

  const content = editorState.getCurrentContent();
  let nextContent = content.createEntity(entityType.type, "IMMUTABLE", { url });
  const entityKey = nextContent.getLastCreatedEntityKey();
  let nextState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    " ",
  );

  setEditorState(nextState);

  embedly.get(url, (embed) => {
    nextState = getEditorState();
    nextContent = nextState.getCurrentContent();
    nextContent = nextContent.mergeEntityData(entityKey, {
      url: embed.url,
      title: embed.title,
      thumbnail: embed.thumbnail_url,
    });
    setEditorState(EditorState.push(nextState, nextContent, "apply-entity"));
  });

  return "handled";
};
