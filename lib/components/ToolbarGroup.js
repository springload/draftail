import PropTypes from 'prop-types';
import React from 'react';

const ToolbarGroup = ({ children }) => {
    const hasChildren = React.Children.toArray(children).some(c => c !== null);
    return hasChildren ? (
        <div className="Draftail-ToolbarGroup">{children}</div>
    ) : null;
};

ToolbarGroup.propTypes = {
    children: PropTypes.node,
};

ToolbarGroup.defaultProps = {
    children: null,
};

export default ToolbarGroup;
