import React from 'react';
import StyleButton from './StyleButton';

const InlineStyleControls = ({ editorState, styles, onToggle }) => {
    const currentStyle = editorState.getCurrentInlineStyle();
    return (
        <div className="RichEditor-controls">
            {styles.map(type => (
                <StyleButton
                    key={type.label}
                    active={currentStyle.has(type.style)}
                    label={type.label}
                    icon={type.icon}
                    onToggle={onToggle}
                    style={type.style}
                />
            ))}
        </div>
    );
};

InlineStyleControls.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    styles: React.PropTypes.array.isRequired,
    onToggle: React.PropTypes.func.isRequired,
};

export default InlineStyleControls;
