import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '../../lib';

const Link = ({ entityKey, contentState, children }) => {
    const { url } = contentState.getEntity(entityKey).getData();
    const icon = `#icon-${url.startsWith('mailto:') ? 'mail' : 'link'}`;

    return (
        <span data-tooltip={entityKey} className="Link">
            <Icon icon={icon} />
            {children}
        </span>
    );
};

Link.propTypes = {
    entityKey: PropTypes.string.isRequired,
    contentState: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
};

export default Link;
