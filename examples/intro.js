import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from '../lib';

import BasicDocumentSource from './sources/BasicDocumentSource';
import BasicLinkSource from './sources/BasicLinkSource';
import BasicImageSource from './sources/BasicImageSource';
import BasicEmbedSource from './sources/BasicEmbedSource';

import Link, { findLinkEntities } from './entities/Link';
import Document, { findDocumentEntities } from './entities/Document';

const mount = document.querySelector('[data-mount-intro]');

// eslint-disable-next-line
const rawContentState = { "entityMap": { "0": { "type": "LINK", "mutability": "MUTABLE", "data": { "url": "https://github.com/facebook/draft-js" } }, "1": { "type": "LINK", "mutability": "MUTABLE", "data": { "url": "https://support.google.com/docs/answer/179738?co=GENIE.Platform%3DDesktop&hl=en" } }, "2": { "type": "LINK", "mutability": "MUTABLE", "data": { "url": "https://github.com/springload/draftail/tree/master/docs#keyboard-shortcuts" } } }, "blocks": [{ "key": "b0ei9", "text": "Draftail is a rich text editor built with Draft.js", "type": "header-one", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 42, "length": 8, "key": 0 }], "data": {} }, { "key": "74al", "text": "Try it out by editing this block of text!", "type": "blockquote", "depth": 0, "inlineStyleRanges": [{ "offset": 22, "length": 18, "style": "BOLD" }], "entityRanges": [], "data": {} }, { "key": "7e1cf", "text": "Features 📝🍸", "type": "header-two", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "32lnv", "text": "The editor has a strong focus on keyboard usage. Most formatting can be done by using common keyboard shortcuts, inspired by Google Docs. ", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 125, "length": 11, "key": 1 }], "data": {} }, { "key": "7rd57", "text": "Here are important features worth highlighting:", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "2mhgt", "text": "Support for keyboard shortcuts.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 12, "length": 19, "key": 2 }], "data": {} }, { "key": "f4gp0", "text": "Autolists – start a line with - , * , 1.  to create a list item.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [{ "offset": 30, "length": 2, "style": "CODE" }, { "offset": 34, "length": 2, "style": "CODE" }, { "offset": 38, "length": 3, "style": "CODE" }], "entityRanges": [], "data": {} }, { "key": "cum79", "text": "Undo / redo – until the end of times.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "3cnm0", "text": "Common block types available out of the box.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "5qfeb", "text": "Common text styles available out of the box.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "8br3k", "text": "Built-in Image and Embed blocks.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "ibap", "text": "Try out some keyboard shortcuts", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "9k2d7", "text": "<Put a list of common shortcuts here>", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "1sggt", "text": "For developers 🚀", "type": "header-two", "depth": 0, "inlineStyleRanges": [{ "offset": 15, "length": 1, "style": "BOLD" }], "entityRanges": [], "data": {} }, { "key": "2nb2a", "text": "The editor is meant to be used in scenarios where not all formatting should be available, and where custom formatting can be necessary. Available text formats, built-in and custom, can be specificed declaratively for each editor instance.", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "26mu7", "text": "Built-in", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "9mda0", "text": "Block types: H1, H2, H3, H4, H5, H6, Blockquote, Code, UL, OL, P", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "6h6as", "text": "Inline styles: Strong, Italic, Underline, Monospace, Strikethrough", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "3haur", "text": "Entities: Images, Embeds, (Links, Documents)", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "dnji2", "text": "And HR, BR as special cases", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "9l23l", "text": "Custom block types", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "6h166", "text": "New block types can be created by giving them a unique type, a label and an icon (for the toolbar), and element and className attributes:", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "2d27l", "text": "{ label: 'T&C', type: 'terms', element: 'div', className: 'terms' },", "type": "code-block", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "7p4gi", "text": "Custom inline styles", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "biqf8", "text": "TODO", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "2iad", "text": "Custom entity types", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "28uqr", "text": "TODO", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }] };

const onSave = (contentState) => {
    console.log('Save intro example:', contentState);
    window.introContentState = contentState;
    sessionStorage.setItem('intro:rawContentState', JSON.stringify(contentState));
};

const editor = (
    <DraftailEditor
        rawContentState={rawContentState}
        onSave={onSave}
        enableHorizontalRule={true}
        enableLineBreak={true}
        entityTypes={[
            { label: 'Image', type: ENTITY_TYPE.IMAGE, icon: 'icon-image', control: BasicImageSource, imageFormats: [] },
            { label: 'Embed', type: ENTITY_TYPE.EMBED, icon: 'icon-media', control: BasicEmbedSource },
            { label: 'Link', type: ENTITY_TYPE.LINK, icon: 'icon-link', control: BasicLinkSource, strategy: findLinkEntities, component: Link },
            { label: 'Document', type: ENTITY_TYPE.DOCUMENT, icon: 'icon-doc-full', control: BasicDocumentSource, strategy: findDocumentEntities, component: Document },
            // { label: 'Location', type: 'LOCATION', icon: 'icon-location', control: GenericModelSource, strategy: findModelEntities, component: Model },
        ]}
        blockTypes={[
            { label: 'H1', type: BLOCK_TYPE.HEADER_ONE },
            { label: 'H2', type: BLOCK_TYPE.HEADER_TWO },
            { label: 'H3', type: BLOCK_TYPE.HEADER_THREE },
            { label: 'H4', type: BLOCK_TYPE.HEADER_FOUR },
            { label: 'H5', type: BLOCK_TYPE.HEADER_FIVE },
            { label: 'H6', type: BLOCK_TYPE.HEADER_SIX },
            { label: 'Blockquote', type: BLOCK_TYPE.BLOCKQUOTE, icon: 'icon-openquote' },
            { label: 'Code', type: BLOCK_TYPE.CODE, icon: 'icon-cog' },
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
