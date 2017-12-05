import { DefaultDraftInlineStyle } from 'draft-js';

// See https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftBlockRenderMap.js
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
    // This represents a "custom" block, not for rich text, with arbitrary content.
    ATOMIC: 'atomic',
};

export const ENTITY_TYPE = {
    LINK: 'LINK',
    DOCUMENT: 'DOCUMENT',
    MODEL: 'MODEL',
    IMAGE: 'IMAGE',
    EMBED: 'EMBED',
    HORIZONTAL_RULE: 'HORIZONTAL_RULE',
};

// See https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftInlineStyle.js
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

// See https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftInlineStyle.js
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

export const UNDO_TYPE = 'undo';
export const REDO_TYPE = 'redo';

// Originally from https://github.com/facebook/draft-js/blob/master/src/component/utils/getDefaultKeyBinding.js.
export const KEY_CODES = {
    K: 75,
    B: 66,
    U: 85,
    J: 74,
    I: 73,
    X: 88,
    0: 48,
    1: 49,
    2: 50,
    3: 51,
    4: 52,
    5: 53,
    6: 54,
    7: 55,
    8: 56,
    '.': 190,
    ',': 188,
};

export const NBSP = '\u00a0';
export const THIN_SPACE = '\u2009';

export const INPUT_BLOCK_MAP = {
    '* ': BLOCK_TYPE.UNORDERED_LIST_ITEM,
    '- ': BLOCK_TYPE.UNORDERED_LIST_ITEM,
    '1. ': BLOCK_TYPE.ORDERED_LIST_ITEM,
    '# ': BLOCK_TYPE.HEADER_ONE,
    '## ': BLOCK_TYPE.HEADER_TWO,
    '### ': BLOCK_TYPE.HEADER_THREE,
    '#### ': BLOCK_TYPE.HEADER_FOUR,
    '##### ': BLOCK_TYPE.HEADER_FIVE,
    '###### ': BLOCK_TYPE.HEADER_SIX,
    '> ': BLOCK_TYPE.BLOCKQUOTE,
    // It makes more sense not to require a space here.
    // This matches how Dropbox Paper operates.
    '```': BLOCK_TYPE.CODE,
};

export const INPUT_BLOCK_MAX_LENGTH = Object.keys(INPUT_BLOCK_MAP).reduce(
    (maxLength, input) => Math.max(maxLength, input.length),
    0,
);

export const INPUT_ENTITY_MAP = {
    [ENTITY_TYPE.HORIZONTAL_RULE]: '---',
};

const CODE_LABEL = `{${THIN_SPACE}}`;

export const LABELS = {
    [BLOCK_TYPE.UNSTYLED]: 'P',
    [BLOCK_TYPE.HEADER_ONE]: 'H1',
    [BLOCK_TYPE.HEADER_TWO]: 'H2',
    [BLOCK_TYPE.HEADER_THREE]: 'H3',
    [BLOCK_TYPE.HEADER_FOUR]: 'H4',
    [BLOCK_TYPE.HEADER_FIVE]: 'H5',
    [BLOCK_TYPE.HEADER_SIX]: 'H6',
    [BLOCK_TYPE.CODE]: CODE_LABEL,

    [INLINE_STYLE.CODE]: CODE_LABEL,
    [INLINE_STYLE.MARK]: 'Mark',
    [INLINE_STYLE.QUOTATION]: 'Q',
    [INLINE_STYLE.SMALL]: 'Small',
    [INLINE_STYLE.SAMPLE]: 'Samp',
    [INLINE_STYLE.INSERT]: 'Ins',
    [INLINE_STYLE.DELETE]: 'Del',
    [INLINE_STYLE.SUPERSCRIPT]: 'Sup',
    [INLINE_STYLE.SUBSCRIPT]: 'Sub',
    [INLINE_STYLE.KEYBOARD]: '⌘',

    [ENTITY_TYPE.HORIZONTAL_RULE]: '―',
    [BR_TYPE]: '↵',

    [UNDO_TYPE]: '↺',
    [REDO_TYPE]: '↻',
};

export const DESCRIPTIONS = {
    [BLOCK_TYPE.UNSTYLED]: 'Paragraph',
    [BLOCK_TYPE.HEADER_ONE]: 'Heading 1',
    [BLOCK_TYPE.HEADER_TWO]: 'Heading 2',
    [BLOCK_TYPE.HEADER_THREE]: 'Heading 3',
    [BLOCK_TYPE.HEADER_FOUR]: 'Heading 4',
    [BLOCK_TYPE.HEADER_FIVE]: 'Heading 5',
    [BLOCK_TYPE.HEADER_SIX]: 'Heading 6',
    [BLOCK_TYPE.UNORDERED_LIST_ITEM]: 'Bulleted list',
    [BLOCK_TYPE.ORDERED_LIST_ITEM]: 'Numbered list',
    [BLOCK_TYPE.BLOCKQUOTE]: 'Blockquote',
    [BLOCK_TYPE.CODE]: 'Code block',

    [INLINE_STYLE.BOLD]: 'Bold',
    [INLINE_STYLE.ITALIC]: 'Italic',
    [INLINE_STYLE.CODE]: 'Code',
    [INLINE_STYLE.UNDERLINE]: 'Underline',
    [INLINE_STYLE.STRIKETHROUGH]: 'Strikethrough',
    [INLINE_STYLE.MARK]: 'Highlight',
    [INLINE_STYLE.QUOTATION]: 'Inline quotation',
    [INLINE_STYLE.SMALL]: 'Small',
    [INLINE_STYLE.SAMPLE]: 'Sample',
    [INLINE_STYLE.INSERT]: 'Inserted',
    [INLINE_STYLE.DELETE]: 'Deleted',
    [INLINE_STYLE.KEYBOARD]: 'Shortcut key',
    [INLINE_STYLE.SUPERSCRIPT]: 'Superscript',
    [INLINE_STYLE.SUBSCRIPT]: 'Subscript',

    [ENTITY_TYPE.LINK]: 'Link',
    [ENTITY_TYPE.DOCUMENT]: 'Document',
    [ENTITY_TYPE.IMAGE]: 'Image',
    [ENTITY_TYPE.EMBED]: 'Embed',
    [ENTITY_TYPE.HORIZONTAL_RULE]: 'Horizontal line',

    [BR_TYPE]: 'Line break',

    [UNDO_TYPE]: 'Undo',
    [REDO_TYPE]: 'Redo',
};

export const KEYBOARD_SHORTCUTS = {
    [BLOCK_TYPE.UNSTYLED]: {
        other: 'Backspace',
        macOS: 'Backspace',
    },
    [BLOCK_TYPE.HEADER_ONE]: {
        other: 'Ctrl+Alt+1',
        macOS: '⌘+Option+1',
    },
    [BLOCK_TYPE.HEADER_TWO]: {
        other: 'Ctrl+Alt+2',
        macOS: '⌘+Option+2',
    },
    [BLOCK_TYPE.HEADER_THREE]: {
        other: 'Ctrl+Alt+3',
        macOS: '⌘+Option+3',
    },
    [BLOCK_TYPE.HEADER_FOUR]: {
        other: 'Ctrl+Alt+4',
        macOS: '⌘+Option+4',
    },
    [BLOCK_TYPE.HEADER_FIVE]: {
        other: 'Ctrl+Alt+5',
        macOS: '⌘+Option+5',
    },
    [BLOCK_TYPE.HEADER_SIX]: {
        other: 'Ctrl+Alt+6',
        macOS: '⌘+Option+6',
    },
    [BLOCK_TYPE.UNORDERED_LIST_ITEM]: {
        other: '- Space',
        macOS: '- Space',
    },
    [BLOCK_TYPE.ORDERED_LIST_ITEM]: {
        other: '1. Space',
        macOS: '1. Space',
    },
    [BLOCK_TYPE.BLOCKQUOTE]: {
        other: '> Space',
        macOS: '> Space',
    },
    [BLOCK_TYPE.CODE]: {
        other: '```',
        macOS: '```',
    },

    [INLINE_STYLE.BOLD]: { other: 'Ctrl+B', macOS: '⌘+B' },
    [INLINE_STYLE.ITALIC]: { other: 'Ctrl+I', macOS: '⌘+I' },
    [INLINE_STYLE.UNDERLINE]: {
        other: 'Ctrl+U',
        macOS: '⌘+U',
    },
    [INLINE_STYLE.STRIKETHROUGH]: {
        other: 'Ctrl+Shift+X',
        macOS: '⌘+Shift+X',
    },
    [INLINE_STYLE.SUPERSCRIPT]: {
        other: 'Ctrl+.',
        macOS: '⌘+.',
    },
    [INLINE_STYLE.SUBSCRIPT]: {
        other: 'Ctrl+,',
        macOS: '⌘+,',
    },

    [ENTITY_TYPE.LINK]: { other: 'Ctrl+K', macOS: '⌘+K' },

    [BR_TYPE]: {
        other: 'Shift+Enter',
        macOS: 'Shift+Enter',
    },

    [ENTITY_TYPE.HORIZONTAL_RULE]: {
        other: `-${THIN_SPACE}-${THIN_SPACE}-`,
        macOS: `-${THIN_SPACE}-${THIN_SPACE}-`,
    },

    [UNDO_TYPE]: {
        other: 'Ctrl+Z',
        macOS: '⌘+Z',
    },

    [REDO_TYPE]: {
        other: 'Ctrl+Shift+Z',
        macOS: '⌘+Shift+Z',
    },
};

/**
 * SVG icon paths from Icomoon, https://icomoon.io/
 * TODO Locate selection.json project file
 */
export const ICONS = {
    [BLOCK_TYPE.UNORDERED_LIST_ITEM]:
        'M0 0h256v256h-256zM384 64h640v128h-640zM0 384h256v256h-256zM384 448h640v128h-640zM0 768h256v256h-256zM384 832h640v128h-640z',
    [BLOCK_TYPE.ORDERED_LIST_ITEM]:
        'M384 832h640v128h-640zM384 448h640v128h-640zM384 64h640v128h-640zM192 0v256h-64v-192h-64v-64zM128 526v50h128v64h-192v-146l128-60v-50h-128v-64h192v146zM256 704v320h-192v-64h128v-64h-128v-64h128v-64h-128v-64z',
    [BLOCK_TYPE.BLOCKQUOTE]:
        'M225 448c123.712 0 224 100.29 224 224 0 123.712-100.288 224-224 224s-224-100.288-224-224l-1-32c0-247.424 200.576-448 448-448v128c-85.474 0-165.834 33.286-226.274 93.726-11.634 11.636-22.252 24.016-31.83 37.020 11.438-1.8 23.16-2.746 35.104-2.746zM801 448c123.71 0 224 100.29 224 224 0 123.712-100.29 224-224 224s-224-100.288-224-224l-1-32c0-247.424 200.576-448 448-448v128c-85.474 0-165.834 33.286-226.274 93.726-11.636 11.636-22.254 24.016-31.832 37.020 11.44-1.8 23.16-2.746 35.106-2.746z',

    [INLINE_STYLE.BOLD]:
        'M707.88 484.652c37.498-44.542 60.12-102.008 60.12-164.652 0-141.16-114.842-256-256-256h-320v896h384c141.158 0 256-114.842 256-256 0-92.956-49.798-174.496-124.12-219.348zM384 192h101.5c55.968 0 101.5 57.42 101.5 128s-45.532 128-101.5 128h-101.5v-256zM543 832h-159v-256h159c58.45 0 106 57.42 106 128s-47.55 128-106 128z',
    [INLINE_STYLE.ITALIC]:
        'M896 64v64h-128l-320 768h128v64h-448v-64h128l320-768h-128v-64z',
    [INLINE_STYLE.STRIKETHROUGH]:
        'M1024 512v64h-234.506c27.504 38.51 42.506 82.692 42.506 128 0 70.878-36.66 139.026-100.58 186.964-59.358 44.518-137.284 69.036-219.42 69.036-82.138 0-160.062-24.518-219.42-69.036-63.92-47.938-100.58-116.086-100.58-186.964h128c0 69.382 87.926 128 192 128s192-58.618 192-128c0-69.382-87.926-128-192-128h-512v-64h299.518c-2.338-1.654-4.656-3.324-6.938-5.036-63.92-47.94-100.58-116.086-100.58-186.964s36.66-139.024 100.58-186.964c59.358-44.518 137.282-69.036 219.42-69.036 82.136 0 160.062 24.518 219.42 69.036 63.92 47.94 100.58 116.086 100.58 186.964h-128c0-69.382-87.926-128-192-128s-192 58.618-192 128c0 69.382 87.926 128 192 128 78.978 0 154.054 22.678 212.482 64h299.518z',
    [INLINE_STYLE.UNDERLINE]:
        'M704 64h128v416c0 159.058-143.268 288-320 288-176.73 0-320-128.942-320-288v-416h128v416c0 40.166 18.238 78.704 51.354 108.506 36.896 33.204 86.846 51.494 140.646 51.494s103.75-18.29 140.646-51.494c33.116-29.802 51.354-68.34 51.354-108.506v-416zM192 832h640v128h-640z',

    [ENTITY_TYPE.LINK]: [
        'M440.236 635.766c-13.31 0-26.616-5.076-36.77-15.23-95.134-95.136-95.134-249.934 0-345.070l192-192c46.088-46.086 107.36-71.466 172.534-71.466s126.448 25.38 172.536 71.464c95.132 95.136 95.132 249.934 0 345.070l-87.766 87.766c-20.308 20.308-53.23 20.308-73.54 0-20.306-20.306-20.306-53.232 0-73.54l87.766-87.766c54.584-54.586 54.584-143.404 0-197.99-26.442-26.442-61.6-41.004-98.996-41.004s-72.552 14.562-98.996 41.006l-192 191.998c-54.586 54.586-54.586 143.406 0 197.992 20.308 20.306 20.306 53.232 0 73.54-10.15 10.152-23.462 15.23-36.768 15.23z',
        'M256 1012c-65.176 0-126.45-25.38-172.534-71.464-95.134-95.136-95.134-249.934 0-345.070l87.764-87.764c20.308-20.306 53.234-20.306 73.54 0 20.308 20.306 20.308 53.232 0 73.54l-87.764 87.764c-54.586 54.586-54.586 143.406 0 197.992 26.44 26.44 61.598 41.002 98.994 41.002s72.552-14.562 98.998-41.006l192-191.998c54.584-54.586 54.584-143.406 0-197.992-20.308-20.308-20.306-53.232 0-73.54 20.306-20.306 53.232-20.306 73.54 0.002 95.132 95.134 95.132 249.932 0.002 345.068l-192.002 192c-46.090 46.088-107.364 71.466-172.538 71.466z',
    ],
    [ENTITY_TYPE.IMAGE]: [
        'M959.884 128c0.040 0.034 0.082 0.076 0.116 0.116v767.77c-0.034 0.040-0.076 0.082-0.116 0.116h-895.77c-0.040-0.034-0.082-0.076-0.114-0.116v-767.772c0.034-0.040 0.076-0.082 0.114-0.114h895.77zM960 64h-896c-35.2 0-64 28.8-64 64v768c0 35.2 28.8 64 64 64h896c35.2 0 64-28.8 64-64v-768c0-35.2-28.8-64-64-64v0z',
        'M832 288c0 53.020-42.98 96-96 96s-96-42.98-96-96 42.98-96 96-96 96 42.98 96 96z',
        'M896 832h-768v-128l224-384 256 320h64l224-192z',
    ],
    [ENTITY_TYPE.EMBED]:
        'M512 0c-282.77 0-512 229.23-512 512s229.23 512 512 512 512-229.23 512-512-229.23-512-512-512zM512 928c-229.75 0-416-186.25-416-416s186.25-416 416-416 416 186.25 416 416-186.25 416-416 416zM384 288l384 224-384 224z',
};

export const HANDLED = 'handled';
export const NOT_HANDLED = 'not-handled';
