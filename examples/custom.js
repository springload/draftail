import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { BLOCK_TYPE, INLINE_STYLE } from '../lib';

const mount = document.querySelector('[data-mount-custom]');

const rawContentState = {
    entityMap: {},
    blocks: [
        {
            key: 'c1gc9',
            text: 'You can also implement custom block types as required.',
            type: 'tiny-text',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
    ],
};

const onSave = contentState => {
    sessionStorage.setItem('custom:contentState', JSON.stringify(contentState));
};

const editor = (
    <DraftailEditor
        rawContentState={rawContentState}
        onSave={onSave}
        blockTypes={[
            { label: 'H2', type: BLOCK_TYPE.HEADER_TWO },
            {
                label: 'Tiny',
                type: 'tiny-text',
                element: 'div',
                className: 'u-tinytext',
            },
        ]}
        inlineStyles={[
            { label: 'Bold', type: INLINE_STYLE.BOLD, style: { fontWeight: 'bold', textShadow: '1px 1px 1px black' } },
            { label: 'Redacted', type: 'REDACTED', style: { backgroundColor: 'currentcolor' } },
        ]}
    />
);

ReactDOM.render(editor, mount);
