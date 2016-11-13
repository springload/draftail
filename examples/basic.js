import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor from '../lib';

const mount = document.querySelector('[data-mount-basic]');

const options = {
    modelPickerOptions: [],
    imageFormats: [],
    mediaControls: [],
    dialogControls: [],
    sources: [],
    decorators: [],
    BLOCK_TYPES: [
        { label: 'H2', style: 'header-two' },
        { label: 'H3', style: 'header-three' },
        { label: 'UL', style: 'unordered-list-item', icon: 'list-ul' },
    ],

    INLINE_STYLES: [
        { label: 'Bold', style: 'BOLD', icon: 'bold' },
        { label: 'Italic', style: 'ITALIC', icon: 'italic' },
    ],
};

const value = {
    entityMap: {},
    blocks: [
        {
            key: '6mgfh',
            text: 'User experience (UX) design',
            type: 'header-two',
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 16,
                    length: 4,
                    style: 'ITALIC',
                },
            ],
            entityRanges: [],
        },
    ],
};

const editor = (
    <DraftailEditor name="basic" value={JSON.stringify(value)} options={options} />
);

ReactDOM.render(editor, mount);
