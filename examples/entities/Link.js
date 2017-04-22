import PropTypes from 'prop-types';
import React from 'react';
import { ENTITY_TYPE, Icon } from '../../lib';

export function findLinkEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();

        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === ENTITY_TYPE.LINK
        );
    }, callback);
}

const Link = ({ entityKey, contentState, children }) => {
    const { url } = contentState.getEntity(entityKey).getData();

    return (
        <span data-tooltip={entityKey} className="RichEditor-link">
            <Icon name={`icon-${url.indexOf('mailto:') !== -1 ? 'mail' : 'link'}`} />
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
