import React from 'react';
import { Entity } from 'draft-js';
import { ENTITY_TYPE, Icon } from '../../lib';

export function findDocumentEntities(contentBlock, callback) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            Entity.get(entityKey).getType() === ENTITY_TYPE.DOCUMENT
        );
    }, callback);
}

const Document = ({ entityKey, children }) => {
    const { title } = Entity.get(entityKey).getData();
    return (
        <span data-tooltip={entityKey} className="RichEditor-link" title={title}>
            <Icon name="icon-doc-full" />
            {children}
        </span>
    );
};

Document.propTypes = {
    entityKey: React.PropTypes.string.isRequired,
    children: React.PropTypes.node.isRequired,
};

export default Document;
