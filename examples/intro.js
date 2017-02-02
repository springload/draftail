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
const rawContentState = { "entityMap": { "0": { "type": "LINK", "mutability": "MUTABLE", "data": { "url": "https://github.com/facebook/draft-js" } }, "1": { "type": "LINK", "mutability": "MUTABLE", "data": { "url": "https://support.google.com/docs/answer/179738" } }, "2": { "type": "LINK", "mutability": "MUTABLE", "data": { "url": "https://github.com/springload/draftail/tree/master/docs#keyboard-shortcuts" } }, "3": { "type": "LINK", "mutability": "MUTABLE", "data": { "url": "https://www.springload.co.nz/" } }, "4": { "type": "DOCUMENT", "mutability": "MUTABLE", "data": { "url": "http://www.example.com/example.pdf", "title": "Kritik der reinen Vernunft" } }, "5": { "type": "IMAGE", "mutability": "IMMUTABLE", "data": { "altText": "Test image alt text", "alignment": "left", "src": "https://cdn.rawgit.com/springload/draftail/c4aa1718a9b350882bd281883a52f80c4ad642e9/examples/assets/example-image.png" } }, "6": { "type": "LINK", "mutability": "MUTABLE", "data": { "url": "http://embed.ly/" } }, "7": { "type": "EMBED", "mutability": "IMMUTABLE", "data": { "url": "http://www.youtube.com/watch?v=feUYwoLhE_4", "title": "React.js Conf 2016 - Isaac Salier-Hellendag - Rich Text Editing with React", "providerName": "YouTube", "authorName": "Facebook Developers", "thumbnail": "https://i.ytimg.com/vi/feUYwoLhE_4/hqdefault.jpg" } }, "8": { "type": "LINK", "mutability": "MUTABLE", "data": { "url": "https://www.springload.co.nz/" } }, "9": { "type": "DOCUMENT", "mutability": "MUTABLE", "data": { "url": "http://www.example.com/example.pdf", "title": "Kritik der reinen Vernunft" } } }, "blocks": [{ "key": "b0ei9", "text": "Draftail is a rich text editor built with Draft.js", "type": "header-two", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 42, "length": 8, "key": 0 }], "data": {} }, { "key": "74al", "text": "Try it out by editing this text!", "type": "blockquote", "depth": 0, "inlineStyleRanges": [{ "offset": 22, "length": 9, "style": "BOLD" }], "entityRanges": [], "data": {} }, { "key": "7htbd", "text": "Features 📝🍸", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "32lnv", "text": "Draftail aims for a mouse-free, keyboard-centric experience. Most formatting can be done by using common keyboard shortcuts, inspired by Google Docs. ", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 137, "length": 11, "key": 1 }], "data": {} }, { "key": "7rd57", "text": "Here are important features worth highlighting:", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "2mhgt", "text": "Support for keyboard shortcuts.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 12, "length": 19, "key": 2 }], "data": {} }, { "key": "f4gp0", "text": "Autolists – start a line with - , * , 1.  to create a list item.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [{ "offset": 30, "length": 2, "style": "CODE" }, { "offset": 34, "length": 2, "style": "CODE" }, { "offset": 38, "length": 3, "style": "CODE" }], "entityRanges": [], "data": {} }, { "key": "cum79", "text": "Undo / redo – until the end of times.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "3cnm0", "text": "Common text types: headings, paragraphs, quotes, lists.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "5qfeb", "text": "Common text styles: Bold, Italic, Underline, Monospace, Strikethrough ", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [{ "offset": 20, "length": 4, "style": "BOLD" }, { "offset": 26, "length": 6, "style": "ITALIC" }, { "offset": 34, "length": 9, "style": "UNDERLINE" }, { "offset": 45, "length": 9, "style": "CODE" }, { "offset": 56, "length": 13, "style": "STRIKETHROUGH" }], "entityRanges": [], "data": {} }, { "key": "8br3k", "text": "Built-in Link and Document controls.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 9, "length": 4, "key": 3 }, { "offset": 18, "length": 8, "key": 4 }], "data": {} }, { "key": "2j2hl", "text": "Built-in Image and Embed blocks.", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "3tbpg", "text": " ", "type": "atomic", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 0, "length": 1, "key": 5 }], "data": {} }, { "key": "eb00n", "text": "The Embeds in this example are powered by Embedly:", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 42, "length": 7, "key": 6 }], "data": {} }, { "key": "f7s8c", "text": " ", "type": "atomic", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 0, "length": 1, "key": 7 }], "data": {} }, { "key": "5t6c9", "text": "Try out some keyboard shortcuts:", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "9k2d7", "text": "<Put a list of common shortcuts here>", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [{ "offset": 0, "length": 37, "style": "ITALIC" }], "entityRanges": [], "data": {} }, { "key": "1sggt", "text": "For developers 🚀", "type": "header-three", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "2nb2a", "text": "Draftail is meant to be used in scenarios where not all formatting should be available, and where custom formatting can be necessary. Available formats, built-in and custom, can be specificed declaratively for each editor instance.", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "26mu7", "text": "Built-in", "type": "header-four", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "9mda0", "text": "Block types: H1, H2, H3, H4, H5, H6, Blockquote, Code, UL, OL, P", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "6h6as", "text": "Inline styles: Bold, Italic, Underline, Monospace, Strikethrough", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [{ "offset": 15, "length": 4, "style": "BOLD" }, { "offset": 21, "length": 6, "style": "ITALIC" }, { "offset": 29, "length": 9, "style": "UNDERLINE" }, { "offset": 40, "length": 9, "style": "CODE" }, { "offset": 51, "length": 13, "style": "STRIKETHROUGH" }], "entityRanges": [], "data": {} }, { "key": "3haur", "text": "Entities: Images, Embeds, (Links, Documents)", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [{ "offset": 27, "length": 5, "key": 8 }, { "offset": 34, "length": 9, "key": 9 }], "data": {} }, { "key": "dnji2", "text": "And HR, BR\nas special cases", "type": "unordered-list-item", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "9l23l", "text": "Custom block types", "type": "header-four", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "6h166", "text": "New block types can be created by giving them a unique type, a label and an icon (for the toolbar), and element and className attributes:", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "2d27l", "text": "{ label: 'T&C', type: 'terms', element: 'div', className: 'terms' },", "type": "code-block", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "7p4gi", "text": "Custom inline styles", "type": "header-four", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "biqf8", "text": "TODO", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "2iad", "text": "Custom entity types", "type": "header-four", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }, { "key": "28uqr", "text": "TODO", "type": "unstyled", "depth": 0, "inlineStyleRanges": [], "entityRanges": [], "data": {} }] };

const onSave = (contentState) => {
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
            { label: 'H2', type: BLOCK_TYPE.HEADER_TWO },
            { label: 'H3', type: BLOCK_TYPE.HEADER_THREE },
            { label: 'H4', type: BLOCK_TYPE.HEADER_FOUR },
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
