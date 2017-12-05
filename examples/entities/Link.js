import PropTypes from 'prop-types';
import React from 'react';
import { Icon, ICONS, ENTITY_TYPE } from '../../lib';

const ICON_MAIL =
    'M928 128h-832c-52.8 0-96 43.2-96 96v640c0 52.8 43.2 96 96 96h832c52.8 0 96-43.2 96-96v-640c0-52.8-43.2-96-96-96zM398.74 550.372l-270.74 210.892v-501.642l270.74 290.75zM176.38 256h671.24l-335.62 252-335.62-252zM409.288 561.698l102.712 110.302 102.71-110.302 210.554 270.302h-626.528l210.552-270.302zM625.26 550.372l270.74-290.75v501.642l-270.74-210.892z';

const Link = ({ entityKey, contentState, children }) => {
    const { url } = contentState.getEntity(entityKey).getData();

    return (
        <span data-tooltip={entityKey} className="RichEditor-link">
            <Icon
                icon={
                    url.startsWith('mailto:')
                        ? ICON_MAIL
                        : ICONS[ENTITY_TYPE.LINK]
                }
            />
            {children}
        </span>
    );
};

Link.propTypes = {
    entityKey: PropTypes.string.isRequired,
    contentState: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
};

export default Link;
