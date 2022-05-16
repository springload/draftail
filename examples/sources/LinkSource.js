// @flow
import React, { Component } from "react";

import { RichUtils, EditorState, Modifier } from "draft-js";
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
|};

type State = {|
  url: string,
|};

class LinkSource extends Component<Props, State> {
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
    this.onChangeURL = this.onChangeURL.bind(this);
  }

  /* :: onConfirm: (e: Event) => void; */
  onConfirm(e: Event) {
    const { editorState, entityType, onComplete } = this.props;
    const { url } = this.state;

    e.preventDefault();

    const contentState = editorState.getCurrentContent();

    const data = {
      url: url.replace(/\s/g, ""),
    };
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

  /* :: onAfterOpen: () => void; */
  onAfterOpen() {
    const input = this.inputRef;

    if (input) {
      input.focus();
      input.select();
    }
  }

  /* :: onChangeURL: (e: Event) => void; */
  onChangeURL(e: Event) {
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
        contentLabel="Link chooser"
      >
        <form className="LinkSource" onSubmit={this.onConfirm}>
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

/**
 * See https://docs.djangoproject.com/en/4.0/_modules/django/core/validators/#EmailValidator.
 */
const djangoUserRegex =
  /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*$|^"([\001-\010\013\014\016-\037!#-[\]-\177]|\\[\001-\011\013\014\016-\177])*"$)/i;
const djangoDomainRegex =
  /((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+)(?:[A-Z0-9-]{2,63}(?<!-))$/i;

const getValidURL = (text: string) => {
  if (text.includes("@")) {
    const [user, domain] = text.split("@");
    if (djangoUserRegex.test(user) && djangoDomainRegex.test(domain)) {
      return `mailto:${text}`;
    }
  }

  try {
    // eslint-disable-next-line compat/compat
    const url = new URL(text);

    if (["http:", "https:"].includes(url.protocol)) {
      return text;
    }
  } catch (e) {
    return false;
  }

  return false;
};

export const onPasteLink = (
  entityType: {},
  text: string,
  html: ?string,
  editorState: EditorState,
  { setEditorState }: { setEditorState: (EditorState) => void },
): "handled" | "not-handled" => {
  const url = getValidURL(text);

  if (!url) {
    return "not-handled";
  }

  const selection = editorState.getSelection();
  let content = editorState.getCurrentContent();
  content = content.createEntity("LINK", "MUTABLE", { url });
  const entityKey = content.getLastCreatedEntityKey();
  let nextState: EditorState;

  if (selection.isCollapsed()) {
    content = Modifier.insertText(content, selection, text, null, entityKey);
    nextState = EditorState.push(editorState, content, "insert-characters");
  } else {
    nextState = RichUtils.toggleLink(editorState, selection, entityKey);
  }

  setEditorState(nextState);
  return "handled";
};

export default LinkSource;
