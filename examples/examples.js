import React from 'react';
import ReactDOM from 'react-dom';

import { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from '../lib';

import { DOCUMENT_ICON, EMBED_ICON } from './constants/ui';

import DocumentSource from './sources/DocumentSource';
import LinkSource from './sources/LinkSource';
import ImageSource from './sources/ImageSource';
import EmbedSource from './sources/EmbedSource';

import Link from './entities/Link';
import Document from './entities/Document';

import MediaBlock from './blocks/MediaBlock';

import EditorWrapper from './components/EditorWrapper';
import PrismDecorator from './components/PrismDecorator';
import allContentState from './utils/allContentState';

import './simple';

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
                    type: 'EMBED',
                    icon: EMBED_ICON,
                    source: EmbedSource,
                    block: MediaBlock,
                },
                {
                    type: ENTITY_TYPE.LINK,
                    source: LinkSource,
                    decorator: Link,
                },
                {
                    type: 'DOCUMENT',
                    icon: DOCUMENT_ICON,
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
                    type: 'DOCUMENT',
                    description: 'Document',
                    icon: DOCUMENT_ICON,
                    source: DocumentSource,
                    decorator: Document,
                },
                {
                    type: 'EMBED',
                    icon: EMBED_ICON,
                    source: EmbedSource,
                    block: MediaBlock,
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
                            type: 'EMBED',
                            source: EmbedSource,
                            block: MediaBlock,
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
