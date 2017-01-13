import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { BLOCK_TYPE } from '../lib';

const mount = document.querySelector('[data-mount-custom]');

const options = {
    modelPickerOptions: [],
    imageFormats: [],
    sources: [],
    decorators: [],
    ENTITY_TYPES: [],
    BLOCK_TYPES: [
        { label: 'H2', style: BLOCK_TYPE.HEADER_TWO },
        { label: 'T&C', style: 'terms-and-conditions', element: 'div', className: 'u-smalltext' },
    ],
    INLINE_STYLES: [],
};

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
        options={options}
        onSave={onSave}
    />
);

ReactDOM.render(editor, mount);
