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
};

const editor = (
    <DraftailEditor
        name="test"
        value="{}"
        options={options}
    />
);

ReactDOM.render(editor, mount);
