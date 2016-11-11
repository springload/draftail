import React from 'react';

import Icon from '../components/Icon';

/**
 * Editor block to preview and edit embedded content.
 */
const EmbedBlock = ({ entity, active, onClick }) => {
    const { url, title, providerName, authorName, thumbnail } = entity.getData();

    return (
        <div>
            <Icon name="media" />

            <div className="RichEditor-media-container" onClick={onClick}>
                <span className="RichEditor-media-preview">
                    <img src={thumbnail} alt={title} />
                </span>
            </div>

            {active ? (
                <div className="RichEditor-media-options">
                    <h3><strong>{title}</strong></h3>
                    <p>
                        <span>URL: <a href={url} target="_blank" rel="noopener">{url}</a></span>
                        <br />
                        <span>Provider: {providerName}</span>
                        <br />
                        <span>Author: {authorName}</span>
                    </p>
                </div>
            ) : null}
        </div>
    );
};

EmbedBlock.propTypes = {
    entity: React.PropTypes.object.isRequired,
    active: React.PropTypes.bool.isRequired,
    onClick: React.PropTypes.func.isRequired,
};

export default EmbedBlock;
