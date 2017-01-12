import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from '../lib';

// =============================================================================
// A `Source` provides a wrapper around whatever chooser you're using.
// All it needs to know about is when the value is updated so it can close.
// =============================================================================

// import WagtailImageSource from './sources/WagtailImageSource';
// import WagtailDocumentSource from './sources/WagtailDocumentSource';
// import GenericModelSource from './sources/GenericModelSource';
import BasicLinkSource from './sources/BasicLinkSource';
import BasicImageSource from './sources/BasicImageSource';
import BasicEmbedSource from './sources/BasicEmbedSource';

import Link, { findLinkEntities } from './entities/Link';
// import Document, { findDocumentEntities } from './entities/Document';
// import Model, { findModelEntities } from './entities/Model';

const mount = document.querySelector('[data-mount-test]');

const options = {
    enableHorizontalRule: true,
    enableLineBreak: true,
    modelPickerOptions: [],
    MODEL: ENTITY_TYPE.MODEL,
    imageFormats: [],
    // Modals and other external sources of data
    mediaControls: [
        {
            entity: ENTITY_TYPE.IMAGE,
            label: 'Image',
            icon: 'icon-image',
        },
        {
            entity: ENTITY_TYPE.EMBED,
            label: 'Embed',
            icon: 'icon-media',
        },
    ],
    dialogControls: [
        {
            entity: ENTITY_TYPE.LINK,
            label: 'Link',
            icon: 'icon-link',
        },
        {
            entity: ENTITY_TYPE.DOCUMENT,
            label: 'Document',
            icon: 'icon-doc-full',
        },
    ],
    sources: [
        { entity: ENTITY_TYPE.LINK, control: BasicLinkSource },
        // { entity: ENTITY_TYPE.DOCUMENT, control: WagtailDocumentSource },
        // { entity: ENTITY_TYPE.MODEL, control: GenericModelSource },
        { entity: ENTITY_TYPE.IMAGE, control: BasicImageSource },
        { entity: ENTITY_TYPE.EMBED, control: BasicEmbedSource },
    ],
    // In-line decorators that format text in interesting ways.
    decorators: [
        { strategy: findLinkEntities, component: Link },
        // { strategy: findModelEntities, component: Model },
        // { strategy: findDocumentEntities, component: Document },
    ],
    BLOCK_TYPES: [
        { label: 'H2', style: BLOCK_TYPE.HEADER_TWO },
        { label: 'H3', style: BLOCK_TYPE.HEADER_THREE },
        { label: 'H4', style: BLOCK_TYPE.HEADER_FOUR },
        { label: 'H5', style: BLOCK_TYPE.HEADER_FIVE },
        { label: 'Intro', style: 'intro-text', icon: 'icon-bin', element: 'pre', className: 'u-blue' },
        { label: 'Blockquote', style: BLOCK_TYPE.BLOCKQUOTE, icon: 'icon-openquote' },
        { label: 'UL', style: BLOCK_TYPE.UNORDERED_LIST_ITEM, icon: 'icon-list-ul' },
        { label: 'OL', style: BLOCK_TYPE.ORDERED_LIST_ITEM, icon: 'icon-list-ol' },
    ],

    INLINE_STYLES: [
        { label: 'Bold', style: INLINE_STYLE.BOLD, icon: 'icon-bold' },
        { label: 'Italic', style: INLINE_STYLE.ITALIC, icon: 'icon-italic' },
        { label: 'Underline', style: INLINE_STYLE.UNDERLINE, icon: 'icon-underline' },
        { label: 'Monospace', style: INLINE_STYLE.CODE, icon: 'icon-pacman' },
        { label: 'Strikethrough', style: INLINE_STYLE.STRIKETHROUGH, icon: 'icon-strikethrough' },
    ],
};

const onSave = (rawContentState) => {
    const serialised = JSON.stringify(rawContentState);
    sessionStorage.setItem('entities:rawContentState', serialised);
};

const editor = (
    <DraftailEditor
        rawContentState={JSON.parse(sessionStorage.getItem('entities:rawContentState')) || {}}
        options={options}
        onSave={onSave}
    />
);

ReactDOM.render(editor, mount);
