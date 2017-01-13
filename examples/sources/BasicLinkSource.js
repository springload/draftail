import React from 'react';
import { Entity, RichUtils } from 'draft-js';

class BasicLinkSource extends React.Component {
    componentDidMount() {
        const { editorState, entity, entityType, onUpdate } = this.props;
        const url = global.prompt('Link URL', entity ? entity.getData().url : '');

        if (url) {
            const entityKey = Entity.create(entityType, 'MUTABLE', {
                url: url,
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

BasicLinkSource.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    entity: React.PropTypes.object,
    entityType: React.PropTypes.string.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
};

BasicLinkSource.defaultProps = {
    entity: null,
};

export default BasicLinkSource;
