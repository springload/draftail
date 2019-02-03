// @flow
import React, { Component } from "react";
import type { RawDraftContentState } from "draft-js/lib/RawDraftContentState";

import { DraftailEditor } from "../../lib";

import SentryBoundary from "./SentryBoundary";
import Highlight from "./Highlight";
import EditorBenchmark from "./EditorBenchmark";

/* global PKG_VERSION */
const DRAFTAIL_VERSION =
  typeof PKG_VERSION === "undefined" ? "dev" : PKG_VERSION;

type Props = {|
  id: string,
  onSave: ?(?RawDraftContentState) => void,
|};

type State = {|
  content: ?RawDraftContentState,
  saveCount: number,
|};

class EditorWrapper extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      content: null,
      saveCount: 0,
    };

    this.onSave = this.onSave.bind(this);
  }

  /* :: onSave: (content: ?RawDraftContentState) => void; */
  onSave(content: ?RawDraftContentState) {
    const { id, onSave } = this.props;

    this.setState(({ saveCount }) => ({ content, saveCount: saveCount + 1 }));

    sessionStorage.setItem(`${id}:content`, JSON.stringify(content));

    if (onSave) {
      onSave(content);
    }
  }

  render() {
    const { id, onSave, ...editorProps } = this.props;
    const { content, saveCount } = this.state;
    const storedContent = sessionStorage.getItem(`${id}:content`) || null;
    const initialContent = storedContent ? JSON.parse(storedContent) : null;
    return (
      <div>
        <SentryBoundary>
          <DraftailEditor
            rawContentState={initialContent}
            {...editorProps}
            onSave={this.onSave}
          />
        </SentryBoundary>
        <details>
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
          <EditorBenchmark componentProps={this.props} runOnMount />
          <Highlight
            value={JSON.stringify(content || initialContent, null, 2)}
          />
        </details>
      </div>
    );
  }
}

export default EditorWrapper;
