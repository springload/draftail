import React, { Component } from 'react';
import { Entity } from 'draft-js';

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
            active: false,
        };

        this.toggleBlock = this.toggleBlock.bind(this);
        this.closeBlock = this.toggleBlock.bind(this, false);
        this.onClick = this.onClick.bind(this);
        this.onSave = this.onSave.bind(this);
    }

    toggleBlock(active = !this.state.active) {
        const { blockProps } = this.props;

        this.setState({
            active: active,
        });

        if (active) {
            blockProps.lockEditor();
        } else {
            blockProps.unlockEditor();
        }
    }

    onClick() {
        this.toggleBlock();
    }

    onSave(nextData) {
        const { block } = this.props;

        // This will update in place
        Entity.mergeData(block.getEntityAt(0), nextData);
        this.closeBlock();
    }

    render() {
        const { blockProps } = this.props;
        const { active } = this.state;
        const Block = BLOCK_MAP[blockProps.entity.type] || NullBlock;

        return (
            <div className={`RichEditor-media${active ? ' RichEditor-media--open' : ''}`}>
                <Block
                    entity={blockProps.entity}
                    entityConfig={blockProps.entityConfig}
                    active={active}
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
    blockProps: React.PropTypes.object.isRequired,
};

export default MediaBlock;
