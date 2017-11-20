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
        stripPastedStyles={false}
        blockTypes={[
            {
                label: 'H2',
                type: BLOCK_TYPE.HEADER_TWO,
                description: 'Heading 2',
            },
            {
                label: 'Tiny',
                type: 'tiny-text',
                element: 'div',
                className: 'u-tinytext',
            },
        ]}
        inlineStyles={[
            {
                type: INLINE_STYLE.BOLD,
                icon: 'icon-bold',
                description: 'Bold',
                style: { fontWeight: 'bold', textShadow: '1px 1px 1px black' },
            },
            {
                label: '█',
                type: 'REDACTED',
                description: 'Redacted',
                style: { backgroundColor: 'currentcolor' },
            },
        ]}
    />
);

ReactDOM.render(editor, mount);
