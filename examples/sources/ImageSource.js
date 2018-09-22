import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AtomicBlockUtils, EditorState } from 'draft-js';

import Modal from '../components/Modal';

class ImageSource extends Component {
    constructor(props) {
        super(props);

        const { entity } = this.props;
        const state = {
            src: '',
        };

        if (entity) {
            const data = entity.getData();
            state.src = data.src;
        }

        this.state = state;

        this.onRequestClose = this.onRequestClose.bind(this);
        this.onAfterOpen = this.onAfterOpen.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.onChangeSource = this.onChangeSource.bind(this);
    }

    onConfirm(e) {
        const {
            editorState,
            entity,
            entityKey,
            entityType,
            onComplete,
        } = this.props;
        const { src } = this.state;
        const content = editorState.getCurrentContent();
        let nextState;

        e.preventDefault();

        if (entity) {
            const nextContent = content.mergeEntityData(entityKey, { src });
            nextState = EditorState.push(
                editorState,
                nextContent,
                'apply-entity',
            );
        } else {
            const contentWithEntity = content.createEntity(
                entityType.type,
                'MUTABLE',
                {
                    alt: '',
                    src,
                },
            );
            nextState = AtomicBlockUtils.insertAtomicBlock(
                editorState,
                contentWithEntity.getLastCreatedEntityKey(),
                ' ',
            );
        }

        onComplete(nextState);
    }

    onRequestClose(e) {
        const { onClose } = this.props;
        e.preventDefault();

        onClose();
    }

    onAfterOpen() {
        if (this.inputRef) {
            this.inputRef.focus();
            this.inputRef.select();
        }
    }

    onChangeSource(e) {
        const src = e.target.value;
        this.setState({ src });
    }

    render() {
        const { src } = this.state;
        return (
            <Modal
                onRequestClose={this.onRequestClose}
                onAfterOpen={this.onAfterOpen}
                isOpen
                contentLabel="Image chooser"
            >
                <form className="ImageSource" onSubmit={this.onConfirm}>
                    <label className="form-field">
                        <span className="form-field__label">Image src</span>
                        <input
                            ref={(inputRef) => {
                                this.inputRef = inputRef;
                            }}
                            type="text"
                            onChange={this.onChangeSource}
                            value={src}
                            placeholder="/media/image.png"
                        />
                    </label>

                    <button type="button" className="Tooltip__button">
                        Save
                    </button>
                </form>
            </Modal>
        );
    }
}

ImageSource.propTypes = {
    editorState: PropTypes.object.isRequired,
    onComplete: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    entityType: PropTypes.object.isRequired,
    entityKey: PropTypes.string,
    entity: PropTypes.object,
};

ImageSource.defaultProps = {
    entity: null,
    entityKey: null,
};

export default ImageSource;
