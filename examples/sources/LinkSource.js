import PropTypes from 'prop-types';
import React from 'react';
import { RichUtils } from 'draft-js';

class LinkSource extends React.Component {
    componentDidMount() {
        const { editorState, entity, options, onUpdate } = this.props;
        const url = window.prompt(
            'Link URL',
            entity ? entity.getData().url : '',
        );

        if (url) {
            const contentState = editorState.getCurrentContent();
            const contentStateWithEntity = contentState.createEntity(
                options.type,
                'MUTABLE',
                {
                    url: url,
                },
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const nextState = RichUtils.toggleLink(
                editorState,
                editorState.getSelection(),
                entityKey,
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

LinkSource.propTypes = {
    editorState: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    entity: PropTypes.object,
    onUpdate: PropTypes.func.isRequired,
};

LinkSource.defaultProps = {
    entity: null,
};

export default LinkSource;
