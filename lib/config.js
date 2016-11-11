import ImageBlock from './blocks/ImageBlock';
import EmbedBlock from './blocks/EmbedBlock';
import NullBlock from './blocks/NullBlock';

const BLOCK_TYPES = [
    { label: 'H2', style: 'header-two' },
    { label: 'H3', style: 'header-three' },
    { label: 'H4', style: 'header-four' },
    { label: 'H5', style: 'header-five' },
    { label: 'Blockquote', style: 'blockquote', icon: 'openquote' },
    { label: 'UL', style: 'unordered-list-item', icon: 'list-ul' },
    { label: 'OL', style: 'ordered-list-item', icon: 'list-ol' },
];

const INLINE_STYLES = [
    { label: 'Bold', style: 'BOLD', icon: 'bold' },
    { label: 'Italic', style: 'ITALIC', icon: 'italic' },
    // {label: 'Underline', style: 'UNDERLINE'},
    // {label: 'Monospace', style: 'CODE'},
    // {label: 'Strikethrough', style: 'STRIKETHROUGH'},
];

const TYPE_MAP = {
    WAGTAIL_IMAGE: ImageBlock,
    WAGTAIL_EMBED: EmbedBlock,
};

// TODO Make this configurable when initialising the JSONTextField.
const _config = {
    BLOCK_TYPES: global.BLOCK_TYPES || BLOCK_TYPES,
    INLINE_STYLES: global.INLINE_STYLES || INLINE_STYLES,
    TYPE_MAP: global.TYPE_MAP || TYPE_MAP,
};

export default {
    get(key, _default = null) {
        return typeof _config[key] !== 'undefined' ? _config[key] : _default;
    },

    getEntityComponent(type, _default = NullBlock) {
        return TYPE_MAP[type] || _default;
    },
};

export const MAX_LIST_NESTING = 4;
export const STATE_SAVE_INTERVAL = 250;
