import React from 'react';
import { AtomicBlockUtils } from 'draft-js';

class BasicEmbedSource extends React.Component {
    componentDidMount() {
        const { editorState, options, onUpdate } = this.props;

        const url = global.prompt('Link URL');

        if (url) {
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity(options.type, 'IMMUTABLE', {
                url: url,
                title: 'Test embed',
                providerName: 'YouTube',
                authorName: 'Test author',
                thumbnail: 'https://placekitten.com/g/480/480',
            });
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
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
    options: React.PropTypes.object.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
};

export default BasicEmbedSource;
