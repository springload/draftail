import PropTypes from 'prop-types';
import React from 'react';

import MediaBlock from '../blocks/MediaBlock';

const propTypes = {
    blockProps: PropTypes.shape({
        entity: PropTypes.object,
    }).isRequired,
};

/**
 * Editor block to display media and edit content.
 */
const EmbedBlock = props => {
    const { entity, onEditEntity, onRemoveEntity } = props.blockProps;
    const { url, title, thumbnail } = entity.getData();

    return (
        <MediaBlock {...props} src={thumbnail} label={title}>
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
};

EmbedBlock.propTypes = propTypes;

export default EmbedBlock;
