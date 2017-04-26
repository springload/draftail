import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { BLOCK_TYPE, INLINE_STYLE } from '../lib';

/**
 * This code sample is a basic example of Draftail usage.
 * It is meant to be mirrored as-is (except for this comment)
 * inside the editor documentation.
 */
const initialContentState = JSON.parse(sessionStorage.getItem('basic:contentState')) || null;

const onSave = (contentState) => {
    sessionStorage.setItem('basic:contentState', JSON.stringify(contentState));
};

const editor = (
    <DraftailEditor
        rawContentState={initialContentState}
        onSave={onSave}
        blockTypes={[
            { label: 'H3', type: BLOCK_TYPE.HEADER_THREE },
            { label: 'UL', type: BLOCK_TYPE.UNORDERED_LIST_ITEM, icon: 'icon-list-ul' },
        ]}
        inlineStyles={[
            { label: 'Bold', type: INLINE_STYLE.BOLD, icon: 'icon-bold' },
            { label: 'Italic', type: INLINE_STYLE.ITALIC, icon: 'icon-italic' },
        ]}
    />
);

ReactDOM.render(editor, document.querySelector('[data-mount-basic]'));
