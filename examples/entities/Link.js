import React from 'react';
import { Entity } from 'draft-js';

export const LINK = 'LINK';

export function findLinkEntities(contentBlock, callback) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            Entity.get(entityKey).getType() === LINK
        );
    }, callback);
}

const Link = ({ entityKey, children }) => {
    const { url } = Entity.get(entityKey).getData();
    return (
        <span data-tooltip={url} className={`RichEditor-link icon icon-${url.indexOf('mailto:') !== -1 ? 'mail' : 'link'}`}>
            {children}
        </span>
    );
};

Link.propTypes = {
    entityKey: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired,
};

export default Link;
