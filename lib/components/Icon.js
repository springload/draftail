import React, { PropTypes } from 'react';

/**
 * Abstracts away the icon implementation.
 * TODO Replace with https://github.com/springload/wagtail/tree/feature/react-explorer/client/src/components/icon
 */
const Icon = ({ name, className, title }) => (
    <span className={`RichEditor-media-icon icon icon-${name} ${className}`} aria-hidden={!title}>
        {title ? (
            <span aria-role="presentation">
                {title}
            </span>
        ) : null}
    </span>
);

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    className: PropTypes.string,
    title: PropTypes.string,
};

Icon.defaultProps = {
    className: '',
    title: null,
};

export default Icon;
