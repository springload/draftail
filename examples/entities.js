import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { ENTITY_TYPE, BLOCK_TYPE } from '../lib';

// =============================================================================
// A `Source` provides a wrapper around whatever chooser you're using.
// All it needs to know about is when the value is updated so it can close.
// =============================================================================

import LinkSource from './sources/LinkSource';
import DocumentSource from './sources/DocumentSource';

import Link from './entities/Link';
import Document from './entities/Document';

const mount = document.querySelector('[data-mount-entities]');

const saveField = document.createElement('input');
saveField.type = 'hidden';
mount.parentNode.appendChild(saveField);

const onSave = rawContentState => {
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
            text:
                "We build digital websites and applications that drive measurable change and help our clients' businesses grow. Let us help yours!",
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
        onSave={onSave}
        entityTypes={[
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
                type: BLOCK_TYPE.BLOCKQUOTE,
                description: 'Blockquote',
                icon: 'icon-openquote',
            },
        ]}
    />
);

ReactDOM.render(editor, mount);
