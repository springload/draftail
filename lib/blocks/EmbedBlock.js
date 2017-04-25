import PropTypes from 'prop-types';
import React from 'react';

import { NBSP } from '../api/constants';

import Icon from '../components/Icon';

/**
 * Editor block to preview and edit embedded content.
 */
const EmbedBlock = ({ entity, isActive, onClick }) => {
    const { url, title, providerName, authorName, thumbnail } = entity.getData();

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
        <div>
            <Icon name="icon-media" className="RichEditor-media-icon" />

            <div className="RichEditor-media-container" onClick={onClick}>
                <span className="RichEditor-media-preview">
                    <img src={thumbnail} alt={title} />
                </span>
            </div>

            {isActive ? (
                <div className="RichEditor-media-options">
                    <h3><strong>{title}</strong></h3>
                    <p>
                        <span>URL:{NBSP}<a href={url} target="_blank" rel="noopener noreferrer">{url}</a></span>
                        <br />
                        <span>Provider:{NBSP}</span>{providerName}
                        <br />
                        <span>Author:{NBSP}</span>{authorName}
                    </p>
                </div>
            ) : null}
        </div>
    );
};

EmbedBlock.propTypes = {
    entity: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default EmbedBlock;
