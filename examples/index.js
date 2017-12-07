import React from 'react';
import ReactDOM from 'react-dom';

import { INLINE_CONTROL, BLOCK_CONTROL, ENTITY_CONTROL } from './constants/ui';

import indexContentState from './constants/indexContentState';

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
            ENTITY_CONTROL.LINK,
            ENTITY_CONTROL.IMAGE,
            ENTITY_CONTROL.EMBED,
        ]}
        blockTypes={[
            BLOCK_CONTROL.HEADER_TWO,
            BLOCK_CONTROL.HEADER_THREE,
            BLOCK_CONTROL.BLOCKQUOTE,
            BLOCK_CONTROL.CODE,
            BLOCK_CONTROL.UNORDERED_LIST_ITEM,
        ]}
        inlineStyles={[
            INLINE_CONTROL.BOLD,
            INLINE_CONTROL.ITALIC,
            INLINE_CONTROL.KEYBOARD,
        ]}
    />
);

ReactDOM.render(editor, document.querySelector('[data-mount-index]'));
