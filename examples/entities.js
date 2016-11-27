import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor from '../lib';

// =============================================================================
// A `Source` provides a wrapper around whatever chooser you're using.
// All it needs to know about is when the value is updated so it can close.
// =============================================================================

// import WagtailLinkSource from './sources/WagtailLinkSource';
// import WagtailImageSource from './sources/WagtailImageSource';
// import WagtailDocumentSource from './sources/WagtailDocumentSource';
// import GenericModelSource from './sources/GenericModelSource';
// import WagtailEmbedSource from './sources/WagtailEmbedSource';
import BasicLinkSource from './sources/BasicLinkSource';

import Link, { LINK, findLinkEntities } from './entities/Link';
// import Document, { DOCUMENT, findDocumentEntities } from './entities/Document';
// import Model, { MODEL, findModelEntities } from './entities/Model';

const DOCUMENT = 'DOCUMENT';
const MODEL = 'MODEL';
const WAGTAIL_IMAGE = 'WAGTAIL_IMAGE';
const WAGTAIL_EMBED = 'WAGTAIL_EMBED';

const mount = document.querySelector('[data-mount-entities]');

const options = {
    modelPickerOptions: [],
    MODEL: MODEL,
    imageFormats: [],
    // Modals and other external sources of data
    mediaControls: [
        {
            entity: WAGTAIL_IMAGE,
            label: 'Image',
            icon: 'image',
        },
        {
            entity: WAGTAIL_EMBED,
            label: 'Embed',
            icon: 'media',
        },
    ],
    dialogControls: [
        {
            entity: LINK,
            label: 'Link',
            icon: 'link',
        },
        {
            entity: DOCUMENT,
            label: 'Document',
            icon: 'doc-full',
        },
    ],
    sources: [
        { entity: LINK, control: BasicLinkSource },
        // { entity: LINK, control: WagtailLinkSource },
        // { entity: DOCUMENT, control: WagtailDocumentSource },
        // { entity: MODEL, control: GenericModelSource },
        // { entity: WAGTAIL_IMAGE, control: WagtailImageSource },
        // { entity: WAGTAIL_EMBED, control: WagtailEmbedSource },
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

const saveField = document.createElement('input');
saveField.type = 'hidden';
mount.parentNode.appendChild(saveField);

const onSave = (rawContentState) => {
    const serialised = JSON.stringify(rawContentState);
    saveField.value = serialised;
    localStorage.setItem('entities:rawContentState', serialised);
};

const editor = (
    <DraftailEditor
        rawContentState={JSON.parse(localStorage.getItem('entities:rawContentState')) || {}}
        options={options}
        onSave={onSave}
    />
);

ReactDOM.render(editor, mount);
