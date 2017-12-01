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
                    label: 'H2',
                    type: BLOCK_TYPE.HEADER_TWO,
                    description: 'Heading 2',
                },
                {
                    label: '{\u2009}',
                    type: BLOCK_TYPE.CODE,
                    description: 'Code',
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
            ]}
        />
    );

    ReactDOM.render(editor, document.querySelector('[data-mount-custom]'));
};

const initAll = () => {
    const allBlockTypes = Object.keys(BLOCK_TYPE)
        .filter(t => t !== 'ATOMIC')
        .map(type => ({
            label: `${type.charAt(0).toUpperCase()}${type
                .slice(1)
                .toLowerCase()
                .replace(/_/g, ' ')}`,
            type: BLOCK_TYPE[type],
        }));

    const allInlineStyles = Object.keys(INLINE_STYLE).map(type => ({
        label: `${type.charAt(0).toUpperCase()}${type.slice(1).toLowerCase()}`,
        type: INLINE_STYLE[type],
    }));

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
        />
    );

    ReactDOM.render(editor, document.querySelector('[data-mount-all]'));
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
                {
                    type: ENTITY_TYPE.IMAGE,
                    description: 'Image',
                    icon: 'icon-image',
                    source: ImageSource,
                    imageFormats: [],
                },
                {
                    type: ENTITY_TYPE.EMBED,
                    description: 'Embed',
                    icon: 'icon-media',
                    source: EmbedSource,
                },
                {
                    type: ENTITY_TYPE.LINK,
                    description: 'Link',
                    icon: 'icon-link',
                    source: LinkSource,
                    decorator: Link,
                },
                {
                    type: ENTITY_TYPE.DOCUMENT,
                    description: 'Document',
                    icon: 'icon-doc-full',
                    source: DocumentSource,
                    decorator: Document,
                },
            ]}
            blockTypes={[
                {
                    type: BLOCK_TYPE.HEADER_TWO,
                    label: 'H2',
                    description: 'Heading 2',
                },
                {
                    type: BLOCK_TYPE.HEADER_THREE,
                    label: 'H3',
                    description: 'Heading 3',
                },
                {
                    type: BLOCK_TYPE.HEADER_FOUR,
                    label: 'H4',
                    description: 'Heading 4',
                },
                {
                    type: BLOCK_TYPE.HEADER_FIVE,
                    label: 'H5',
                    description: 'Heading 5',
                },
                {
                    type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
                    description: 'Bulleted list',
                    icon: 'icon-list-ul',
                },
                {
                    type: BLOCK_TYPE.ORDERED_LIST_ITEM,
                    description: 'Numbered list',
                    icon: 'icon-list-ol',
                },
            ]}
            inlineStyles={[
                {
                    type: INLINE_STYLE.BOLD,
                    description: 'Bold',
                    icon: 'icon-bold',
                },
                {
                    type: INLINE_STYLE.ITALIC,
                    description: 'Italic',
                    icon: 'icon-italic',
                },
            ]}
        />
    );

    ReactDOM.render(editor, document.querySelector('[data-mount-wagtail]'));
};

const initTest = () => {
    const editors = (
        <div>
            <EditorWrapper
                id="test:1"
                enableHorizontalRule={true}
                enableLineBreak={true}
                stripPastedStyles={false}
                entityTypes={[
                    {
                        type: ENTITY_TYPE.IMAGE,
                        description: 'Image',
                        icon: 'icon-image',
                        source: ImageSource,
                        imageFormats: [],
                    },
                    {
                        type: ENTITY_TYPE.EMBED,
                        description: 'Embed',
                        icon: 'icon-media',
                        source: EmbedSource,
                    },
                    {
                        type: ENTITY_TYPE.LINK,
                        description: 'Link',
                        icon: 'icon-link',
                        source: LinkSource,
                        decorator: Link,
                    },
                    {
                        type: ENTITY_TYPE.DOCUMENT,
                        description: 'Document',
                        icon: 'icon-doc-full',
                        source: DocumentSource,
                        decorator: Document,
                    },
                ]}
                blockTypes={[
                    {
                        label: 'H2',
                        type: BLOCK_TYPE.HEADER_TWO,
                        description: 'Heading 2',
                    },
                    {
                        label: 'H3',
                        type: BLOCK_TYPE.HEADER_THREE,
                        description: 'Heading 3',
                    },
                    {
                        label: 'H4',
                        type: BLOCK_TYPE.HEADER_FOUR,
                        description: 'Heading 4',
                    },
                    {
                        label: 'H5',
                        type: BLOCK_TYPE.HEADER_FIVE,
                        description: 'Heading 5',
                    },
                    {
                        type: BLOCK_TYPE.BLOCKQUOTE,
                        description: 'Blockquote',
                        icon: 'icon-openquote',
                    },
                    {
                        type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
                        description: 'Bulleted list',
                        icon: 'icon-list-ul',
                    },
                    {
                        type: BLOCK_TYPE.ORDERED_LIST_ITEM,
                        description: 'Numbered list',
                        icon: 'icon-list-ol',
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
                        description: 'Bold',
                        icon: 'icon-bold',
                    },
                    {
                        type: INLINE_STYLE.ITALIC,
                        description: 'Italic',
                        icon: 'icon-italic',
                    },
                    {
                        type: INLINE_STYLE.UNDERLINE,
                        description: 'Underline',
                        icon: 'icon-underline',
                    },
                    {
                        type: INLINE_STYLE.CODE,
                        label: '</>',
                        description: 'Code',
                    },
                    {
                        type: INLINE_STYLE.STRIKETHROUGH,
                        description: 'Strikethrough',
                        icon: 'icon-strikethrough',
                    },
                ]}
            />
            <hr />
            <EditorWrapper
                id="test:2"
                enableHorizontalRule={true}
                enableLineBreak={true}
                stripPastedStyles={false}
                entityTypes={[
                    {
                        type: ENTITY_TYPE.IMAGE,
                        description: 'Image',
                        icon: 'icon-image',
                        source: ImageSource,
                        imageFormats: [],
                    },
                    {
                        type: ENTITY_TYPE.LINK,
                        description: 'Link',
                        icon: 'icon-link',
                        source: LinkSource,
                        decorator: Link,
                    },
                ]}
                blockTypes={[
                    {
                        label: 'H4',
                        type: BLOCK_TYPE.HEADER_FOUR,
                        description: 'Heading 4',
                    },
                    {
                        type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
                        description: 'Bulleted list',
                        icon: 'icon-list-ul',
                    },
                ]}
                inlineStyles={[
                    {
                        type: INLINE_STYLE.BOLD,
                        description: 'Bold',
                        icon: 'icon-bold',
                    },
                    {
                        type: INLINE_STYLE.ITALIC,
                        description: 'Italic',
                        icon: 'icon-italic',
                    },
                ]}
            />
        </div>
    );

    ReactDOM.render(editors, document.querySelector('[data-mount-test]'));
};

initWagtail();
initCustom();
initAll();
initTest();
