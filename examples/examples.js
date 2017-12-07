import React from 'react';
import ReactDOM from 'react-dom';

import { INLINE_CONTROL, BLOCK_CONTROL, ENTITY_CONTROL } from './constants/ui';

import EditorWrapper from './components/EditorWrapper';
import PrismDecorator from './components/PrismDecorator';
import allContentState from './utils/allContentState';

import './simple';

const TINY_TEXT_BLOCK = {
    type: 'tiny-text',
    label: 'Tiny',
    description: 'Legal print',
    element: 'div',
    className: 'u-tinytext',
};

const REDACTED_STYLE = {
    type: 'REDACTED',
    icon:
        'M592 448h-16v-192c0-105.87-86.13-192-192-192h-128c-105.87 0-192 86.13-192 192v192h-16c-26.4 0-48 21.6-48 48v480c0 26.4 21.6 48 48 48h544c26.4 0 48-21.6 48-48v-480c0-26.4-21.6-48-48-48zM192 256c0-35.29 28.71-64 64-64h128c35.29 0 64 28.71 64 64v192h-256v-192z',
    description: 'Redacted',
    style: { backgroundColor: 'currentcolor' },
};

const initWagtail = () => {
    const editor = (
        <EditorWrapper
            id="wagtail"
            placeholder="Write here…"
            enableHorizontalRule={true}
            enableLineBreak={true}
            showUndoRedoControls={true}
            stripPastedStyles={false}
            maxListNesting={9}
            spellCheck={true}
            entityTypes={[
                ENTITY_CONTROL.IMAGE,
                ENTITY_CONTROL.EMBED,
                ENTITY_CONTROL.LINK,
                ENTITY_CONTROL.DOCUMENT,
            ]}
            blockTypes={[
                BLOCK_CONTROL.HEADER_TWO,
                BLOCK_CONTROL.HEADER_THREE,
                BLOCK_CONTROL.HEADER_FOUR,
                BLOCK_CONTROL.HEADER_FIVE,
                BLOCK_CONTROL.UNORDERED_LIST_ITEM,
                BLOCK_CONTROL.ORDERED_LIST_ITEM,
            ]}
            inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
        />
    );

    ReactDOM.render(editor, document.querySelector('[data-mount-wagtail]'));
};

const initCustom = () => {
    const rawContentState = {
        entityMap: {
            '0': {
                type: 'DOCUMENT',
                mutability: 'MUTABLE',
                data: {
                    url: 'doc.pdf',
                    title: 'Kritik der reinen Vernunft',
                },
            },
            '1': {
                type: 'EMBED',
                mutability: 'IMMUTABLE',
                data: {
                    url: 'http://www.youtube.com/watch?v=y8Kyi0WNg40',
                    title: 'Dramatic Look',
                    providerName: 'YouTube',
                    authorName: 'magnets99',
                    thumbnail:
                        'https://i.ytimg.com/vi/y8Kyi0WNg40/hqdefault.jpg',
                },
            },
        },
        blocks: [
            {
                key: 'c1gc9',
                text: 'You can implement custom block types as required.',
                type: 'tiny-text',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: 'bldpo',
                text:
                    'And also inline styles. Or abuse the entity API to make text decorators.',
                type: 'unstyled',
                depth: 0,
                inlineStyleRanges: [
                    {
                        offset: 9,
                        length: 13,
                        style: 'REDACTED',
                    },
                    {
                        offset: 27,
                        length: 5,
                        style: 'REDACTED',
                    },
                    {
                        offset: 56,
                        length: 15,
                        style: 'REDACTED',
                    },
                ],
                entityRanges: [
                    {
                        offset: 44,
                        length: 3,
                        key: 0,
                    },
                ],
                data: {},
            },
            {
                key: 'affm4',
                text: ' ',
                type: 'atomic',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [
                    {
                        offset: 0,
                        length: 1,
                        key: 1,
                    },
                ],
                data: {},
            },
            {
                key: '2uo5o',
                text: '.media .img {',
                type: 'code-block',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: '9cgaa',
                text: '    margin-right: 10px;',
                type: 'code-block',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
            {
                key: '3dhtn',
                text: '}',
                type: 'code-block',
                depth: 0,
                inlineStyleRanges: [],
                entityRanges: [],
                data: {},
            },
        ],
    };

    const editor = (
        <EditorWrapper
            id="custom"
            rawContentState={rawContentState}
            stripPastedStyles={false}
            spellCheck={true}
            blockTypes={[
                BLOCK_CONTROL.HEADER_TWO,
                BLOCK_CONTROL.CODE,
                TINY_TEXT_BLOCK,
            ]}
            inlineStyles={[
                Object.assign(
                    {
                        style: {
                            fontWeight: 'bold',
                            textShadow: '1px 1px 1px black',
                        },
                    },
                    INLINE_CONTROL.BOLD,
                ),
                REDACTED_STYLE,
            ]}
            entityTypes={[
                new PrismDecorator({ defaultLanguage: 'css' }),
                ENTITY_CONTROL.EMBED,
                ENTITY_CONTROL.DOCUMENT,
            ]}
        />
    );

    ReactDOM.render(editor, document.querySelector('[data-mount-custom]'));
};

const initAll = () => {
    const editor = (
        <EditorWrapper
            id="all"
            rawContentState={allContentState}
            stripPastedStyles={false}
            enableHorizontalRule={true}
            enableLineBreak={true}
            showUndoRedoControls={true}
            blockTypes={Object.values(BLOCK_CONTROL)}
            inlineStyles={Object.values(INLINE_CONTROL)}
            entityTypes={[ENTITY_CONTROL.IMAGE, ENTITY_CONTROL.LINK]}
        />
    );

    ReactDOM.render(editor, document.querySelector('[data-mount-all]'));
};

const initTest = () => {
    const editors = (
        <div>
            <h2>Test editors</h2>
            <div className="example">
                <h3>Keep everything</h3>
                <EditorWrapper
                    id="test:1"
                    enableHorizontalRule={true}
                    enableLineBreak={true}
                    stripPastedStyles={false}
                    entityTypes={[
                        ENTITY_CONTROL.IMAGE,
                        ENTITY_CONTROL.EMBED,
                        ENTITY_CONTROL.LINK,
                    ]}
                    blockTypes={[
                        BLOCK_CONTROL.HEADER_TWO,
                        BLOCK_CONTROL.HEADER_THREE,
                        BLOCK_CONTROL.HEADER_FOUR,
                        BLOCK_CONTROL.HEADER_FIVE,
                        BLOCK_CONTROL.BLOCKQUOTE,
                        BLOCK_CONTROL.UNORDERED_LIST_ITEM,
                        BLOCK_CONTROL.ORDERED_LIST_ITEM,
                        TINY_TEXT_BLOCK,
                    ]}
                    inlineStyles={[
                        INLINE_CONTROL.BOLD,
                        INLINE_CONTROL.ITALIC,
                        REDACTED_STYLE,
                    ]}
                />
            </div>
            <div className="example">
                <h3>Keep everything, with less enabled formats</h3>
                <EditorWrapper
                    id="test:2"
                    enableHorizontalRule={true}
                    enableLineBreak={true}
                    stripPastedStyles={false}
                    entityTypes={[ENTITY_CONTROL.IMAGE, ENTITY_CONTROL.LINK]}
                    blockTypes={[
                        BLOCK_CONTROL.HEADER_FOUR,
                        BLOCK_CONTROL.UNORDERED_LIST_ITEM,
                    ]}
                    inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
                />
            </div>
            <div className="example">
                <h3>Keep basic styles</h3>
                <EditorWrapper
                    id="test:3"
                    stripPastedStyles={false}
                    inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
                />
            </div>
            <div className="example">
                <h3>Strip all formatting on paste</h3>
                <EditorWrapper
                    id="test:4"
                    enableHorizontalRule={true}
                    enableLineBreak={true}
                    stripPastedStyles={true}
                    entityTypes={[ENTITY_CONTROL.IMAGE, ENTITY_CONTROL.LINK]}
                    blockTypes={[
                        BLOCK_CONTROL.HEADER_FOUR,
                        BLOCK_CONTROL.UNORDERED_LIST_ITEM,
                    ]}
                    inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
                />
            </div>
        </div>
    );

    ReactDOM.render(editors, document.querySelector('[data-mount-test]'));
};

initWagtail();
initCustom();
initAll();
initTest();
