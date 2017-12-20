import PropTypes from 'prop-types';
import React from 'react';

import { truncateURL } from '../utils/format';

import Tooltip from '../components/Tooltip';

/**
 * A tooltip displayed within the editor.
 * Contains buttons and info related to the entity it points at.
 */
const InlineTooltip = ({ target, entityData, onEdit, onRemove }) => (
    <Tooltip target={target} direction="top">
        {entityData.url ? (
            <a
                href={entityData.url}
                title={entityData.url}
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
    </Tooltip>
);

InlineTooltip.propTypes = {
    target: PropTypes.object.isRequired,
    entityData: PropTypes.object.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default InlineTooltip;
