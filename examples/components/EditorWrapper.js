import PropTypes from 'prop-types';
import React, { Component } from 'react';

import DraftailEditor from '../../lib';

import SentryBoundary from '../components/SentryBoundary';
import Highlight from '../components/Highlight';

/* global PKG_VERSION */
const DRAFTAIL_VERSION = PKG_VERSION;

class EditorWrapper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            content: null,
        };

        this.onSave = this.onSave.bind(this);
    }

    onSave(content) {
        const { id, onSave } = this.props;

        this.setState({ content });

        sessionStorage.setItem(`${id}:content`, JSON.stringify(content));

        if (onSave) {
            onSave(content);
        }
    }

    render() {
        const { id } = this.props;
        const { content } = this.state;
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
                            <span>Version: {DRAFTAIL_VERSION}</span>
                        </li>
                    </ul>
                    <Highlight
                        language="js"
                        value={JSON.stringify(
                            content || initialContent,
                            null,
                            2,
                        )}
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
