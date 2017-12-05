import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { ICONS, ENTITY_TYPE } from '../api/constants';

import Icon from '../components/Icon';

/**
 * Editor block to preview and edit images.
 */
class ImageBlock extends Component {
    constructor(props) {
        super(props);

        this.changeText = this.changeText.bind(this);
        this.changeAlignment = this.changeAlignment.bind(this);
        this.renderMediaOptions = this.renderMediaOptions.bind(this);
    }

    changeText(e) {
        const { onSave } = this.props;

        onSave({
            alt: e.currentTarget.value,
        });
    }

    changeAlignment(e) {
        const { onSave } = this.props;

        onSave({
            alignment: e.currentTarget.value,
        });
    }

    renderMediaOptions() {
        const { entity, entityConfig } = this.props;
        const { alt, alignment } = entity.getData();
        const imageFormats = entityConfig.imageFormats || [];

        return (
            <div className="RichEditor-media-options">
                <div className="RichEditor-grid">
                    <div className="RichEditor-col">
                        <label className="u-block">
                            <h4>Alt text</h4>
                            <p>
                                <input
                                    type="text"
                                    value={alt || ''}
                                    onChange={this.changeText}
                                />
                            </p>
                        </label>
                    </div>
                    <div className="RichEditor-col">
                        <h4>Image alignment</h4>
                        <p>
                            {imageFormats.map(format => {
                                return (
                                    <label key={format.value}>
                                        <input
                                            type="radio"
                                            value={format.value}
                                            onChange={this.changeAlignment}
                                            checked={format.value === alignment}
                                        />
                                        {format.label}
                                    </label>
                                );
                            })}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { entity, isActive, onClick } = this.props;
        const { src, alt } = entity.getData();

        /* eslint-disable springload/jsx-a11y/no-static-element-interactions */
        return (
            <div>
                <Icon
                    icon={ICONS[ENTITY_TYPE.IMAGE]}
                    className="RichEditor-media-icon"
                />

                <div onClick={onClick} className="RichEditor-media-container">
                    <span className="RichEditor-media-preview">
                        <img src={src} alt={alt || ''} />
                    </span>
                </div>

                {isActive ? this.renderMediaOptions() : null}
            </div>
        );
    }
}

ImageBlock.propTypes = {
    entityConfig: PropTypes.object.isRequired,
    entity: PropTypes.object.isRequired,
    isActive: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
};

export default ImageBlock;
