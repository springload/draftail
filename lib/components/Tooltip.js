import React from 'react';

import { truncateURL } from '../utils/format';

/**
 * A tooltip displayed within the editor.
 * Contains buttons and info related to the entity it points at.
 */
const Tooltip = ({ position, entityData, onEdit, onRemove }) => (
    <div
        style={{ top: position.top, left: position.left }}
        className="RichEditor-tooltip"
        role="tooltip"
    >
        {entityData.url ? (
            <a
                href={entityData.url}
                target="_blank"
                rel="noopener noreferrer"
                className="RichEditor-tooltip__link"
            >
                {truncateURL(entityData.url)}
            </a>
        ) : null}

        {entityData.label ? (
            <span className="RichEditor-tooltip__text">
                {truncateURL(entityData.label)}
            </span>
        ) : null}

        <button className="RichEditor-tooltip__button" onClick={onEdit}>
            Edit
        </button>

        <button className="RichEditor-tooltip__button" onClick={onRemove}>
            Remove
        </button>
    </div>
);

Tooltip.propTypes = {
    position: React.PropTypes.shape({
        top: React.PropTypes.number.isRequired,
        left: React.PropTypes.number.isRequired,
    }).isRequired,
    entityData: React.PropTypes.object.isRequired,
    onEdit: React.PropTypes.func.isRequired,
    onRemove: React.PropTypes.func.isRequired,
};

export default Tooltip;
