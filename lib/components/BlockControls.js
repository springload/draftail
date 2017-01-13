import React from 'react';
import Button from './Button';
import DraftUtils from '../api/DraftUtils';

const BlockControls = ({ editorState, blockTypes, onToggle }) => (
    <div className="u-inline-block">
        {blockTypes.map((block, i) => (
            <Button
                key={i}
                active={DraftUtils.isSelectedBlockType(editorState, block.type)}
                label={block.label}
                icon={block.icon}
                onClick={onToggle.bind(null, block.type)}
            />
        ))}
    </div>
);

BlockControls.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    blockTypes: React.PropTypes.array.isRequired,
    onToggle: React.PropTypes.func.isRequired,
};

export default BlockControls;
