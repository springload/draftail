import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { RichUtils } from 'draft-js';

import Modal from '../components/Modal';

class LinkSource extends Component {
    constructor(props) {
        super(props);

        const { entity } = this.props;
        let url = '';

        if (entity) {
            const data = entity.getData();
            url = data.url;
        }

        this.state = {
            url: url,
        };

        this.onClose = this.onClose.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChangeURL = this.onChangeURL.bind(this);
    }

    onConfirm(e) {
        const { editorState, options, onUpdate } = this.props;
        const { url } = this.state;

        e.preventDefault();

        const contentState = editorState.getCurrentContent();

        const data = {
            url: url.replace(/\s/g, ''),
        };
        const contentStateWithEntity = contentState.createEntity(
            options.type,
            'MUTABLE',
            data,
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
        const nextState = RichUtils.toggleLink(
            editorState,
            editorState.getSelection(),
            entityKey,
        );

        onUpdate(nextState);
    }

    onClose(e) {
        const { onClose } = this.props;
        e.preventDefault();

        onClose();
    }

    onChangeURL(e) {
        const url = e.target.value;
        this.setState({ url });
    }

    render() {
        const { url } = this.state;
        return (
            <Modal
                onRequestClose={this.onClose}
                isOpen={true}
                contentLabel="Link chooser"
            >
                <form className="LinkSource" onSubmit={this.onConfirm}>
                    <label className={`form-field`}>
                        <span className="form-field__label">Link URL</span>
                        <input
                            type="text"
                            onChange={this.onChangeURL}
                            value={url}
                            placeholder="www.example.com"
                        />
                    </label>

                    <button className="RichEditor-tooltip__button">Save</button>
                </form>
            </Modal>
        );
    }
}

LinkSource.propTypes = {
    editorState: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    entity: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

LinkSource.defaultProps = {
    entity: null,
};

export default LinkSource;
