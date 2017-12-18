import React from 'react';
import ReactDOM from 'react-dom';

import { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from '../lib';

import LinkSource from './sources/LinkSource';
import ImageSource from './sources/ImageSource';
import EmbedSource from './sources/EmbedSource';

import Link from './entities/Link';

import indexContentState from './utils/indexContentState';

import PrismDecorator from './components/PrismDecorator';
import EditorWrapper from './components/EditorWrapper';

const editor = (
    <EditorWrapper
        id="index"
        rawContentState={indexContentState}
        placeholder="Write here…"
        enableHorizontalRule={true}
        enableLineBreak={true}
        stripPastedStyles={false}
        entityTypes={[
            new PrismDecorator({
                defaultLanguage: 'javascript',
            }),
            {
                type: ENTITY_TYPE.LINK,
                description: 'Link',
                icon: 'icon-link',
                source: LinkSource,
                decorator: Link,
            },
            {
                type: ENTITY_TYPE.IMAGE,
                description: 'Image',
                icon: 'icon-image',
                source: ImageSource,
                imageFormats: [],
            },
            {
                type: ENTITY_TYPE.EMBED,
                description: 'Embed',
                icon: 'icon-media',
                source: EmbedSource,
            },
        ]}
        blockTypes={[
            {
                type: BLOCK_TYPE.HEADER_TWO,
                label: 'H2',
                description: 'Heading 2',
            },
            {
                type: BLOCK_TYPE.HEADER_THREE,
                label: 'H3',
                description: 'Heading 3',
            },
            {
                type: BLOCK_TYPE.BLOCKQUOTE,
                description: 'Blockquote',
                icon: 'icon-openquote',
            },
            {
                label: '{\u2009}',
                type: BLOCK_TYPE.CODE,
                description: 'Code',
            },
            {
                type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
                description: 'Bulleted list',
                icon: 'icon-list-ul',
            },
        ]}
        inlineStyles={[
            { type: INLINE_STYLE.BOLD, description: 'Bold', icon: 'icon-bold' },
            {
                type: INLINE_STYLE.ITALIC,
                description: 'Italic',
                icon: 'icon-italic',
            },
            {
                type: INLINE_STYLE.KEYBOARD,
                description: 'Keyboard shortcut',
                label: '⌘',
            },
        ]}
    />
);

ReactDOM.render(editor, document.querySelector('[data-mount-index]'));
