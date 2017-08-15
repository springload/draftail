import PropTypes from 'prop-types';
import React from 'react';

import DraftUtils from '../api/DraftUtils';

import Button from '../components/Button';

import { BR_TYPE, ENTITY_TYPE } from '../api/constants';
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
}) =>
    <div className="editor__toolbar" role="toolbar">
        {blockTypes.map(block =>
            <Button
                key={block.type}
                name={block.type}
                active={DraftUtils.isSelectedBlockType(editorState, block.type)}
                label={block.label}
                title={behavior.getKeyboardShortcut(block.type)}
                icon={block.icon}
                onClick={toggleBlockType.bind(null, block.type)}
            />,
        )}

        {inlineStyles.map(style =>
            <Button
                key={style.type}
                name={style.type}
                active={DraftUtils.hasCurrentInlineStyle(
                    editorState,
                    style.type,
                )}
                label={style.label}
                title={behavior.getKeyboardShortcut(style.type)}
                icon={style.icon}
                onClick={toggleInlineStyle.bind(null, style.type)}
            />,
        )}

        {enableHorizontalRule
            ? <Button
                  name={ENTITY_TYPE.HORIZONTAL_RULE}
                  onClick={addHR}
                  label="HR"
              />
            : null}

        {enableLineBreak
            ? <Button
                  name={BR_TYPE}
                  onClick={addBR}
                  label="BR"
                  title={behavior.getKeyboardShortcut(BR_TYPE)}
              />
            : null}

        {entityTypes.map(entity =>
            <Button
                key={entity.type}
                name={entity.type}
                onClick={onRequestDialog.bind(null, entity.type)}
                label={entity.label}
                title={behavior.getKeyboardShortcut(entity.type)}
                icon={entity.icon}
            />,
        )}
    </div>;

Toolbar.propTypes = {
    editorState: PropTypes.object.isRequired,
    enableHorizontalRule: PropTypes.bool.isRequired,
    enableLineBreak: PropTypes.bool.isRequired,
    entityTypes: PropTypes.array.isRequired,
    blockTypes: PropTypes.array.isRequired,
    inlineStyles: PropTypes.array.isRequired,
    toggleBlockType: PropTypes.func.isRequired,
    toggleInlineStyle: PropTypes.func.isRequired,
    addHR: PropTypes.func.isRequired,
    addBR: PropTypes.func.isRequired,
    onRequestDialog: PropTypes.func.isRequired,
};

export default Toolbar;
