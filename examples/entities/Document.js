import React from 'react';
import { ENTITY_TYPE, Icon } from '../../lib';

export function findDocumentEntities(contentBlock, callback, contentState) {
    contentBlock.findEntityRanges((character) => {
        const entityKey = character.getEntity();
        return (
            entityKey !== null &&
            contentState.getEntity(entityKey).getType() === ENTITY_TYPE.DOCUMENT
        );
    }, callback);
}

const Document = ({ entityKey, contentState, children }) => {
    const { title } = contentState.getEntity(entityKey).getData();
    return (
        <span data-tooltip={entityKey} className="RichEditor-link" title={title}>
            <Icon name="icon-doc-full" />
            {children}
        </span>
    );
};

Document.propTypes = {
    entityKey: React.PropTypes.string.isRequired,
    contentState: React.PropTypes.object.isRequired,
    children: React.PropTypes.node.isRequired,
};

export default Document;
