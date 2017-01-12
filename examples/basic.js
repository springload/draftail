import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { BLOCK_TYPE, INLINE_STYLE } from '../lib';

const mount = document.querySelector('[data-mount-basic]');

const options = {
    enableHorizontalRule: true,
    enableLineBreak: true,
    modelPickerOptions: [],
    imageFormats: [],
    mediaControls: [],
    dialogControls: [],
    sources: [],
    decorators: [],
    BLOCK_TYPES: [
        { label: 'H2', style: BLOCK_TYPE.HEADER_TWO },
        { label: 'H3', style: BLOCK_TYPE.HEADER_THREE },
        { label: 'UL', style: BLOCK_TYPE.UNORDERED_LIST_ITEM, icon: 'icon-list-ul' },
        { label: 'OL', style: BLOCK_TYPE.ORDERED_LIST_ITEM, icon: 'icon-list-ol' },
    ],

    INLINE_STYLES: [
        { label: 'Bold', style: INLINE_STYLE.BOLD, icon: 'icon-bold' },
        { label: 'Italic', style: INLINE_STYLE.ITALIC, icon: 'icon-italic' },
    ],
};

const rawContentState = {
    entityMap: {
        0: {
            type: 'HORIZONTAL_RULE',
            mutability: 'IMMUTABLE',
            data: {},
        },
    },
    blocks: [
        {
            key: '6mgfh',
            text: 'User experience design 🚀',
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
        {
            key: '5384u',
            text: 'Everyone at Springload applies the best principles of UX to their work.',
            type: 'blockquote',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'b9grk',
            text: 'User research',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: '62lio',
            text: 'Beautiful <code/>',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: '3mfvu',
            text: ' ',
            type: 'atomic',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
                {
                    offset: 0,
                    length: 1,
                    key: 0,
                },
            ],
            data: {},
        },
        {
            key: 'fq3f',
            text: 'How we made it delightful and easy for people to find NZ Festival shows',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [
                {
                    offset: 15,
                    length: 10,
                    style: 'BOLD',
                },
                {
                    offset: 30,
                    length: 4,
                    style: 'ITALIC',
                },
            ],
            entityRanges: [],
        },
        {
            key: '93agv',
            text: 'Lists are cool.',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: '93ahh',
            text: 'Lists are very cool.',
            type: 'ordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: '4ht9m',
            text: 'Nested lists are even better!',
            type: 'ordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
        },
    ],
};

const onSave = (contentState) => {
    console.log('Save basic example:', contentState);
};

const editor = (
    <DraftailEditor
        rawContentState={rawContentState}
        options={options}
        onSave={onSave}
    />
);

ReactDOM.render(editor, mount);
