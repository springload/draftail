import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';

import { ENTITY_TYPE } from '../api/constants';

import ImageBlock from '../blocks/ImageBlock';
import EmbedBlock from '../blocks/EmbedBlock';
import NullBlock from '../blocks/NullBlock';

const BLOCK_MAP = {};

BLOCK_MAP[ENTITY_TYPE.IMAGE] = ImageBlock;
BLOCK_MAP[ENTITY_TYPE.EMBED] = EmbedBlock;

/**
 * Editor block to display media and edit content.
 */
class MediaBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isActive: false,
        };

        this.toggleBlock = this.toggleBlock.bind(this);
        this.closeBlock = this.toggleBlock.bind(this, false);
        this.onClick = this.onClick.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    toggleBlock(isActive = !this.state.isActive) {
        const { blockProps } = this.props;

        this.setState({
            isActive: isActive,
        });

        if (isActive) {
            blockProps.lockEditor();
        } else {
            blockProps.unlockEditor();
        }
    }

    onClick() {
        this.toggleBlock();
    }

    onSave(nextData) {
        const { block, blockProps, contentState } = this.props;
        const { editorState, onChange } = blockProps;

        let nextContentState = contentState.mergeEntityData(
            block.getEntityAt(0),
            nextData,
        );

        // TODO Remove in Draft.js 0.11.
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
        const { blockProps } = this.props;
        const { isActive } = this.state;
        const { entity } = blockProps;
        const Block = BLOCK_MAP[entity.getType()] || NullBlock;

        return (
            <div
                className={`RichEditor-media${
                    isActive ? ' RichEditor-media--open' : ''
                }`}
            >
                <Block
                    entity={blockProps.entity}
                    entityConfig={blockProps.entityConfig}
                    isActive={isActive}
                    onClick={this.onClick}
                    onCancel={this.closeBlock}
                    onSave={this.onSave}
                />
            </div>
        );
    }
}

MediaBlock.propTypes = {
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

export default MediaBlock;
