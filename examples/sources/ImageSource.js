import PropTypes from 'prop-types';
import React from 'react';
import { AtomicBlockUtils } from 'draft-js';

class ImageSource extends React.Component {
    componentDidMount() {
        const { editorState, options, onUpdate } = this.props;

        const url = window.prompt('Link URL');

        if (url) {
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity(
                options.type,
                'IMMUTABLE',
                {
                    alt: '',
                    alignment: 'left',
                    src: url,
                },
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const nextState = AtomicBlockUtils.insertAtomicBlock(
                editorState,
                entityKey,
                ' ',
            );

            onUpdate(nextState);
        } else {
            onUpdate(editorState);
        }
    }

    render() {
        return null;
    }
}

ImageSource.propTypes = {
    editorState: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default ImageSource;
