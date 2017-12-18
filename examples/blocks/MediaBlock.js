import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';

import { Icon, Portal, Tooltip } from '../../lib';

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
        };

        this.openTooltip = this.openTooltip.bind(this);
        this.closeTooltip = this.closeTooltip.bind(this);
        this.renderTooltip = this.renderTooltip.bind(this);
    }

    openTooltip(e) {
        const trigger = e.target;
        const pos = trigger.getBoundingClientRect();

        this.setState({
            showTooltipAt: {
                top: window.pageYOffset + pos.top + trigger.offsetHeight,
                left: window.pageXOffset + pos.left + trigger.offsetWidth / 2,
            },
        });
    }

    closeTooltip() {
        this.setState({ showTooltipAt: null });
    }

    renderTooltip() {
        const { children } = this.props;
        const { showTooltipAt } = this.state;

        return (
            <Portal clickOutsideClose={this.closeTooltip}>
                <Tooltip position={showTooltipAt}>{children}</Tooltip>
            </Portal>
        );
    }

    render() {
        const { block, blockProps, src, alt } = this.props;
        const { showTooltipAt } = this.state;
        const { entity, entityKey, entityConfig } = blockProps;

        return (
            <div className="MediaBlock" onMouseUp={this.openTooltip}>
                <span className="MediaBlock__icon">
                    <Icon icon={entityConfig.icon} />
                </span>

                <img src={src} alt={alt} />

                {showTooltipAt && this.renderTooltip()}
            </div>
        );
    }
}

MediaBlock.propTypes = propTypes;

export default MediaBlock;
