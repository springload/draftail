import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { ENTITY_TYPE } from '../lib';

// =============================================================================
// A `Source` provides a wrapper around whatever chooser you're using.
// All it needs to know about is when the value is updated so it can close.
// =============================================================================

import BasicLinkSource from './sources/BasicLinkSource';

import Link, { findLinkEntities } from './entities/Link';

const mount = document.querySelector('[data-mount-entities]');

const options = {
    modelPickerOptions: [],
    MODEL: ENTITY_TYPE.MODEL,
    imageFormats: [],
    // Modals and other external sources of data
    mediaControls: [
        // {
        //     entity: ENTITY_TYPE.WAGTAIL_IMAGE,
        //     label: 'Image',
        //     icon: 'image',
        // },
        // {
        //     entity: ENTITY_TYPE.WAGTAIL_EMBED,
        //     label: 'Embed',
        //     icon: 'media',
        // },
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
};

const editor = (
    <DraftailEditor
        rawContentState={{}}
        options={options}
        onSave={onSave}
    />
);

ReactDOM.render(editor, mount);
