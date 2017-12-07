import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '../../lib';
import { DOCUMENT_ICON } from '../constants/ui';

const Document = ({ entityKey, contentState, children }) => {
    const { title } = contentState.getEntity(entityKey).getData();
    return (
        <span
            data-tooltip={entityKey}
            className="RichEditor-link"
            title={title}
        >
            <Icon icon={DOCUMENT_ICON} />
            {children}
        </span>
    );
};

Document.propTypes = {
    entityKey: PropTypes.string.isRequired,
    contentState: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
};

export default Document;
