import PropTypes from 'prop-types';
import React from 'react';

/**
 * Icon as SVG element. Can optionally render a React element instead.
 */
const Icon = ({ icon, title, className }) => {
    const isPathOrRef = typeof icon === 'string';
    const isPathArray = Array.isArray(icon);
    let children;

    if (isPathOrRef) {
        if (icon.includes('#')) {
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
            className={`Draftail-Icon ${className || ''}`}
            aria-hidden={title ? null : true}
            role={title ? 'img' : null}
            aria-label={title || null}
        >
            {children}
        </svg>
    );
};

Icon.propTypes = {
    // The icon definition is very flexible.
    icon: PropTypes.oneOfType([
        // String icon = SVG path or symbol reference.
        PropTypes.string,
        // List of SVG paths.
        PropTypes.arrayOf(PropTypes.string),
        // Arbitrary React element.
        PropTypes.node,
    ]).isRequired,
    title: PropTypes.string,
    className: PropTypes.string,
};

Icon.defaultProps = {
    title: null,
    className: null,
};

export default Icon;
