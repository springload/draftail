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

const onSave = (contentState) => {
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
            { label: 'Image', type: ENTITY_TYPE.IMAGE, icon: 'icon-image', source: ImageSource, imageFormats: [] },
            { label: 'Embed', type: ENTITY_TYPE.EMBED, icon: 'icon-media', source: EmbedSource },
            { label: 'Link', type: ENTITY_TYPE.LINK, icon: 'icon-link', source: LinkSource, decorator: Link },
            { label: 'Document', type: ENTITY_TYPE.DOCUMENT, icon: 'icon-doc-full', source: DocumentSource, decorator: Document },
        ]}
        blockTypes={[
            { label: 'H2', type: BLOCK_TYPE.HEADER_TWO },
            { label: 'H3', type: BLOCK_TYPE.HEADER_THREE },
            { label: 'H4', type: BLOCK_TYPE.HEADER_FOUR },
            { label: 'Blockquote', type: BLOCK_TYPE.BLOCKQUOTE, icon: 'icon-openquote' },
            { label: 'Code', type: BLOCK_TYPE.CODE, icon: 'icon-cog' },
            { label: 'UL', type: BLOCK_TYPE.UNORDERED_LIST_ITEM, icon: 'icon-list-ul' },
            { label: 'OL', type: BLOCK_TYPE.ORDERED_LIST_ITEM, icon: 'icon-list-ol' },
            { label: 'Tiny', type: 'tiny-text', element: 'div', className: 'u-tinytext' },
        ]}
        inlineStyles={[
            { label: 'Bold', type: INLINE_STYLE.BOLD, icon: 'icon-bold' },
            { label: 'Italic', type: INLINE_STYLE.ITALIC, icon: 'icon-italic' },
            { label: 'Underline', type: INLINE_STYLE.UNDERLINE, icon: 'icon-underline' },
            { label: 'Monospace', type: INLINE_STYLE.CODE, icon: 'icon-pacman' },
            { label: 'Strikethrough', type: INLINE_STYLE.STRIKETHROUGH, icon: 'icon-strikethrough' },
        ]}
    />
);

ReactDOM.render(editor, mount);
