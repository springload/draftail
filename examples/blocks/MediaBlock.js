import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { Icon } from '../../lib';

import Tooltip from '../components/Tooltip';
import Portal from '../components/Portal';

// Constraints the maximum size of the tooltip.
const OPTIONS_MAX_WIDTH = 300;
const OPTIONS_SPACING = 70;
const TOOLTIP_MAX_WIDTH = OPTIONS_MAX_WIDTH + OPTIONS_SPACING;

const propTypes = {
    blockProps: PropTypes.shape({
        entity: PropTypes.object,
        entityType: PropTypes.object.isRequired,
    }).isRequired,
    src: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

/**
 * Editor block to preview and edit images.
 */
class MediaBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTooltipAt: null,
        };

        this.openTooltip = this.openTooltip.bind(this);
        this.closeTooltip = this.closeTooltip.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
    }

    openTooltip(e) {
        const trigger = e.target;

        this.setState({
            showTooltipAt: Object.assign(trigger.getBoundingClientRect(), {
                containerWidth: trigger.parentNode.offsetWidth,
            }),
        });
    }

    closeTooltip() {
        this.setState({ showTooltipAt: null });
    }

    renderTooltip() {
        const { children } = this.props;
        const { showTooltipAt } = this.state;
        const maxWidth = showTooltipAt.containerWidth - showTooltipAt.width;
        const direction = maxWidth >= TOOLTIP_MAX_WIDTH ? 'left' : 'top-left';

        return (
            <Portal
                onClose={this.closeTooltip}
                closeOnClick
                closeOnType
                closeOnResize
            >
                <Tooltip target={showTooltipAt} direction={direction}>
                    <div style={{ maxWidth: OPTIONS_MAX_WIDTH }}>
                        {children}
                    </div>
                </Tooltip>
            </Portal>
        );
    }

    render() {
        const { blockProps, src, label } = this.props;
        const { showTooltipAt } = this.state;
        const { entityType } = blockProps;

        return (
            <button
                type="button"
                tabIndex={-1}
                className="MediaBlock"
                aria-label={`${entityType.description}${
                    label ? ': ' : ''
                }${label}`}
                onMouseUp={this.openTooltip}
            >
                <span className="MediaBlock__icon-wrapper" aria-hidden>
                    <Icon icon={entityType.icon} className="MediaBlock__icon" />
                </span>

                <img className="MediaBlock__img" src={src} alt="" width="256" />

                {showTooltipAt && this.renderTooltip()}
            </button>
        );
    }
}

MediaBlock.propTypes = propTypes;

export default MediaBlock;
