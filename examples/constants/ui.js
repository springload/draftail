import React from 'react';

import { INLINE_STYLE, BLOCK_TYPE, ENTITY_TYPE } from '../../lib';

import DocumentSource from '../sources/DocumentSource';
import LinkSource from '../sources/LinkSource';
import ImageSource from '../sources/ImageSource';
import EmbedSource from '../sources/EmbedSource';

import Link from '../entities/Link';
import Document from '../entities/Document';

import EmbedBlock from '../blocks/EmbedBlock';
import ImageBlock from '../blocks/ImageBlock';

import FontIcon from '../components/FontIcon';

export const DOCUMENT_ICON = <FontIcon icon="document" />;
export const EMBED_ICON = <FontIcon icon="embed" />;

export const INLINE_CONTROL = {
    BOLD: { type: INLINE_STYLE.BOLD, icon: '#icon-bold' },
    ITALIC: { type: INLINE_STYLE.ITALIC, icon: '#icon-italic' },
    CODE: { type: INLINE_STYLE.CODE },
    UNDERLINE: { type: INLINE_STYLE.UNDERLINE, icon: '#icon-underline' },
    STRIKETHROUGH: {
        type: INLINE_STYLE.STRIKETHROUGH,
        icon: '#icon-strikethrough',
    },
    MARK: { type: INLINE_STYLE.MARK, icon: '#icon-info' },
    QUOTATION: { type: INLINE_STYLE.QUOTATION, icon: '#icon-quotes-right' },
    SMALL: { type: INLINE_STYLE.SMALL, icon: '#icon-font-size' },
    SAMPLE: { type: INLINE_STYLE.SAMPLE, icon: '#icon-lab' },
    INSERT: { type: INLINE_STYLE.INSERT, label: '+' },
    DELETE: { type: INLINE_STYLE.DELETE, label: '-' },
    KEYBOARD: { type: INLINE_STYLE.KEYBOARD },
    SUPERSCRIPT: { type: INLINE_STYLE.SUPERSCRIPT, icon: '#icon-superscript' },
    SUBSCRIPT: { type: INLINE_STYLE.SUBSCRIPT, icon: '#icon-subscript' },
};

export const BLOCK_CONTROL = {
    UNSTYLED: { type: BLOCK_TYPE.UNSTYLED },
    HEADER_ONE: { type: BLOCK_TYPE.HEADER_ONE },
    HEADER_TWO: { type: BLOCK_TYPE.HEADER_TWO },
    HEADER_THREE: { type: BLOCK_TYPE.HEADER_THREE },
    HEADER_FOUR: { type: BLOCK_TYPE.HEADER_FOUR },
    HEADER_FIVE: { type: BLOCK_TYPE.HEADER_FIVE },
    HEADER_SIX: { type: BLOCK_TYPE.HEADER_SIX },
    UNORDERED_LIST_ITEM: {
        type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
        icon: '#icon-list-ul',
    },
    ORDERED_LIST_ITEM: {
        type: BLOCK_TYPE.ORDERED_LIST_ITEM,
        icon: '#icon-list-ol',
    },
    BLOCKQUOTE: { type: BLOCK_TYPE.BLOCKQUOTE, icon: '#icon-openquote' },
    CODE: { type: BLOCK_TYPE.CODE },
};

export const ENTITY_CONTROL = {
    LINK: {
        type: ENTITY_TYPE.LINK,
        icon: '#icon-link',
        source: LinkSource,
        decorator: Link,
        attributes: ['url'],
        whitelist: {
            href: '^(?!#)',
        },
    },
    IMAGE: {
        type: ENTITY_TYPE.IMAGE,
        icon: '#icon-image',
        source: ImageSource,
        block: ImageBlock,
        attributes: ['src', 'alt'],
        whitelist: {
            src: '^http',
        },
    },
    EMBED: {
        type: 'EMBED',
        description: 'Embed',
        icon: EMBED_ICON,
        source: EmbedSource,
        block: EmbedBlock,
        attributes: ['url', 'title', 'thumbnail'],
    },

    DOCUMENT: {
        type: 'DOCUMENT',
        icon: DOCUMENT_ICON,
        description: 'Document',
        source: DocumentSource,
        decorator: Document,
        attributes: ['url'],
    },
};
