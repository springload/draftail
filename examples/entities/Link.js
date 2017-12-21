import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Icon } from '../../lib';

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
        const label = url.replace(/(^\w+:|^)\/\//, '').split('/')[0];
        const icon = `#icon-${url.startsWith('mailto:') ? 'mail' : 'link'}`;

        return (
            <a
                role="button"
                tabIndex={-1}
                onMouseUp={this.openTooltip}
                className="Link"
            >
                <Icon icon={icon} />
                {children}
                {showTooltipAt && (
                    <Portal
                        onClose={this.closeTooltip}
                        closeOnClick
                        closeOnType
                        closeOnResize
                    >
                        <Tooltip target={showTooltipAt} direction="top">
                            {url ? (
                                <a
                                    href={url}
                                    title={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="Tooltip__link"
                                >
                                    {label}
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
            </a>
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
