import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';

import { Icon } from '../../lib';

import Tooltip from '../components/Tooltip';
import Portal from '../components/Portal';

// Defined in both CSS and JS to constraint the maximum size of the tooltip.
const OPTIONS_MAX_WIDTH = 300;
const OPTIONS_SPACING = 70;
const TOOLTIP_MAX_WIDTH = OPTIONS_MAX_WIDTH + OPTIONS_SPACING;

const propTypes = {
    block: PropTypes.object.isRequired,
    contentState: PropTypes.object.isRequired,
    blockProps: PropTypes.shape({
        editorState: PropTypes.instanceOf(EditorState).isRequired,
        entity: PropTypes.object,
        entityConfig: PropTypes.object.isRequired,
        lockEditor: PropTypes.func.isRequired,
        unlockEditor: PropTypes.func.isRequired,
        onChange: PropTypes.func.isRequired,
    }).isRequired,
};

/**
 * Editor block to preview and edit images.
 */
class MediaBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTooltipAt: null,
            direction: null,
        };

        this.openTooltip = this.openTooltip.bind(this);
        this.closeTooltip = this.closeTooltip.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
    }

    openTooltip(e) {
        const { direction } = this.props;
        const trigger = e.target;
        const rect = trigger.getBoundingClientRect();

        const editor = trigger.closest('[contenteditable="true"]').parentNode;
        const tooltipMaxWidth = editor.offsetWidth - rect.width;
        const tooltipDirection =
            tooltipMaxWidth >= TOOLTIP_MAX_WIDTH ? direction : 'top-left';

        this.setState({
            showTooltipAt: rect,
            direction: tooltipDirection,
        });
    }

    closeTooltip() {
        this.setState({ showTooltipAt: null, direction: null });
    }

    renderTooltip() {
        const { children } = this.props;
        const { showTooltipAt, direction } = this.state;

        return (
            <Portal
                onClose={this.closeTooltip}
                closeOnClick
                closeOnType
                closeOnResize
            >
                <Tooltip target={showTooltipAt} direction={direction}>
                    <div className="MediaBlock__options">{children}</div>
                </Tooltip>
            </Portal>
        );
    }

    render() {
        const { block, blockProps, src, alt } = this.props;
        const { showTooltipAt } = this.state;
        const { entity, entityKey, entityConfig } = blockProps;

        return (
            <div className="MediaBlock" onMouseUp={this.openTooltip}>
                <span className="MediaBlock__icon" aria-hidden>
                    <Icon icon={entityConfig.icon} />
                </span>

                <img src={src} alt={alt} width="256" />

                {showTooltipAt && this.renderTooltip()}
            </div>
        );
    }
}

MediaBlock.propTypes = propTypes;

export default MediaBlock;
