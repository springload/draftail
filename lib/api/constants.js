import { DefaultDraftInlineStyle } from 'draft-js';

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
    MARK: 'MARK',
    QUOTATION: 'QUOTATION',
    SMALL: 'SMALL',
    SAMPLE: 'SAMPLE',
    INSERT: 'INSERT',
    DELETE: 'DELETE',
    KEYBOARD: 'KEYBOARD',
    SUPERSCRIPT: 'SUPERSCRIPT',
    SUBSCRIPT: 'SUBSCRIPT',
};

export const FONT_FAMILY_MONOSPACE =
    'Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif';

export const CUSTOM_STYLE_MAP = {
    [INLINE_STYLE.BOLD]: DefaultDraftInlineStyle[INLINE_STYLE.BOLD],
    [INLINE_STYLE.ITALIC]: DefaultDraftInlineStyle[INLINE_STYLE.ITALIC],
    [INLINE_STYLE.STRIKETHROUGH]:
        DefaultDraftInlineStyle[INLINE_STYLE.STRIKETHROUGH],
    [INLINE_STYLE.UNDERLINE]: DefaultDraftInlineStyle[INLINE_STYLE.UNDERLINE],

    [INLINE_STYLE.CODE]: {
        padding: '0.2em 0.3125em',
        margin: '0',
        fontSize: '85%',
        backgroundColor: 'rgba(27, 31, 35, 0.05)',
        fontFamily: FONT_FAMILY_MONOSPACE,
        borderRadius: '3px',
    },

    [INLINE_STYLE.MARK]: {
        backgroundColor: 'yellow',
    },
    [INLINE_STYLE.QUOTATION]: {
        fontStyle: 'italic',
    },
    [INLINE_STYLE.SMALL]: {
        fontSize: 'smaller',
    },
    [INLINE_STYLE.SAMPLE]: {
        fontFamily: FONT_FAMILY_MONOSPACE,
    },
    [INLINE_STYLE.INSERT]: {
        textDecoration: 'underline',
    },
    [INLINE_STYLE.DELETE]: {
        textDecoration: 'line-through',
    },
    [INLINE_STYLE.KEYBOARD]: {
        fontFamily: FONT_FAMILY_MONOSPACE,
        padding: '3px 5px',
        fontSize: '11px',
        lineHeight: '10px',
        color: '#444d56',
        verticalAlign: 'middle',
        backgroundColor: '#fafbfc',
        border: 'solid 1px #c6cbd1',
        borderBottomColor: '#959da5',
        borderRadius: '3px',
        boxShadow: 'inset 0 -1px 0 #959da5',
    },
    [INLINE_STYLE.SUPERSCRIPT]: {
        fontSize: '80%',
        verticalAlign: 'super',
        lineHeight: '1',
    },
    [INLINE_STYLE.SUBSCRIPT]: {
        fontSize: '80%',
        verticalAlign: 'sub',
        lineHeight: '1',
    },
};

export const BR_TYPE = 'BR';

// Originally from https://github.com/facebook/draft-js/blob/master/src/component/utils/getDefaultKeyBinding.js.
export const KEY_CODES = {
    K: 75,
    B: 66,
    U: 85,
    J: 74,
    I: 73,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
};

export const KEYBOARD_SHORTCUTS = {};
KEYBOARD_SHORTCUTS[BLOCK_TYPE.UNSTYLED] = {
    other: 'Ctrl+Alt+0',
    macOS: '⌘+Option+0',
};
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_ONE] = {
    other: 'Ctrl+Alt+1',
    macOS: '⌘+Option+1',
};
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_TWO] = {
    other: 'Ctrl+Alt+2',
    macOS: '⌘+Option+2',
};
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_THREE] = {
    other: 'Ctrl+Alt+3',
    macOS: '⌘+Option+3',
};
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_FOUR] = {
    other: 'Ctrl+Alt+4',
    macOS: '⌘+Option+4',
};
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_FIVE] = {
    other: 'Ctrl+Alt+5',
    macOS: '⌘+Option+5',
};
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_SIX] = {
    other: 'Ctrl+Alt+6',
    macOS: '⌘+Option+6',
};
KEYBOARD_SHORTCUTS[BLOCK_TYPE.UNORDERED_LIST_ITEM] = {
    other: 'Ctrl+Shift+8',
    macOS: '⌘+Shift+8',
};
KEYBOARD_SHORTCUTS[BLOCK_TYPE.ORDERED_LIST_ITEM] = {
    other: 'Ctrl+Shift+7',
    macOS: '⌘+Shift+7',
};
KEYBOARD_SHORTCUTS[ENTITY_TYPE.LINK] = { other: 'Ctrl+K', macOS: '⌘+K' };
KEYBOARD_SHORTCUTS[BR_TYPE] = {
    other: 'Shift+Enter',
    macOS: 'Shift+Enter',
};
KEYBOARD_SHORTCUTS[INLINE_STYLE.BOLD] = { other: 'Ctrl+B', macOS: '⌘+B' };
KEYBOARD_SHORTCUTS[INLINE_STYLE.ITALIC] = { other: 'Ctrl+I', macOS: '⌘+I' };
KEYBOARD_SHORTCUTS[INLINE_STYLE.UNDERLINE] = {
    other: 'Ctrl+U',
    macOS: '⌘+U',
};
KEYBOARD_SHORTCUTS[INLINE_STYLE.STRIKETHROUGH] = {
    other: 'Alt+Shift+5',
    macOS: 'Option+Shift+5',
};

export const NBSP = '\u00a0';

export const HANDLED = 'handled';
export const NOT_HANDLED = 'not-handled';
