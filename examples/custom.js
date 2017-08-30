import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { BLOCK_TYPE } from '../lib';

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
            { label: 'H2', type: BLOCK_TYPE.HEADER_TWO },
            {
                label: 'Tiny',
                type: 'tiny-text',
                element: 'div',
                className: 'u-tinytext',
            },
        ]}
    />
);

ReactDOM.render(editor, mount);
