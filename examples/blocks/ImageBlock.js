import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';

import MediaBlock from '../blocks/MediaBlock';

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
    }

    onSave(nextData) {
        const { block, blockProps, contentState } = this.props;
        const { editorState, onChange } = blockProps;

        let nextContent = contentState.mergeEntityData(
            block.getEntityAt(0),
            nextData,
        );

        // To remove in Draft.js 0.11.
        // This is necessary because entity data is still using a mutable, global store.
        nextContent = Modifier.mergeBlockData(
            nextContent,
            new SelectionState({
                anchorKey: block.getKey(),
                anchorOffset: 0,
                focusKey: block.getKey(),
                focusOffset: block.getLength(),
            }),
            {},
        );

        onChange(
            EditorState.push(editorState, nextContent, 'insert-characters'),
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

    render() {
        const { block, blockProps } = this.props;
        const {
            entity,
            entityKey,
            entityConfig,
            onEditEntity,
            onRemoveEntity,
        } = blockProps;
        const { alt, alignment } = entity.getData();
        const imageFormats = entityConfig.imageFormats || [];
        const { src } = entity.getData();

        return (
            <MediaBlock {...this.props} src={src} alt="">
                <div className="ImageBlock__options">
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
                    <div>
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
                    <button className="Tooltip__button" onClick={onEditEntity}>
                        Edit
                    </button>

                    <button
                        className="Tooltip__button"
                        onClick={onRemoveEntity}
                    >
                        Remove
                    </button>
                </div>
            </MediaBlock>
        );
    }
}

ImageBlock.propTypes = propTypes;

export default ImageBlock;
