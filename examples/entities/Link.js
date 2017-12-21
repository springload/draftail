import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Icon } from '../../lib';

import { truncateURL } from '../utils/format';

import Tooltip from '../components/Tooltip';
import Portal from '../components/Portal';

class Link extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTooltipAt: false,
        };

        this.openTooltip = this.openTooltip.bind(this);
        this.closeTooltip = this.closeTooltip.bind(this);
    }

    openTooltip(e) {
        const trigger = e.target;
        const rect = trigger.getBoundingClientRect();

        this.setState({
            showTooltipAt: rect,
        });
    }

    closeTooltip() {
        this.setState({ showTooltipAt: null });
    }

    render() {
        const {
            entityKey,
            contentState,
            children,
            onEdit,
            onRemove,
        } = this.props;
        const { showTooltipAt } = this.state;
        const { url } = contentState.getEntity(entityKey).getData();
        const icon = `#icon-${url.startsWith('mailto:') ? 'mail' : 'link'}`;

        return (
            <span onMouseUp={this.openTooltip} className="Link">
                <Icon icon={icon} />
                {children}
                {showTooltipAt && (
                    <Portal
                        onClose={this.closeTooltip}
                        closeOnClick
                        closeOnType
                        closeOnResize
                    >
                        <Tooltip target={showTooltipAt}>
                            {url ? (
                                <a
                                    href={url}
                                    title={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="Tooltip__link"
                                >
                                    {truncateURL(url)}
                                </a>
                            ) : null}

                            <button
                                className="Tooltip__button"
                                onClick={onEdit.bind(null, entityKey)}
                            >
                                Edit
                            </button>

                            <button
                                className="Tooltip__button"
                                onClick={onRemove.bind(null, entityKey)}
                            >
                                Remove
                            </button>
                        </Tooltip>
                    </Portal>
                )}
            </span>
        );
    }
}

Link.propTypes = {
    entityKey: PropTypes.string.isRequired,
    contentState: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
};

export default Link;
