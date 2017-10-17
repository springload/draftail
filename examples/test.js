import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from '../lib';

import DocumentSource from './sources/DocumentSource';
import LinkSource from './sources/LinkSource';
import ImageSource from './sources/ImageSource';
import EmbedSource from './sources/EmbedSource';

import Link from './entities/Link';
import Document from './entities/Document';

const mount = document.querySelector('[data-mount-test]');

const onSave = (id, rawContentState) => {
    const serialised = JSON.stringify(rawContentState);
    sessionStorage.setItem(`test:contentState:${id}`, serialised);
};

const editors = (
    <div>
        <DraftailEditor
            rawContentState={
                JSON.parse(sessionStorage.getItem('test:contentState:1')) ||
                null
            }
            onSave={onSave.bind(null, 1)}
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
        <DraftailEditor
            rawContentState={
                JSON.parse(sessionStorage.getItem('test:contentState:2')) ||
                null
            }
            onSave={onSave.bind(null, 2)}
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

ReactDOM.render(editors, mount);
