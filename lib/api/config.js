import { Map } from 'immutable';
import {
    DefaultDraftBlockRenderMap,
    getDefaultKeyBinding,
    KeyBindingUtil,
} from 'draft-js';

import { ENTITY_TYPE, BLOCK_TYPE, INLINE_STYLE, KEY_CODES } from '../api/constants';

const { hasCommandModifier } = KeyBindingUtil;

// Maximum level of nesting for unordered and ordered lists.
export const MAX_LIST_NESTING = 1;
// Frequency at which the save callback is triggered.
export const STATE_SAVE_INTERVAL = 250;

/**
 * Options / configuration methods for the editor.
 */
export default {
    /**
     * Configure block render map from block types list.
     */
    getBlockRenderMap(BLOCK_TYPES = []) {
        const renderMap = {};

        BLOCK_TYPES.filter(type => type.element)
            .forEach((type) => {
                renderMap[type.style] = { element: type.element };
            });

        return DefaultDraftBlockRenderMap.merge(Map(renderMap));
    },

    /**
     * Configure block style function from block types list.
     */
    getBlockStyleFn(BLOCK_TYPES = []) {
        const blockClassNames = {};

        BLOCK_TYPES.filter(type => type.className)
            .forEach((type) => {
                blockClassNames[type.style] = type.className;
            });

        const blockStyleFn = (block) => {
            const type = block.getType();

            return blockClassNames[type] || undefined;
        };

        return blockStyleFn;
    },

    /**
     * Configure key binding function from enabled blocks, styles, entities.
     */
    getKeyBindingFn(BLOCK_TYPES = [], INLINE_STYLES = [], ENTITY_TYPES = []) {
        const isTypeEnabled = (arr, style) => !!arr.find(item => item.style === style || item.entity === style);

        const getEnabledTypes = (activeTypes, allTypes) => {
            // Go through all the possible types, and check which are enabled.
            return Object.keys(allTypes)
                .reduce((enabled, key) => {
                    // eslint-disable-next-line no-param-reassign
                    enabled[key] = isTypeEnabled(activeTypes, allTypes[key]);

                    return enabled;
                }, {});
        };

        const isEnabledBlock = getEnabledTypes(BLOCK_TYPES, BLOCK_TYPE);
        const isEnabledInline = getEnabledTypes(INLINE_STYLES, INLINE_STYLE);
        const isEnabledEntity = getEnabledTypes(ENTITY_TYPES, ENTITY_TYPE);

        // Emits key commands to use in `handleKeyCommand` in `Editor`.
        const keyBindingFn = (e) => {
            // Safeguard that we only trigger shortcuts with exact matches.
            // eg. cmd + shift + b should not trigger bold.
            if (e.shiftKey) {
                // Key bindings supported by Draft.js must be explicitely discarded.
                // See https://github.com/facebook/draft-js/issues/941.
                switch (e.keyCode) {
                case KEY_CODES.B:
                    return null;
                case KEY_CODES.I:
                    return null;
                case KEY_CODES.J:
                    return null;
                case KEY_CODES.U:
                    return null;
                case KEY_CODES[5]:
                    return isEnabledInline.STRIKETHROUGH && e.shiftKey && e.altKey ? INLINE_STYLE.STRIKETHROUGH : null;
                case KEY_CODES[7]:
                    return isEnabledBlock.ORDERED_LIST_ITEM && hasCommandModifier(e) && e.shiftKey ? BLOCK_TYPE.ORDERED_LIST_ITEM : null;
                case KEY_CODES[8]:
                    return isEnabledBlock.UNORDERED_LIST_ITEM && hasCommandModifier(e) && e.shiftKey ? BLOCK_TYPE.UNORDERED_LIST_ITEM : null;
                default:
                }
            } else {
                switch (e.keyCode) {
                case KEY_CODES.K:
                    return isEnabledEntity.LINK && hasCommandModifier(e) ? ENTITY_TYPE.LINK : null;
                case KEY_CODES.B:
                    return isEnabledInline.BOLD && hasCommandModifier(e) ? INLINE_STYLE.BOLD : null;
                case KEY_CODES.I:
                    return isEnabledInline.ITALIC && hasCommandModifier(e) ? INLINE_STYLE.ITALIC : null;
                case KEY_CODES.J:
                    return isEnabledInline.CODE && hasCommandModifier(e) ? INLINE_STYLE.CODE : null;
                case KEY_CODES.U:
                    return isEnabledInline.UNDERLINE && hasCommandModifier(e) ? INLINE_STYLE.UNDERLINE : null;
                case KEY_CODES[0]:
                    // Reverting to unstyled block is always available.
                    return (e.ctrlKey || e.metaKey) && e.altKey ? BLOCK_TYPE.UNSTYLED : null;
                case KEY_CODES[1]:
                    return isEnabledBlock.HEADER_ONE && (e.ctrlKey || e.metaKey) && e.altKey ? BLOCK_TYPE.HEADER_ONE : null;
                case KEY_CODES[2]:
                    return isEnabledBlock.HEADER_TWO && (e.ctrlKey || e.metaKey) && e.altKey ? BLOCK_TYPE.HEADER_TWO : null;
                case KEY_CODES[3]:
                    return isEnabledBlock.HEADER_THREE && (e.ctrlKey || e.metaKey) && e.altKey ? BLOCK_TYPE.HEADER_THREE : null;
                case KEY_CODES[4]:
                    return isEnabledBlock.HEADER_FOUR && (e.ctrlKey || e.metaKey) && e.altKey ? BLOCK_TYPE.HEADER_FOUR : null;
                case KEY_CODES[5]:
                    return isEnabledBlock.HEADER_FIVE && (e.ctrlKey || e.metaKey) && e.altKey ? BLOCK_TYPE.HEADER_FIVE : null;
                case KEY_CODES[6]:
                    return isEnabledBlock.HEADER_SIX && (e.ctrlKey || e.metaKey) && e.altKey ? BLOCK_TYPE.HEADER_SIX : null;
                default:
                }
            }

            // if (e.altKey === true && !e.ctrlKey) {
            //     if (e.shiftKey === true) {
            //         switch (e.which) {
            //         // Alt + Shift + A
            //         // case 65: return addNewBlock();
            //         default: return getDefaultKeyBinding(e);
            //         }
            //     }

            //     switch (e.which) {
            //     // // 1
            //     // case 49: return changeType('ordered-list-item');
            //     // // @
            //     // case 50: return showLinkInput();
            //     // // #
            //     // case 51: return changeType('header-three');
            //     // // *
            //     // case 56: return changeType('unordered-list-item');
            //     // // <
            //     // case 188: return changeType('caption');
            //     // // // -
            //     // // case 189: return 'changetype:caption';
            //     // // >
            //     // case 190: return changeType('unstyled');
            //     // // "
            //     // case 222: return changeType('blockquote');
            //     default: return getDefaultKeyBinding(e);
            //     }
            // }

            // if (e.keyCode === 46 && !e.ctrlKey) {
            //   return KEY_COMMANDS.deleteBlock();
            // }
            return getDefaultKeyBinding(e);
        };

        return keyBindingFn;
    },

};
