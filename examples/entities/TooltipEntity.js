import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Icon } from '../../lib';

import Tooltip from '../components/Tooltip';
import Portal from '../components/Portal';

class TooltipEntity extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTooltipAt: null,
        };

        this.openTooltip = this.openTooltip.bind(this);
        this.closeTooltip = this.closeTooltip.bind(this);
    }

    openTooltip(e) {
        const trigger = e.target;
        this.setState({ showTooltipAt: trigger.getBoundingClientRect() });
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
            icon,
            label,
        } = this.props;
        const { showTooltipAt } = this.state;
        const { url } = contentState.getEntity(entityKey).getData();

        // Contrary to what JSX A11Y says, this should be a button but it shouldn't be focusable.
        /* eslint-disable springload/jsx-a11y/interactive-supports-focus */
        return (
            <a
                role="button"
                onMouseUp={this.openTooltip}
                className="TooltipEntity"
            >
                <Icon icon={icon} className="TooltipEntity__icon" />
                {children}
                {showTooltipAt && (
                    <Portal
                        onClose={this.closeTooltip}
                        closeOnClick
                        closeOnType
                        closeOnResize
                    >
                        <Tooltip target={showTooltipAt} direction="top">
                            <a
                                href={url}
                                title={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="Tooltip__link"
                            >
                                {label}
                            </a>

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

TooltipEntity.propTypes = {
    entityKey: PropTypes.string.isRequired,
    contentState: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    onEdit: PropTypes.func.isRequired,
    onRemove: PropTypes.func.isRequired,
    icon: PropTypes.oneOfType([
        PropTypes.string.isRequired,
        PropTypes.object.isRequired,
    ]).isRequired,
    label: PropTypes.string.isRequired,
};

export default TooltipEntity;
