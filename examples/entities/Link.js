import PropTypes from 'prop-types';
import React from 'react';

import TooltipEntity from '../entities/TooltipEntity';

const Link = props => {
    const { entityKey, contentState } = props;
    const { url } = contentState.getEntity(entityKey).getData();
    const icon = `#icon-${url.startsWith('mailto:') ? 'mail' : 'link'}`;
    return (
        <TooltipEntity
            {...props}
            icon={icon}
            label={url.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
        />
    );
};

Link.propTypes = {
    entityKey: PropTypes.string.isRequired,
    contentState: PropTypes.object.isRequired,
};

export default Link;
