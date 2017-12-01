/**
 * This code sample is a basic example of Draftail usage.
 * It is meant to be mirrored as-is (except for this comment)
 * inside the editor documentation.
 */
/* eslint-disable no-console */
import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { BLOCK_TYPE, INLINE_STYLE } from '../lib';

const initial = JSON.parse(sessionStorage.getItem('draftail:content'));

const onSave = content => {
    console.log('saving', content);
    sessionStorage.setItem('draftail:content', JSON.stringify(content));
};

const editor = (
    <DraftailEditor
        rawContentState={initial || null}
        onSave={onSave}
        blockTypes={[
            { type: BLOCK_TYPE.HEADER_THREE, label: 'H3' },
            { type: BLOCK_TYPE.UNORDERED_LIST_ITEM, label: 'UL' },
        ]}
        inlineStyles={[
            { type: INLINE_STYLE.BOLD, label: 'B' },
            { type: INLINE_STYLE.ITALIC, label: 'I' },
        ]}
    />
);

ReactDOM.render(editor, document.querySelector('[data-mount]'));
