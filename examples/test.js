import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { ENTITY_TYPE } from '../lib';

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
            icon: 'image',
        },
        {
            entity: ENTITY_TYPE.EMBED,
            label: 'Embed',
            icon: 'media',
        },
    ],
    dialogControls: [
        {
            entity: ENTITY_TYPE.LINK,
            label: 'Link',
            icon: 'link',
        },
        {
            entity: ENTITY_TYPE.DOCUMENT,
            label: 'Document',
            icon: 'doc-full',
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
        { label: 'H2', style: 'header-two' },
        { label: 'H3', style: 'header-three' },
        { label: 'H4', style: 'header-four' },
        { label: 'H5', style: 'header-five' },
        { label: 'Intro', style: 'intro-text', icon: 'bin', element: 'pre', className: 'u-blue' },
        { label: 'Blockquote', style: 'blockquote', icon: 'openquote' },
        { label: 'UL', style: 'unordered-list-item', icon: 'list-ul' },
        { label: 'OL', style: 'ordered-list-item', icon: 'list-ol' },
    ],

    INLINE_STYLES: [
        { label: 'Bold', style: 'BOLD', icon: 'bold' },
        { label: 'Italic', style: 'ITALIC', icon: 'italic' },
        // {label: 'Underline', style: 'UNDERLINE'},
        // {label: 'Monospace', style: 'CODE'},
        // {label: 'Strikethrough', style: 'STRIKETHROUGH'},
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
