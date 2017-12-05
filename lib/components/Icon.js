import PropTypes from 'prop-types';
import React from 'react';

// The icon definition is very flexible.
export const iconPropType = PropTypes.oneOfType([
    // String icon = SVG path (d attribute).
    PropTypes.string,
    // List of SVG paths.
    PropTypes.arrayOf(PropTypes.string),
    // Arbitrary React element.
    PropTypes.node,
]);

const propTypes = {
    icon: iconPropType.isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
};

const defaultProps = {
    title: null,
    className: null,
};

/**
 * Icon as SVG element. Can optionally render a React element instead.
 */
const Icon = ({ icon, title, className }) => {
    const isPathOrRef = typeof icon === 'string';
    const isPathArray = Array.isArray(icon);
    let children;

    if (isPathOrRef) {
        if (icon.startsWith('#')) {
            children = <use xlinkHref={icon} />;
        } else {
            children = <path d={icon} />;
        }
    } else if (isPathArray) {
        // eslint-disable-next-line springload/react/no-array-index-key
        children = icon.map((d, i) => <path key={i} d={d} />);
    } else {
        return icon;
    }

    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 1024 1024"
            className={`icon ${className || ''}`}
            aria-hidden={title ? null : true}
            role={title ? 'img' : null}
            aria-label={title || null}
        >
            {children}
        </svg>
    );
};

Icon.propTypes = propTypes;

Icon.defaultProps = defaultProps;

export default Icon;
