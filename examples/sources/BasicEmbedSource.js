import React from 'react';
import { AtomicBlockUtils, Entity } from 'draft-js';

class BasicEmbedSource extends React.Component {
    componentDidMount() {
        const { editorState, entityType, onUpdate } = this.props;

        const url = global.prompt('Link URL');

        if (url) {
            const entityKey = Entity.create(entityType, 'IMMUTABLE', {
                url: url,
                title: 'Test embed',
                providerName: 'YouTube',
                authorName: 'Test author',
                thumbnail: 'https://placekitten.com/g/480/480',
            });
            const nextState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');

            onUpdate(nextState);
        } else {
            onUpdate(editorState);
        }
    }

    render() {
        return null;
    }
}

BasicEmbedSource.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    entityType: React.PropTypes.string.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
};

export default BasicEmbedSource;
