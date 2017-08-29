import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from '../lib';

import DocumentSource from './sources/DocumentSource';
import LinkSource from './sources/LinkSource';
import ImageSource from './sources/ImageSource';
import EmbedSource from './sources/EmbedSource';

import Link from './entities/Link';
import Document from './entities/Document';

import introContentState from './utils/introContentState';

const mount = document.querySelector('[data-mount-intro]');

const onSave = contentState => {
    sessionStorage.setItem('intro:contentState', JSON.stringify(contentState));
};

const editor = (
    <DraftailEditor
        rawContentState={introContentState}
        onSave={onSave}
        placeholder="Write here…"
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
                type: BLOCK_TYPE.BLOCKQUOTE,
                icon: 'icon-openquote',
                description: 'Blockquote',
            },
            { label: 'Code', type: BLOCK_TYPE.CODE, icon: 'icon-cog' },
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
                type: 'tiny-text',
                label: 'Tiny',
                element: 'div',
                className: 'u-tinytext',
            },
        ]}
        inlineStyles={[
            { type: INLINE_STYLE.BOLD, description: 'Bold', icon: 'icon-bold' },
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
                description: 'Monospace',
                icon: 'icon-pacman',
            },
            {
                type: INLINE_STYLE.STRIKETHROUGH,
                description: 'Strikethrough',
                icon: 'icon-strikethrough',
            },
        ]}
    />
);

ReactDOM.render(editor, mount);
