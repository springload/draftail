import React, { Component } from 'react';
import { Entity } from 'draft-js';

import config from '../config';

/**
 * Editor block to display media and edit content.
 */
class MediaBlock extends Component {
    constructor(props) {
        super(props);

        this.state = {
            active: false,
        };

        this.onClick = this.onClick.bind(this);
        this.onSave = this.onSave.bind(this);
        this.onCancel = this.onCancel.bind(this);
    }

    onClick(e) {
        const { blockProps } = this.props;
        const { active } = this.state;

        e.preventDefault();

        if (active) {
            blockProps.unlockEditor();
        } else {
            blockProps.lockEditor();
        }

        this.setState({
            active: !active,
        });
    }

    onSave(nextData) {
        const { block, blockProps } = this.props;

        this.setState({
            active: false,
        });

        // This will update in place
        Entity.mergeData(block.getEntityAt(0), nextData);
        blockProps.unlockEditor();
    }

    onCancel() {
        this.setState({
            active: false,
        });
    }

    render() {
        const { block, blockProps } = this.props;
        const { active } = this.state;
        const entity = Entity.get(block.getEntityAt(0));
        const MediaComponent = config.getEntityComponent(entity.getType());

        let className = 'RichEditor-media';

        if (active) {
            className += ' RichEditor-media--open';
        }

        return (
            <div className={className} aria-atomic={true}>
                <MediaComponent
                    options={blockProps.options}
                    entity={entity}
                    active={active}
                    onClick={this.onClick}
                    onCancel={this.onCancel}
                    onSave={this.onSave}
                />
            </div>
        );
    }
}

MediaBlock.propTypes = {
    block: React.PropTypes.object.isRequired,
    blockProps: React.PropTypes.object.isRequired,
};

export default MediaBlock;
