import React from 'react';
import ReactDOM from 'react-dom';

import { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE } from '../lib';

import LinkSource from './sources/LinkSource';
import ImageSource from './sources/ImageSource';
import EmbedSource from './sources/EmbedSource';

import MediaBlock from './blocks/MediaBlock';

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
            new PrismDecorator({ defaultLanguage: 'javascript' }),
            {
                type: ENTITY_TYPE.LINK,
                source: LinkSource,
                decorator: Link,
            },
            {
                type: ENTITY_TYPE.IMAGE,
                source: ImageSource,
                block: MediaBlock,
                imageFormats: [],
            },
            {
                type: 'EMBED',
                source: EmbedSource,
                block: MediaBlock,
            },
        ]}
        blockTypes={[
            { type: BLOCK_TYPE.HEADER_TWO },
            { type: BLOCK_TYPE.HEADER_THREE },
            { type: BLOCK_TYPE.BLOCKQUOTE },
            { type: BLOCK_TYPE.CODE },
            { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
        ]}
        inlineStyles={[
            { type: INLINE_STYLE.BOLD },
            { type: INLINE_STYLE.ITALIC },
            { type: INLINE_STYLE.KEYBOARD },
        ]}
    />
);

ReactDOM.render(editor, document.querySelector('[data-mount-index]'));
