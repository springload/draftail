import React from 'react';
import { Entity, RichUtils } from 'draft-js';

class BasicDocumentSource extends React.Component {
    componentDidMount() {
        const { editorState, entity, options, onUpdate } = this.props;
        const url = global.prompt('Document URL', entity ? entity.getData().url : '');

        if (url) {
            const entityKey = Entity.create(options.type, 'MUTABLE', {
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
    options: React.PropTypes.object.isRequired,
    entity: React.PropTypes.object,
    onUpdate: React.PropTypes.func.isRequired,
};

BasicDocumentSource.defaultProps = {
    entity: null,
};

export default BasicDocumentSource;
