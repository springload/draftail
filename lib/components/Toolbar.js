import React from 'react';

import DraftUtils from '../api/DraftUtils';

import Button from '../components/Button';

const Toolbar = ({
    editorState,
    options,
    toggleBlockType,
    toggleInlineStyle,
    addHR,
    addBR,
    onRequestDialog,
}) => (
    <div className="editor__toolbar" role="toolbar">
        {options.blockTypes.map(block => (
            <Button
                key={block.type}
                active={DraftUtils.isSelectedBlockType(editorState, block.type)}
                label={block.label}
                icon={block.icon}
                onClick={toggleBlockType.bind(null, block.type)}
            />
        ))}

        {options.inlineStyles.map(style => (
            <Button
                key={style.type}
                active={DraftUtils.hasCurrentInlineStyle(editorState, style.type)}
                label={style.label}
                icon={style.icon}
                onClick={toggleInlineStyle.bind(null, style.type)}
            />
        ))}

        {options.enableHorizontalRule ? (
            <Button
                onClick={addHR}
                label="HR"
            />
        ) : null}

        {options.enableLineBreak ? (
            <Button
                onClick={addBR}
                label="BR"
            />
        ) : null}

        {options.entityTypes.map(entity => (
            <Button
                key={entity.type}
                onClick={onRequestDialog.bind(null, entity.type)}
                label={entity.label}
                icon={entity.icon}
            />
        ))}
    </div>
);

Toolbar.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    options: React.PropTypes.object.isRequired,
    toggleBlockType: React.PropTypes.func.isRequired,
    toggleInlineStyle: React.PropTypes.func.isRequired,
    addHR: React.PropTypes.func.isRequired,
    addBR: React.PropTypes.func.isRequired,
    onRequestDialog: React.PropTypes.func.isRequired,
};

export default Toolbar;
