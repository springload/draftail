import React from 'react';

import DraftUtils from '../api/DraftUtils';

import Button from '../components/Button';

import { BR_TYPE } from '../api/constants';
import behavior from '../api/behavior';

const Toolbar = ({
    editorState,
    blockTypes,
    inlineStyles,
    enableHorizontalRule,
    enableLineBreak,
    entityTypes,
    toggleBlockType,
    toggleInlineStyle,
    addHR,
    addBR,
    onRequestDialog,
}) => (
    <div className="editor__toolbar" role="toolbar">
        {blockTypes.map(block => (
            <Button
                key={block.type}
                active={DraftUtils.isSelectedBlockType(editorState, block.type)}
                label={block.label}
                title={behavior.getKeyboardShortcut(block.type)}
                icon={block.icon}
                onClick={toggleBlockType.bind(null, block.type)}
            />
        ))}

        {inlineStyles.map(style => (
            <Button
                key={style.type}
                active={DraftUtils.hasCurrentInlineStyle(editorState, style.type)}
                label={style.label}
                title={behavior.getKeyboardShortcut(style.type)}
                icon={style.icon}
                onClick={toggleInlineStyle.bind(null, style.type)}
            />
        ))}

        {enableHorizontalRule ? (
            <Button
                onClick={addHR}
                label="HR"
            />
        ) : null}

        {enableLineBreak ? (
            <Button
                onClick={addBR}
                label="BR"
                title={behavior.getKeyboardShortcut(BR_TYPE)}
            />
        ) : null}

        {entityTypes.map(entity => (
            <Button
                key={entity.type}
                onClick={onRequestDialog.bind(null, entity.type)}
                label={entity.label}
                title={behavior.getKeyboardShortcut(entity.type)}
                icon={entity.icon}
            />
        ))}
    </div>
);

Toolbar.propTypes = {
    editorState: React.PropTypes.object.isRequired,
    enableHorizontalRule: React.PropTypes.bool.isRequired,
    enableLineBreak: React.PropTypes.bool.isRequired,
    entityTypes: React.PropTypes.array.isRequired,
    blockTypes: React.PropTypes.array.isRequired,
    inlineStyles: React.PropTypes.array.isRequired,
    toggleBlockType: React.PropTypes.func.isRequired,
    toggleInlineStyle: React.PropTypes.func.isRequired,
    addHR: React.PropTypes.func.isRequired,
    addBR: React.PropTypes.func.isRequired,
    onRequestDialog: React.PropTypes.func.isRequired,
};

export default Toolbar;
