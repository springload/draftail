import React from 'react';

import BlockControls from '../components/BlockControls';
import InlineStyleControls from '../components/InlineStyleControls';
import Button from '../components/Button';

const Toolbar = ({
    editorState,
    options,
    readOnly,
    toggleBlockType,
    toggleInlineStyle,
    addHR,
    addBR,
    onRequestDialog,
}) => (
    <div className={`editor__controls${readOnly ? ' editor--readonly' : ''}`} role="toolbar">
        <BlockControls
            blockTypes={options.blockTypes}
            editorState={editorState}
            onToggle={toggleBlockType}
        />
        <InlineStyleControls
            inlineStyles={options.inlineStyles}
            editorState={editorState}
            onToggle={toggleInlineStyle}
        />

        {options.enableHorizontalRule ? (
            <Button
                onClick={addHR}
                label="HR"
                icon="horizontalrule"
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
    readOnly: React.PropTypes.bool.isRequired,
    toggleBlockType: React.PropTypes.func.isRequired,
    toggleInlineStyle: React.PropTypes.func.isRequired,
    addHR: React.PropTypes.func.isRequired,
    addBR: React.PropTypes.func.isRequired,
    onRequestDialog: React.PropTypes.func.isRequired,
};

export default Toolbar;
