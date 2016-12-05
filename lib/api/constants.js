import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

// Originally from https://github.com/draft-js-utils/draft-js-utils/blob/master/src/Constants.js.
export const BLOCK_TYPE = {
    // This is used to represent a normal text block (paragraph).
    UNSTYLED: 'unstyled',
    HEADER_ONE: 'header-one',
    HEADER_TWO: 'header-two',
    HEADER_THREE: 'header-three',
    HEADER_FOUR: 'header-four',
    HEADER_FIVE: 'header-five',
    HEADER_SIX: 'header-six',
    UNORDERED_LIST_ITEM: 'unordered-list-item',
    ORDERED_LIST_ITEM: 'ordered-list-item',
    BLOCKQUOTE: 'blockquote',
    PULLQUOTE: 'pullquote',
    CODE: 'code-block',
    ATOMIC: 'atomic',
    // HR block.
    BREAK: 'atomic:break',
};

// Originally from https://github.com/draft-js-utils/draft-js-utils/blob/master/src/Constants.js.
export const ENTITY_TYPE = {
    LINK: 'LINK',
    IMAGE: 'IMAGE',
    DOCUMENT: 'DOCUMENT',
};

// Originally from https://github.com/draft-js-utils/draft-js-utils/blob/master/src/Constants.js.
export const INLINE_STYLE = {
    BOLD: 'BOLD',
    CODE: 'CODE',
    ITALIC: 'ITALIC',
    STRIKETHROUGH: 'STRIKETHROUGH',
    UNDERLINE: 'UNDERLINE',
};

const renderMap = {};

renderMap[BLOCK_TYPE.BREAK] = { element: 'div' };

export const BlockRenderMap = Map(renderMap).merge(DefaultDraftBlockRenderMap);
