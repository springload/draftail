import React from 'react';
import StyleButton from './StyleButton';
import * as DraftUtils from '../utils/DraftUtils';

const BlockControls = ({ editorState, styles, onToggle }) => (
    <div className="RichEditor-controls">
        {styles.map((type) => (
            <StyleButton
                key={type.label}
                active={type.style === DraftUtils.getSelectedBlockType(editorState)}
                label={type.label}
                icon={type.icon}
                onToggle={onToggle}
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
