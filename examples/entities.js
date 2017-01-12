import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { ENTITY_TYPE, BLOCK_TYPE } from '../lib';

// =============================================================================
// A `Source` provides a wrapper around whatever chooser you're using.
// All it needs to know about is when the value is updated so it can close.
// =============================================================================

import BasicLinkSource from './sources/BasicLinkSource';
import BasicDocumentSource from './sources/BasicDocumentSource';

import Link, { findLinkEntities } from './entities/Link';
import Document, { findDocumentEntities } from './entities/Document';

const mount = document.querySelector('[data-mount-entities]');

const options = {
    enableHorizontalRule: true,
    enableLineBreak: true,
    modelPickerOptions: [],
    MODEL: ENTITY_TYPE.MODEL,
    imageFormats: [],
    // Modals and other external sources of data
    mediaControls: [
        // {
        //     entity: ENTITY_TYPE.IMAGE,
        //     label: 'Image',
        //     icon: 'icon-image',
        // },
        // {
        //     entity: ENTITY_TYPE.EMBED,
        //     label: 'Embed',
        //     icon: 'icon-media',
        // },
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
        { entity: ENTITY_TYPE.DOCUMENT, control: BasicDocumentSource },
        // { entity: ENTITY_TYPE.MODEL, control: GenericModelSource },
        // { entity: ENTITY_TYPE.IMAGE, control: BasicImageSource },
        // { entity: ENTITY_TYPE.EMBED, control: BasicEmbedSource },
    ],
    // In-line decorators that format text in interesting ways.
    decorators: [
        { strategy: findLinkEntities, component: Link },
        { strategy: findDocumentEntities, component: Document },
        // { strategy: findModelEntities, component: Model },
    ],
    BLOCK_TYPES: [
        { label: 'H2', style: BLOCK_TYPE.HEADER_TWO },
        { label: 'H3', style: BLOCK_TYPE.HEADER_THREE },
        { label: 'Blockquote', style: BLOCK_TYPE.BLOCKQUOTE, icon: 'icon-openquote' },
    ],

    INLINE_STYLES: [],
};

const saveField = document.createElement('input');
saveField.type = 'hidden';
mount.parentNode.appendChild(saveField);

const onSave = (rawContentState) => {
    const serialised = JSON.stringify(rawContentState);
    saveField.value = serialised;
};

const rawContentState = {
    entityMap: {
        0: {
            type: 'DOCUMENT',
            mutability: 'MUTABLE',
            data: {
                url: 'https://www.example.com/example.pdf',
                title: 'Kritik der reinen Vernunft',
            },
        },
        1: {
            type: 'LINK',
            mutability: 'MUTABLE',
            data: {
                url: 'http://example.com/',
            },
        },
    },
    blocks: [
        {
            key: '4s66d',
            text: 'Solving human problems, with digital experience.',
            type: 'header-three',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
                {
                    offset: 29,
                    length: 18,
                    key: 0,
                },
            ],
            data: {},
        },
        {
            key: 'b3pmj',
            text: 'We build digital websites and applications that drive measurable change and help our clients\' businesses grow. Let us help yours!',
            type: 'blockquote',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
                {
                    offset: 111,
                    length: 18,
                    key: 1,
                },
            ],
            data: {},
        },
    ],
};

const editor = (
    <DraftailEditor
        rawContentState={rawContentState}
        options={options}
        onSave={onSave}
    />
);

ReactDOM.render(editor, mount);
