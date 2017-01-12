
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
    CODE: 'code-block',
    ATOMIC: 'atomic',
};

// Originally from https://github.com/draft-js-utils/draft-js-utils/blob/master/src/Constants.js.
export const ENTITY_TYPE = {
    LINK: 'LINK',
    DOCUMENT: 'DOCUMENT',
    MODEL: 'MODEL',
    IMAGE: 'IMAGE',
    EMBED: 'EMBED',
    HORIZONTAL_RULE: 'HORIZONTAL_RULE',
};

// Originally from https://github.com/draft-js-utils/draft-js-utils/blob/master/src/Constants.js.
export const INLINE_STYLE = {
    BOLD: 'BOLD',
    ITALIC: 'ITALIC',
    CODE: 'CODE',
    UNDERLINE: 'UNDERLINE',
    STRIKETHROUGH: 'STRIKETHROUGH',
};

// Originally from https://github.com/facebook/draft-js/blob/master/src/component/utils/getDefaultKeyBinding.js.
export const KEY_CODES = {
    B: 66,
    U: 85,
    J: 74,
    I: 73,
    5: 53,
};
