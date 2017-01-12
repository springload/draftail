import React from 'react';
import Button from './Button';
import DraftUtils from '../api/DraftUtils';

const InlineStyleControls = ({ editorState, styles, onToggle }) => (
    <div className="u-inline-block">
        {styles.map(type => (
            <Button
                key={type.label}
                active={DraftUtils.hasCurrentInlineStyle(editorState, type.style)}
                label={type.label}
                icon={type.icon}
                onClick={onToggle.bind(null, type.style)}
                style={type.style}
            />
        ))}
    </div>
);

InlineStyleControls.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    styles: React.PropTypes.array.isRequired,
    onToggle: React.PropTypes.func.isRequired,
};

export default InlineStyleControls;
