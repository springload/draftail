import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { BLOCK_TYPE, INLINE_STYLE } from '../lib';

import allContentState from './utils/allContentState';

const mount = document.querySelector('[data-mount-all]');

const onSave = contentState => {
    sessionStorage.setItem('all:contentState', JSON.stringify(contentState));
};

const allBlockTypes = Object.keys(BLOCK_TYPE).map(type => ({
    label: `${type.charAt(0).toUpperCase()}${type
        .slice(1)
        .toLowerCase()
        .replace(/_/g, ' ')}`,
    type: BLOCK_TYPE[type],
}));

const allInlineStyles = Object.keys(INLINE_STYLE).map(type => ({
    label: `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`,
    type: INLINE_STYLE[type],
}));

const editor = (
    <DraftailEditor
        rawContentState={allContentState}
        onSave={onSave}
        stripPastedStyles={false}
        enableHorizontalRule={true}
        enableLineBreak={true}
        showUndoRedoControls={true}
        blockTypes={allBlockTypes}
        inlineStyles={allInlineStyles}
    />
);

ReactDOM.render(editor, mount);
