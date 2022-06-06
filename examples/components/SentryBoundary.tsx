import React, { Component } from "react";
import type { Node } from "react";
const { Raven } = window;
const isRavenAvailable = !!Raven;
type Props = {
  children: Node;
};
type State = {
  error: Error | null | undefined;
  reloads: number;
};

class SentryBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      error: null,
      reloads: 0,
    };
    this.onAttemptReload = this.onAttemptReload.bind(this);
  }

  /* :: onAttemptReload: () => void; */
  onAttemptReload() {
    const { reloads } = this.state;

    if (reloads > 2) {
      window.location.reload(false);
    } else {
      this.setState({
        error: null,
        reloads: reloads + 1,
      });
    }
  }

  componentDidCatch(
    error: Error,
    errorInfo: {
      componentStack: string;
    },
  ) {
    this.setState({
      error,
    });

    if (isRavenAvailable) {
      Raven.captureException(error, {
        extra: errorInfo,
      });
    }
  }

  render() {
    const { children } = this.props;
    const { reloads, error } = this.state;
    return error ? (
      <div className="editor">
        <div className="editor__toolbar">
          <div className="toolbar-group">
            <button type="button" className="toolbar-button" disabled>
              &nbsp;
            </button>
          </div>
        </div>
        <div className="DraftEditor-root">
          <div className="DraftEditor-editorContainer">
            <div className="public-DraftEditor-content">
              {/* <img src={oops} /> */}
              <div className="u-text-center">
                <p>Oops. The editor just crashed.</p>
                <p>
                  Our team has been notified. You can provide us with more
                  information if you want to.
                </p>
                <div>
                  {isRavenAvailable ? (
                    <button
                      type="button"
                      onClick={() =>
                        Raven.lastEventId() && Raven.showReportDialog()
                      }
                    >
                      Submit a report
                    </button>
                  ) : (
                    <a
                      href="https://github.com/springload/draftail/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textDecoration: "underline",
                      }}
                    >
                      Open a GitHub issue
                    </a>
                  )}
                  <span> or </span>
                  <button type="button" onClick={this.onAttemptReload}>
                    {reloads > 2 ? "Reload the page" : "Reload the editor"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      children
    );
  }
}

export default SentryBoundary;