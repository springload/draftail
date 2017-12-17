import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';

import { Icon } from '../../lib';

const propTypes = {
    block: PropTypes.object.isRequired,
    contentState: PropTypes.object.isRequired,
    blockProps: PropTypes.shape({
        editorState: PropTypes.instanceOf(EditorState).isRequired,
        entity: PropTypes.object,
        entityConfig: PropTypes.object.isRequired,
        lockEditor: PropTypes.func.isRequired,
        unlockEditor: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
};

/**
 * Editor block to preview and edit images.
 */
class ImageBlock extends Component {
    constructor(props) {
        super(props);

        this.onSave = this.onSave.bind(this);
        this.changeText = this.changeText.bind(this);
        this.changeAlignment = this.changeAlignment.bind(this);
        this.renderMediaOptions = this.renderMediaOptions.bind(this);
    }

    onSave(nextData) {
        const { block, blockProps, contentState } = this.props;
        const { editorState, onChange } = blockProps;

        let nextContentState = contentState.mergeEntityData(
            block.getEntityAt(0),
            nextData,
        );

        // To remove in Draft.js 0.11.
        // This is necessary because entity data is still using a mutable, global store.
        nextContentState = Modifier.mergeBlockData(
            nextContentState,
            new SelectionState({
                anchorKey: block.getKey(),
                anchorOffset: 0,
                focusKey: block.getKey(),
                focusOffset: block.getLength(),
            }),
            {},
        );

        onChange(
            EditorState.push(
                editorState,
                nextContentState,
                'insert-characters',
            ),
        );
    }

    changeText(e) {
        this.onSave({
            alt: e.currentTarget.value,
        });
    }

    changeAlignment(e) {
        this.onSave({
            alignment: e.currentTarget.value,
        });
    }

    renderMediaOptions() {
        const { blockProps } = this.props;
        const { entity, entityConfig } = blockProps;
        const { alt, alignment } = entity.getData();
        const imageFormats = entityConfig.imageFormats || [];

        return (
            <div className="ImageBlock-options">
                <div className="RichEditor-grid">
                    <div className="RichEditor-col">
                        <label className="u-block">
                            <h4>Alt text</h4>
                            <p>
                                <input
                                    type="text"
                                    value={alt || ''}
                                    onChange={this.changeText}
                                />
                            </p>
                        </label>
                    </div>
                    <div className="RichEditor-col">
                        <h4>Image alignment</h4>
                        <p>
                            {imageFormats.map(format => {
                                return (
                                    <label key={format.value}>
                                        <input
                                            type="radio"
                                            value={format.value}
                                            onChange={this.changeAlignment}
                                            checked={format.value === alignment}
                                        />
                                        {format.label}
                                    </label>
                                );
                            })}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { block, blockProps } = this.props;
        const { entity, entityKey, entityConfig } = blockProps;
        const { src } = entity.getData();

        return (
            <div
                className="ImageBlock"
                data-tooltip={entityKey}
                data-block={block.getKey()}
            >
                <span className="ImageBlock-icon">
                    <Icon icon={entityConfig.icon} />
                </span>

                <div className="ImageBlock-container">
                    <span className="ImageBlock-preview">
                        <img src={src} alt="" />
                    </span>
                </div>

                {false ? this.renderMediaOptions() : null}
            </div>
        );
    }
}

ImageBlock.propTypes = propTypes;

export default ImageBlock;
