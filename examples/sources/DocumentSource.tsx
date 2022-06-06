import React, { Component } from "react";
import { RichUtils, EditorState } from "draft-js";
import type { EntityInstance } from "draft-js";
import Modal from "../components/Modal";
type Props = {
  editorState: EditorState;
  onComplete: (arg0: EditorState) => void;
  onClose: () => void;
  entityType: {
    type: string;
  };
  entity: EntityInstance | null | undefined;
  textDirectionality: "LTR" | "RTL";
};
type State = {
  url: string;
};

class DocumentSource extends Component<Props, State> {
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
  onRequestClose(e: React.SyntheticEvent) {
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
      this.setState({
        url,
      });
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
        contentLabel="Document chooser"
      >
        <form
          dir={textDirectionality === "RTL" ? "rtl" : null}
          className="DocumentSource"
          onSubmit={this.onConfirm}
        >
          <label className="form-field">
            <span className="form-field__label">Document URL</span>
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

export default DocumentSource;