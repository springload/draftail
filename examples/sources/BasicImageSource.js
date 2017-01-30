import React from 'react';
import { AtomicBlockUtils } from 'draft-js';

class BasicImageSource extends React.Component {
    componentDidMount() {
        const { editorState, options, onUpdate } = this.props;

        const url = global.prompt('Link URL');

        if (url) {
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity(options.type, 'IMMUTABLE', {
                altText: 'Test image alt text',
                alignment: 'left',
                src: 'https://placekitten.com/g/400/200',
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

BasicImageSource.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    options: React.PropTypes.object.isRequired,
    onUpdate: React.PropTypes.func.isRequired,
};

export default BasicImageSource;
