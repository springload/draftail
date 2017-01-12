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
        {
            key: '5384u',
            text: 'Everyone 🍺 Springload applies the best principles of UX to their work.',
            type: 'blockquote',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'eelkd',
            text: 'The design decisions we make building tools and services for your customers are based on empathy for what your customers need.',
            type: 'unstyled',
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
            key: 'a1tis',
            text: 'User testing and analysis',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'adjdn',
            text: 'A/B testing',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: '62lio',
            text: 'Prototyping',
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
            text: '1. A list item (0)',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: '4ht9m',
            text: '2. Oops! (1)',
            type: 'unordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'c6gc4',
            text: '3. Does this support nesting? (2)',
            type: 'unordered-list-item',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'c6gc3',
            text: '4. Maybe? (2)',
            type: 'unordered-list-item',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: '3mn5b',
            text: '5. Yep it does! (3)',
            type: 'unordered-list-item',
            depth: 3,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: '28umf',
            text: '6. How many levels deep? (3)',
            type: 'unordered-list-item',
            depth: 3,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'c2gc4',
            text: '7. Backtracking, two at once... (1)',
            type: 'unordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'c1gcb',
            text: '8. Uh oh (1)',
            type: 'unordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'c2gh4',
            text: '9. Up, up, and away! (2)',
            type: 'unordered-list-item',
            depth: 2,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'c1ghb',
            text: '10. Arh! (1)',
            type: 'unordered-list-item',
            depth: 1,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'c1gc9',
            text: '11. Did this work? (0)',
            type: 'unordered-list-item',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
        },
        {
            key: 'c1gc9',
            text: '12. Yes! (0)',
            type: 'unordered-list-item',
            depth: 0,
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
