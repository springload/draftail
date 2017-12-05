const {
    BLOCK_TYPE,
    ENTITY_TYPE,
    INLINE_STYLE,
    FONT_FAMILY_MONOSPACE,
    CUSTOM_STYLE_MAP,
    BR_TYPE,
    UNDO_TYPE,
    REDO_TYPE,
    KEY_CODES,
    NBSP,
    THIN_SPACE,
    INPUT_BLOCK_MAP,
    INPUT_BLOCK_MAX_LENGTH,
    INPUT_ENTITY_MAP,
    LABELS,
    DESCRIPTIONS,
    KEYBOARD_SHORTCUTS,
    ICONS: REAL_ICONS,
    HANDLED,
    NOT_HANDLED,
} = require.requireActual('../constants');

// Mock icons to not litter snapshot tests with SVG paths.
const ICONS = Object.keys(REAL_ICONS).reduce((icons, key) => {
    icons[key] = key;
    return icons;
}, {});

export {
    BLOCK_TYPE,
    ENTITY_TYPE,
    INLINE_STYLE,
    FONT_FAMILY_MONOSPACE,
    CUSTOM_STYLE_MAP,
    BR_TYPE,
    UNDO_TYPE,
    REDO_TYPE,
    KEY_CODES,
    NBSP,
    THIN_SPACE,
    INPUT_BLOCK_MAP,
    INPUT_BLOCK_MAX_LENGTH,
    INPUT_ENTITY_MAP,
    LABELS,
    DESCRIPTIONS,
    KEYBOARD_SHORTCUTS,
    ICONS,
    HANDLED,
    NOT_HANDLED,
};
