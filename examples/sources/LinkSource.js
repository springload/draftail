import PropTypes from 'prop-types';
import React from 'react';
import { RichUtils } from 'draft-js';
import { DraftUtils } from '../../lib';

class LinkSource extends React.Component {
    componentDidMount() {
        const { editorState, entity, options, onUpdate } = this.props;
        const url = window.prompt(
            'Link URL',
            entity ? entity.getData().url : '',
        );
        let nextState = editorState;

        if (url) {
            const selection = editorState.getSelection();
            const entityData = {
                url: url,
            };

            const hasText = !selection.isCollapsed();

            if (hasText) {
                const contentState = editorState.getCurrentContent();
                const contentStateWithEntity = contentState.createEntity(
                    options.type,
                    'MUTABLE',
                    entityData,
                );

                const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                nextState = RichUtils.toggleLink(
                    editorState,
                    selection,
                    entityKey,
                );
            } else {
                nextState = DraftUtils.createEntity(
                    editorState,
                    options.type,
                    entityData,
                    url,
                    'MUTABLE',
                );
            }
        }

        onUpdate(nextState);
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
