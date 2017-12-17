import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { EditorState, Modifier, SelectionState } from 'draft-js';

import { Icon } from '../../lib';

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
 * Editor block to display media and edit content.
 */
class EmbedBlock extends Component {
    constructor(props) {
        super(props);

        this.onSave = this.onSave.bind(this);
    }

    onSave(nextData) {
        const { block, blockProps, contentState } = this.props;
        const { editorState, onChange } = blockProps;

        let nextContentState = contentState.mergeEntityData(
            block.getEntityAt(0),
            nextData,
        );

        // To remove in Draft.js 0.11.
        // This is necessary because entity data is still using a mutable, global store.
        nextContentState = Modifier.mergeBlockData(
            nextContentState,
            new SelectionState({
                anchorKey: block.getKey(),
                anchorOffset: 0,
                focusKey: block.getKey(),
                focusOffset: block.getLength(),
            }),
            {},
        );

        onChange(
            EditorState.push(
                editorState,
                nextContentState,
                'insert-characters',
            ),
        );
    }

    render() {
        const { blockProps } = this.props;
        const { entity, entityConfig } = blockProps;
        const {
            url,
            title,
            providerName,
            authorName,
            thumbnail,
        } = entity.getData();

        return (
            <div className="EmbedBlock">
                <span className="EmbedBlock-icon">
                    <Icon icon={entityConfig.icon} />
                </span>

                <div className="EmbedBlock-container">
                    <span className="EmbedBlock-preview">
                        <img src={thumbnail} alt="" />
                    </span>
                </div>

                {false ? (
                    <div className="EmbedBlock-options">
                        <h3>
                            <strong>{title}</strong>
                        </h3>
                        <p>
                            <span>
                                URL:
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {url}
                                </a>
                            </span>
                            <br />
                            <span>{`Provider: ${providerName}`}</span>
                            <br />
                            <span>{`Author: ${authorName}`}</span>
                        </p>
                    </div>
                ) : null}
            </div>
        );
    }
}

EmbedBlock.propTypes = propTypes;

export default EmbedBlock;
