import React from 'react';
import { Entity, RichUtils } from 'draft-js';

class BasicDocumentSource extends React.Component {
    componentDidMount() {
        const { editorState, entityType, onUpdate } = this.props;
        const url = global.prompt('Document URL');

        if (url) {
            const entityKey = Entity.create(entityType, 'MUTABLE', {
                url: url,
                title: 'Kritik der reinen Vernunft',
            });
            const nextState = RichUtils.toggleLink(editorState, editorState.getSelection(), entityKey);

            onUpdate(nextState);
        } else {
            onUpdate(editorState);
        }
    }

    render() {
        return null;
    }
}

BasicDocumentSource.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    entityType: React.PropTypes.string.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
};

export default BasicDocumentSource;
