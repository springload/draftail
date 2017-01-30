import React, { Component } from 'react';

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
        const { block, contentState } = this.props;

        // This will update in place
        contentState.mergeEntityData(block.getEntityAt(0), nextData);
        this.closeBlock();
    }

    render() {
        const { blockProps } = this.props;
        const { isActive } = this.state;
        const Block = BLOCK_MAP[blockProps.entity.type] || NullBlock;

        return (
            <div className={`RichEditor-media${isActive ? ' RichEditor-media--open' : ''}`}>
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
    block: React.PropTypes.object.isRequired,
    contentState: React.PropTypes.object.isRequired,
    blockProps: React.PropTypes.object.isRequired,
};

export default MediaBlock;
