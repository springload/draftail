import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from '../lib';

import BasicDocumentSource from './sources/BasicDocumentSource';
import BasicLinkSource from './sources/BasicLinkSource';
import BasicImageSource from './sources/BasicImageSource';
import BasicEmbedSource from './sources/BasicEmbedSource';

import Link, { findLinkEntities } from './entities/Link';
import Document, { findDocumentEntities } from './entities/Document';
// import Model, { findModelEntities } from './entities/Model';

const mount = document.querySelector('[data-mount-test]');

const onSave = (rawContentState) => {
    const serialised = JSON.stringify(rawContentState);
    sessionStorage.setItem('test:rawContentState', serialised);
};

const editor = (
    <DraftailEditor
        rawContentState={JSON.parse(sessionStorage.getItem('test:rawContentState')) || {}}
        onSave={onSave}
        enableHorizontalRule={true}
        enableLineBreak={true}
        entityTypes={[
            { label: 'Image', type: ENTITY_TYPE.IMAGE, icon: 'icon-image', control: BasicImageSource, imageFormats: [] },
            { label: 'Embed', type: ENTITY_TYPE.EMBED, icon: 'icon-media', control: BasicEmbedSource },
            { label: 'Link', type: ENTITY_TYPE.LINK, icon: 'icon-link', control: BasicLinkSource, strategy: findLinkEntities, component: Link },
            { label: 'Document', type: ENTITY_TYPE.DOCUMENT, icon: 'icon-doc-full', control: BasicDocumentSource, strategy: findDocumentEntities, component: Document },
            // { label: 'Model', type: ENTITY_TYPE.MODEL, icon: 'icon-cog', control: GenericModelSource, strategy: findModelEntities, component: Model },
        ]}
        blockTypes={[
            { label: 'H2', type: BLOCK_TYPE.HEADER_TWO },
            { label: 'H3', type: BLOCK_TYPE.HEADER_THREE },
            { label: 'H4', type: BLOCK_TYPE.HEADER_FOUR },
            { label: 'H5', type: BLOCK_TYPE.HEADER_FIVE },
            { label: 'Blockquote', type: BLOCK_TYPE.BLOCKQUOTE, icon: 'icon-openquote' },
            { label: 'UL', type: BLOCK_TYPE.UNORDERED_LIST_ITEM, icon: 'icon-list-ul' },
            { label: 'OL', type: BLOCK_TYPE.ORDERED_LIST_ITEM, icon: 'icon-list-ol' },
            { label: 'T&C', type: 'terms-and-conditions', element: 'div', className: 'u-smalltext' },
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
