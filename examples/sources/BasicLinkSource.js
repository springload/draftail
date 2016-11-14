import React from 'react';
import { Entity, RichUtils } from 'draft-js';

class BasicLinkSource extends React.Component {
    componentDidMount() {
        const { editorState, entityType, onUpdate } = this.props;
        const entityKey = Entity.create(entityType, 'MUTABLE', {
            url: global.prompt('Link URL'),
        });
        const nextState = RichUtils.toggleLink(editorState, editorState.getSelection(), entityKey);

        onUpdate(nextState);
    }

    render() {
        return null;
    }
}

BasicLinkSource.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    entityType: React.PropTypes.string.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
};

export default BasicLinkSource;

// Embed
// Image
// Link

// this.onConfirmAtomicBlock({
//             embedType: embed.getAttribute('data-embedtype'),
//             url: embed.getAttribute('data-url'),
//             providerName: embed.getAttribute('data-provider-name'),
//             authorName: embed.getAttribute('data-author-name'),
//             thumbnail: embed.getAttribute('data-thumbnail-url'),
//             title: embed.getAttribute('data-title'),
//         });

// src
// this.state = {
//     altText: altText || '',
//     alignment: alignment || 'left',
// };
