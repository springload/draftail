import React from 'react';
import Button from './Button';
import DraftUtils from '../api/DraftUtils';

const InlineStyleControls = ({ editorState, inlineStyles, onToggle }) => (
    <div className="u-inline-block">
        {inlineStyles.map((style, i) => (
            <Button
                key={i}
                active={DraftUtils.hasCurrentInlineStyle(editorState, style.type)}
                label={style.label}
                icon={style.icon}
                onClick={onToggle.bind(null, style.type)}
            />
        ))}
    </div>
);

InlineStyleControls.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    inlineStyles: React.PropTypes.array.isRequired,
    onToggle: React.PropTypes.func.isRequired,
};

export default InlineStyleControls;
