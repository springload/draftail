import React from 'react';
import { Entity } from 'draft-js';

import { ENTITY_TYPE } from '../api/constants';

import MediaBlock from '../blocks/MediaBlock';
import DividerBlock from '../blocks/DividerBlock';

/**
 * Editor block to display media and edit content.
 */
const AtomicBlock = (props) => {
    const { block } = props;
    const entity = Entity.get(block.getEntityAt(0));
    const Block = entity.getType() === ENTITY_TYPE.HORIZONTAL_RULE ? DividerBlock : MediaBlock;

    return (
        <Block {...props} />
    );
};

AtomicBlock.propTypes = {
    block: React.PropTypes.object.isRequired,
};

export default AtomicBlock;
