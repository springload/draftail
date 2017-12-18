import PropTypes from 'prop-types';
import React from 'react';

/**
 * A tooltip, with arbitrary content..
 */
const Tooltip = ({ position, children }) => (
    <div style={position} className="Tooltip" role="tooltip">
        {children}
    </div>
);

Tooltip.propTypes = {
    position: PropTypes.shape({
        top: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired,
    }).isRequired,
    children: PropTypes.node.isRequired,
};

export default Tooltip;
