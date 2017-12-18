import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';

import { Icon, Portal } from '../../lib';

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
class ImageBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTooltipAt: null,
        };

        this.onSave = this.onSave.bind(this);
        this.changeText = this.changeText.bind(this);
        this.changeAlignment = this.changeAlignment.bind(this);
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

    onSave(nextData) {
        const { block, blockProps, contentState } = this.props;
        const { editorState, onChange } = blockProps;

        let nextContent = contentState.mergeEntityData(
            block.getEntityAt(0),
            nextData,
        );

        // To remove in Draft.js 0.11.
        // This is necessary because entity data is still using a mutable, global store.
        nextContent = Modifier.mergeBlockData(
            nextContent,
            new SelectionState({
                anchorKey: block.getKey(),
                anchorOffset: 0,
                focusKey: block.getKey(),
                focusOffset: block.getLength(),
            }),
            {},
        );

        onChange(
            EditorState.push(editorState, nextContent, 'insert-characters'),
        );
    }

    changeText(e) {
        this.onSave({
            alt: e.currentTarget.value,
        });
    }

    changeAlignment(e) {
        this.onSave({
            alignment: e.currentTarget.value,
        });
    }

    renderTooltip() {
        const { blockProps } = this.props;
        const { showTooltipAt } = this.state;
        const {
            entity,
            entityKey,
            entityConfig,
            onEditEntity,
            onRemoveEntity,
        } = blockProps;
        const { alt, alignment } = entity.getData();
        const imageFormats = entityConfig.imageFormats || [];

        return (
            <Portal clickOutsideClose={this.closeTooltip}>
                <div style={showTooltipAt} className="Tooltip" role="tooltip">
                    <div className="ImageBlock__options">
                        <div className="RichEditor-grid">
                            <div className="RichEditor-col">
                                <label className="u-block">
                                    <h4>Alt text</h4>
                                    <p>
                                        <input
                                            type="text"
                                            value={alt || ''}
                                            onChange={this.changeText}
                                        />
                                    </p>
                                </label>
                            </div>
                            <div className="RichEditor-col">
                                <h4>Image alignment</h4>
                                <p>
                                    {imageFormats.map(format => {
                                        return (
                                            <label key={format.value}>
                                                <input
                                                    type="radio"
                                                    value={format.value}
                                                    onChange={
                                                        this.changeAlignment
                                                    }
                                                    checked={
                                                        format.value ===
                                                        alignment
                                                    }
                                                />
                                                {format.label}
                                            </label>
                                        );
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Portal>
        );
    }

    render() {
        const { block, blockProps } = this.props;
        const { showTooltipAt } = this.state;
        const { entity, entityKey, entityConfig } = blockProps;
        const { src } = entity.getData();

        return (
            <div className="ImageBlock" onMouseUp={this.openTooltip}>
                <span className="ImageBlock__icon">
                    <Icon icon={entityConfig.icon} />
                </span>

                <img src={src} alt="" />

                {showTooltipAt && this.renderTooltip()}
            </div>
        );
    }
}

ImageBlock.propTypes = propTypes;

export default ImageBlock;
