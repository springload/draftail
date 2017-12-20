import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '../../lib';
import { DOCUMENT_ICON } from '../constants/ui';

const Document = ({ entityKey, children }) => {
    return (
        <span data-tooltip={entityKey} className="Document">
            <Icon icon={DOCUMENT_ICON} />
            {children}
        </span>
    );
};

Document.propTypes = {
    entityKey: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

export default Document;
