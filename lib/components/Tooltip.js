import PropTypes from 'prop-types';
import React from 'react';

import { truncateURL } from '../utils/format';

/**
 * A tooltip displayed within the editor.
 * Contains buttons and info related to the entity it points at.
 */
const Tooltip = ({ position, entityData, onEdit, onRemove }) => (
    <div
        style={{ top: position.top, left: position.left }}
        className="Tooltip"
        role="tooltip"
    >
        {entityData.url ? (
            <a
                href={entityData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="Tooltip__link"
            >
                {truncateURL(entityData.url)}
            </a>
        ) : null}

        <button className="Tooltip__button" onClick={onEdit}>
            Edit
        </button>

        <button className="Tooltip__button" onClick={onRemove}>
            Remove
        </button>
    </div>
);

Tooltip.propTypes = {
    position: PropTypes.shape({
        top: PropTypes.number.isRequired,
        left: PropTypes.number.isRequired,
    }).isRequired,
    entityData: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default Tooltip;
