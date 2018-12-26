import PropTypes from "prop-types";
import React, { Component } from "react";

import { DraftailEditor } from "../../lib";

import SentryBoundary from "./SentryBoundary";
import Highlight from "./Highlight";
import EditorBenchmark from "./EditorBenchmark";

/* global PKG_VERSION */
const DRAFTAIL_VERSION =
  typeof PKG_VERSION === "undefined" ? "dev" : PKG_VERSION;

class EditorWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: null,
      saveCount: 0,
    };

    this.onSave = this.onSave.bind(this);
  }

  onSave(content) {
    const { id, onSave } = this.props;

    this.setState(({ saveCount }) => ({ content, saveCount: saveCount + 1 }));

    sessionStorage.setItem(`${id}:content`, JSON.stringify(content));

    if (onSave) {
      onSave(content);
    }
  }

  render() {
    const { id } = this.props;
    const { content, saveCount } = this.state;
    const initialContent =
      JSON.parse(sessionStorage.getItem(`${id}:content`)) || null;
    return (
      <div>
        <SentryBoundary>
          <DraftailEditor
            rawContentState={initialContent}
            {...this.props}
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
            language="js"
            value={JSON.stringify(content || initialContent, null, 2)}
          />
        </details>
      </div>
    );
  }
}

EditorWrapper.propTypes = {
  id: PropTypes.string.isRequired,
  onSave: PropTypes.func,
};

EditorWrapper.defaultProps = {
  onSave: () => {},
};

export default EditorWrapper;
