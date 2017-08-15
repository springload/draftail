import PropTypes from 'prop-types';
import React from 'react';
import { AtomicBlockUtils } from 'draft-js';

/* global EMBEDLY_API_KEY */
const EMBEDLY_ENDPOINT = `https://api.embedly.com/1/oembed?key=${EMBEDLY_API_KEY}`;

const getJSON = (endpoint, data, successCallback) => {
    const request = new XMLHttpRequest();
    request.open('GET', endpoint, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
            successCallback(JSON.parse(request.responseText));
        }
    };
    request.send(data);
};

class EmbedSource extends React.Component {
    componentDidMount() {
        const { editorState, options, onUpdate } = this.props;

        const url = window.prompt('Link URL');

        if (url) {
            getJSON(
                `${EMBEDLY_ENDPOINT}&url=${encodeURIComponent(url)}`,
                null,
                embed => {
                    const contentState = editorState.getCurrentContent();
                    const contentStateWithEntity = contentState.createEntity(
                        options.type,
                        'IMMUTABLE',
                        {
                            url: embed.url,
                            title: embed.title,
                            providerName: embed.provider_name,
                            authorName: embed.author_name,
                            thumbnail: embed.thumbnail_url,
                        },
                    );
                    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
                    const nextState = AtomicBlockUtils.insertAtomicBlock(
                        editorState,
                        entityKey,
                        ' ',
                    );

                    onUpdate(nextState);
                },
            );
        } else {
            onUpdate(editorState);
        }
    }

    render() {
        return null;
    }
}

EmbedSource.propTypes = {
    editorState: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    onUpdate: PropTypes.func.isRequired,
};

export default EmbedSource;
