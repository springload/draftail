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
 * Editor block to display media and edit content.
 */
class EmbedBlock extends Component {
    constructor(props) {
        super(props);

        this.onSave = this.onSave.bind(this);
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

    render() {
        const { block, blockProps } = this.props;
        const {
            entity,
            entityKey,
            entityConfig,
            onEditEntity,
            onRemoveEntity,
        } = blockProps;
        const { url, title, thumbnail } = entity.getData();

        return (
            <MediaBlock
                {...this.props}
                src={thumbnail}
                alt={`Embed: ${title}`}
                direction="left"
            >
                <a
                    className="EmbedBlock__link"
                    href={url}
                    title={url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {title}
                </a>

                <button className="Tooltip__button" onClick={onEditEntity}>
                    Edit
                </button>

                <button className="Tooltip__button" onClick={onRemoveEntity}>
                    Remove
                </button>
            </MediaBlock>
        );
    }
}

EmbedBlock.propTypes = propTypes;

export default EmbedBlock;
