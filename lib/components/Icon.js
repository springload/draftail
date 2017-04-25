import PropTypes from 'prop-types';
import React from 'react';

/**
 * Abstracts away the icon implementation.
 */
const Icon = ({ name, className, title }) => (
    <span className={`icon ${name} ${className}`} aria-hidden={!title}>
        {title ? (
            <span role="presentation">
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
