import PropTypes from 'prop-types';
import React from 'react';

import { DOCUMENT_ICON } from '../constants/ui';

import TooltipEntity from '../entities/TooltipEntity';

const Document = props => {
    const { entityKey, contentState } = props;
    const { url } = contentState.getEntity(entityKey).getData();
    return (
        <TooltipEntity
            {...props}
            icon={DOCUMENT_ICON}
            label={url.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
        />
    );
};

Document.propTypes = {
    entityKey: PropTypes.string.isRequired,
    contentState: PropTypes.object.isRequired,
};

export default Document;
