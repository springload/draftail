import React from 'react';
import { AtomicBlockUtils, Entity } from 'draft-js';

class BasicImageSource extends React.Component {
    componentDidMount() {
        const { editorState, entityType, onUpdate } = this.props;

        const url = global.prompt('Link URL');

        if (url) {
            const entityKey = Entity.create(entityType, 'IMMUTABLE', {
                altText: 'Test image alt text',
                alignment: 'left',
                src: 'https://placekitten.com/g/400/200',
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

BasicImageSource.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    entityType: React.PropTypes.string.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
};

export default BasicImageSource;
