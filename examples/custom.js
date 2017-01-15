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
            type: 'terms-and-conditions',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
    ],
};

const onSave = (contentState) => {
    console.log('Save custom example:', contentState);
};

const editor = (
    <DraftailEditor
        rawContentState={rawContentState}
        onSave={onSave}
        blockTypes={[
            { label: 'H2', type: BLOCK_TYPE.HEADER_TWO },
            { label: 'T&C', type: 'terms-and-conditions', element: 'div', className: 'u-smalltext' },
        ]}
    />
);

ReactDOM.render(editor, mount);
