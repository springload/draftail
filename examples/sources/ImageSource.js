import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { AtomicBlockUtils, EditorState } from 'draft-js';

import Modal from '../components/Modal';

class ImageSource extends Component {
    constructor(props) {
        super(props);

        const { entity } = this.props;
        let src = '';

        if (entity) {
            const data = entity.getData();
            src = data.src;
        }

        this.state = {
            src: src,
        };

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
            options,
            onUpdate,
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
                options.type,
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

        onUpdate(nextState);
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
                isOpen={true}
                contentLabel="Image chooser"
            >
                <form className="ImageSource" onSubmit={this.onConfirm}>
                    <label className={`form-field`}>
                        <span className="form-field__label">Image src</span>
                        <input
                            ref={inputRef => {
                                this.inputRef = inputRef;
                            }}
                            type="text"
                            onChange={this.onChangeSource}
                            value={src}
                            placeholder="/media/image.png"
                        />
                    </label>

                    <button className="Tooltip__button">Save</button>
                </form>
            </Modal>
        );
    }
}

ImageSource.propTypes = {
    editorState: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    entity: PropTypes.object,
    entityKey: PropTypes.string,
    onUpdate: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
};

ImageSource.defaultProps = {
    entity: null,
    entityKey: null,
};

export default ImageSource;
