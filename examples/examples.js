import React from 'react';
import ReactDOM from 'react-dom';

import { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from '../lib';

import DocumentSource from './sources/DocumentSource';
import LinkSource from './sources/LinkSource';
import ImageSource from './sources/ImageSource';
import EmbedSource from './sources/EmbedSource';

import Link from './entities/Link';
import Document from './entities/Document';

import EditorWrapper from './components/EditorWrapper';

import PrismDecorator from './components/PrismDecorator';

import allContentState from './utils/allContentState';

import './simple';

const ICON_DOCUMENT = [
    'M917.806 229.076c-22.212-30.292-53.174-65.7-87.178-99.704s-69.412-64.964-99.704-87.178c-51.574-37.82-76.592-42.194-90.924-42.194h-496c-44.112 0-80 35.888-80 80v864c0 44.112 35.888 80 80 80h736c44.112 0 80-35.888 80-80v-624c0-14.332-4.372-39.35-42.194-90.924zM785.374 174.626c30.7 30.7 54.8 58.398 72.58 81.374h-153.954v-153.946c22.984 17.78 50.678 41.878 81.374 72.572zM896 944c0 8.672-7.328 16-16 16h-736c-8.672 0-16-7.328-16-16v-864c0-8.672 7.328-16 16-16 0 0 495.956-0.002 496 0v224c0 17.672 14.326 32 32 32h224v624z',
    'M736 832h-448c-17.672 0-32-14.326-32-32s14.328-32 32-32h448c17.674 0 32 14.326 32 32s-14.326 32-32 32z',
    'M736 704h-448c-17.672 0-32-14.326-32-32s14.328-32 32-32h448c17.674 0 32 14.326 32 32s-14.326 32-32 32z',
    'M736 576h-448c-17.672 0-32-14.326-32-32s14.328-32 32-32h448c17.674 0 32 14.326 32 32s-14.326 32-32 32z',
];

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
                {
                    type: ENTITY_TYPE.IMAGE,
                    source: ImageSource,
                    imageFormats: [],
                },
                {
                    type: ENTITY_TYPE.EMBED,
                    source: EmbedSource,
                },
                {
                    type: ENTITY_TYPE.LINK,
                    source: LinkSource,
                    decorator: Link,
                },
                {
                    type: ENTITY_TYPE.DOCUMENT,
                    icon: ICON_DOCUMENT,
                    description: 'Document',
                    source: DocumentSource,
                    decorator: Document,
                },
            ]}
            blockTypes={[
                { type: BLOCK_TYPE.HEADER_TWO },
                { type: BLOCK_TYPE.HEADER_THREE },
                { type: BLOCK_TYPE.HEADER_FOUR },
                { type: BLOCK_TYPE.HEADER_FIVE },
                { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
            ]}
            inlineStyles={[
                { type: INLINE_STYLE.BOLD },
                { type: INLINE_STYLE.ITALIC },
            ]}
        />
    );

    ReactDOM.render(editor, document.querySelector('[data-mount-wagtail]'));
};

const initCustom = () => {
    const rawContentState = {
        entityMap: {},
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
                    { offset: 9, length: 13, style: 'REDACTED' },
                    { offset: 27, length: 5, style: 'REDACTED' },
                    { offset: 56, length: 15, style: 'REDACTED' },
                ],
                entityRanges: [],
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
                {
                    type: BLOCK_TYPE.HEADER_TWO,
                },
                {
                    type: BLOCK_TYPE.CODE,
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
                    style: {
                        fontWeight: 'bold',
                        textShadow: '1px 1px 1px black',
                    },
                },
                {
                    label: '█',
                    type: 'REDACTED',
                    description: 'Redacted',
                    style: { backgroundColor: 'currentcolor' },
                },
            ]}
            entityTypes={[
                new PrismDecorator({
                    defaultLanguage: 'css',
                }),
                {
                    type: ENTITY_TYPE.DOCUMENT,
                    description: 'Document',
                    icon: ICON_DOCUMENT,
                    source: DocumentSource,
                    decorator: Document,
                },
            ]}
        />
    );

    ReactDOM.render(editor, document.querySelector('[data-mount-custom]'));
};

const initAll = () => {
    const allBlockTypes = Object.values(BLOCK_TYPE)
        .filter(t => t !== BLOCK_TYPE.ATOMIC)
        .map(type => ({ type }));

    const allInlineStyles = Object.values(INLINE_STYLE).map(type => ({ type }));

    const editor = (
        <EditorWrapper
            id="all"
            rawContentState={allContentState}
            stripPastedStyles={false}
            enableHorizontalRule={true}
            enableLineBreak={true}
            showUndoRedoControls={true}
            blockTypes={allBlockTypes}
            inlineStyles={allInlineStyles}
            entityTypes={[
                {
                    type: ENTITY_TYPE.IMAGE,
                    source: ImageSource,
                    imageFormats: [],
                },
                {
                    type: ENTITY_TYPE.EMBED,
                    source: EmbedSource,
                },
                {
                    type: ENTITY_TYPE.LINK,
                    source: LinkSource,
                    decorator: Link,
                },
            ]}
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
                        {
                            type: ENTITY_TYPE.IMAGE,
                            source: ImageSource,
                            imageFormats: [],
                        },
                        {
                            type: ENTITY_TYPE.EMBED,
                            source: EmbedSource,
                        },
                        {
                            type: ENTITY_TYPE.LINK,
                            source: LinkSource,
                            decorator: Link,
                        },
                    ]}
                    blockTypes={[
                        { type: BLOCK_TYPE.HEADER_TWO },
                        { type: BLOCK_TYPE.HEADER_THREE },
                        { type: BLOCK_TYPE.HEADER_FOUR },
                        { type: BLOCK_TYPE.HEADER_FIVE },
                        { type: BLOCK_TYPE.BLOCKQUOTE },
                        { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                        { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
                        {
                            label: 'Tiny',
                            type: 'tiny-text',
                            element: 'div',
                            className: 'u-tinytext',
                        },
                    ]}
                    inlineStyles={[
                        { type: INLINE_STYLE.BOLD },
                        { type: INLINE_STYLE.ITALIC },
                        { type: INLINE_STYLE.UNDERLINE },
                        { type: INLINE_STYLE.CODE, label: '</>' },
                        { type: INLINE_STYLE.STRIKETHROUGH },
                        {
                            label: '█',
                            type: 'REDACTED',
                            description: 'Redacted',
                            style: { backgroundColor: 'currentcolor' },
                        },
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
                    entityTypes={[
                        {
                            type: ENTITY_TYPE.IMAGE,
                            source: ImageSource,
                            imageFormats: [],
                        },
                        {
                            type: ENTITY_TYPE.LINK,
                            source: LinkSource,
                            decorator: Link,
                        },
                    ]}
                    blockTypes={[
                        { type: BLOCK_TYPE.HEADER_FOUR },
                        { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                    ]}
                    inlineStyles={[
                        { type: INLINE_STYLE.BOLD },
                        { type: INLINE_STYLE.ITALIC },
                    ]}
                />
            </div>
            <div className="example">
                <h3>Keep basic styles</h3>
                <EditorWrapper
                    id="test:3"
                    stripPastedStyles={false}
                    inlineStyles={[
                        { type: INLINE_STYLE.BOLD },
                        { type: INLINE_STYLE.ITALIC },
                    ]}
                />
            </div>
            <div className="example">
                <h3>Strip all formatting on paste</h3>
                <EditorWrapper
                    id="test:4"
                    enableHorizontalRule={true}
                    enableLineBreak={true}
                    stripPastedStyles={true}
                    entityTypes={[
                        {
                            type: ENTITY_TYPE.IMAGE,
                            source: ImageSource,
                            imageFormats: [],
                        },
                        {
                            type: ENTITY_TYPE.LINK,
                            source: LinkSource,
                            decorator: Link,
                        },
                    ]}
                    blockTypes={[
                        { type: BLOCK_TYPE.HEADER_FOUR },
                        { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                    ]}
                    inlineStyles={[
                        { type: INLINE_STYLE.BOLD },
                        { type: INLINE_STYLE.ITALIC },
                    ]}
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
