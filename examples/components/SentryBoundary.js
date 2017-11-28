import PropTypes from 'prop-types';
import React, { Component } from 'react';

const Raven = window.Raven;
const isRavenAvailable = !!Raven;

class SentryBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error });

        if (isRavenAvailable) {
            Raven.captureException(error, { extra: errorInfo });
        }
    }

    render() {
        const { children } = this.props;
        const { error } = this.state;

        return error ? (
            <div className="editor">
                <div className="editor__toolbar">
                    <div className="toolbar-group">
                        <button className="toolbar-button" disabled>
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
                                    Our team has been notified. You can provide
                                    us with more information if you want to.
                                </p>
                                <div>
                                    <button
                                        type="button"
                                        className="RichEditor-tooltip__button"
                                        onClick={() =>
                                            window.location.reload(false)
                                        }
                                    >
                                        Reload the page
                                    </button>
                                    <span> or </span>
                                    {isRavenAvailable ? (
                                        <button
                                            type="button"
                                            className="RichEditor-tooltip__button"
                                            onClick={() =>
                                                Raven.lastEventId() &&
                                                Raven.showReportDialog()
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
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            Open a GitHub issue
                                        </a>
                                    )}
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

SentryBoundary.propTypes = {
    children: PropTypes.node.isRequired,
};

export default SentryBoundary;
