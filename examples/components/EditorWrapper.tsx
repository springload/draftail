import React, { Component } from "react";

/* :: import { EditorState } from "draft-js"; */
import type { RawDraftContentState } from "draft-js/lib/RawDraftContentState";
import { DraftailEditor, serialiseEditorStateToRaw } from "../../lib";
import SentryBoundary from "./SentryBoundary";
import Highlight from "./Highlight";
import EditorBenchmark from "./EditorBenchmark";

/* global PKG_VERSION */
const DRAFTAIL_VERSION =
  typeof PKG_VERSION === "undefined" ? "dev" : PKG_VERSION;
type Props = {
  id: string;
  rawContentState: RawDraftContentState | null | undefined;
  editorState: EditorState | null | undefined;
  onSave: ((content: null | RawDraftContentState) => void) | null | undefined;
  onChange: ((editorState: EditorState) => void) | null | undefined;
};
type State = {
  content: RawDraftContentState | null | undefined;
  saveCount: number;
};

class EditorWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      content: null,
      saveCount: 0,
    };
    this.onSave = this.onSave.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  /* :: onSave: (content: null | RawDraftContentState) => void; */
  onSave(content: null | RawDraftContentState) {
    const { id, onSave } = this.props;
    this.setState(({ saveCount }) => ({
      content,
      saveCount: saveCount + 1,
    }));
    sessionStorage.setItem(`${id}:content`, JSON.stringify(content));

    if (onSave) {
      onSave(content);
    }
  }

  /* :: onChange: (nextState: EditorState) => void; */
  onChange(nextState: EditorState) {
    const { id, onChange } = this.props;
    const content = serialiseEditorStateToRaw(nextState);
    this.setState(({ saveCount }) => ({
      content,
      saveCount: saveCount + 1,
    }));
    sessionStorage.setItem(`${id}:content`, JSON.stringify(content));

    if (onChange) {
      onChange(nextState);
    }
  }

  render() {
    const {
      id,
      editorState,
      rawContentState,
      onSave,
      onChange,
      ...editorProps
    } = this.props;
    const { content, saveCount } = this.state;
    const dataProps = {};
    let initialContent;

    if (editorState) {
      dataProps.editorState = editorState;
      dataProps.onChange = this.onChange;
    } else {
      const storedContent = sessionStorage.getItem(`${id}:content`) || "null";
      initialContent =
        rawContentState || (storedContent ? JSON.parse(storedContent) : null);
      dataProps.rawContentState = initialContent;
      dataProps.onSave = this.onSave;
    }

    return (
      <div className={`EditorWrapper EditorWrapper--${id}`}>
        <SentryBoundary>
          {/* $FlowFixMe */}
          <DraftailEditor {...dataProps} {...editorProps} />
        </SentryBoundary>
        <details className="EditorWrapper__details">
          <summary>
            <span className="link">Debug</span>
          </summary>
          <ul className="list-inline">
            <li>
              <span>{`Version: ${DRAFTAIL_VERSION}`}</span>
            </li>
            <li>
              <span>{`Saves: ${saveCount}`}</span>
            </li>
          </ul>
          {/* Running multiple editors with the same base state is a source of issues. */}
          {editorState ? null : (
            <EditorBenchmark componentProps={this.props} runOnMount />
          )}
          <Highlight
            value={JSON.stringify(content || initialContent, null, 2) || ""}
          />
        </details>
      </div>
    );
  }
}

export default EditorWrapper;