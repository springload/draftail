import React from 'react';
import Button from './Button';
import DraftUtils from '../api/DraftUtils';

const BlockControls = ({ editorState, styles, onToggle }) => (
    <div className="u-inline-block">
        {styles.map((type, i) => (
            <Button
                key={i}
                active={type.style === DraftUtils.getSelectedBlockType(editorState)}
                label={type.label}
                icon={type.icon}
                onClick={onToggle.bind(null, type.style)}
                style={type.style}
            />
        ))}
    </div>
);

BlockControls.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    styles: React.PropTypes.array.isRequired,
    onToggle: React.PropTypes.func.isRequired,
};

export default BlockControls;
