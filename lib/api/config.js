import { Map } from 'immutable';
import {
    DefaultDraftBlockRenderMap,
    getDefaultKeyBinding,
    KeyBindingUtil,
} from 'draft-js';

import { INLINE_STYLE, KEY_CODES } from '../api/constants';

const { isOptionKeyCommand, hasCommandModifier } = KeyBindingUtil;

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
     * Configure key binding function from available blocks, styles, entities.
     */
    getKeyBindingFn(BLOCK_TYPES = [], INLINE_STYLES = []) {
        const isStyleAvailable = style => INLINE_STYLES.find(item => item.style === style);

        const isAvailable = Object.keys(INLINE_STYLE).reduce((available, style) => {
            // eslint-disable-next-line no-param-reassign
            available[style] = isStyleAvailable(style);

            return available;
        }, {});

        // Emits key commands to use in `handleKeyCommand` in `Editor`.
        const keyBindingFn = (e) => {
            switch (e.keyCode) {
            case KEY_CODES.B:
                return isAvailable.BOLD && hasCommandModifier(e) ? 'bold' : null;
            case KEY_CODES.I:
                return isAvailable.ITALIC && hasCommandModifier(e) ? 'italic' : null;
            case KEY_CODES.J:
                return isAvailable.CODE && hasCommandModifier(e) ? 'code' : null;
            case KEY_CODES.U:
                return isAvailable.UNDERLINE && hasCommandModifier(e) ? 'underline' : null;
            case KEY_CODES[5]:
                return isAvailable.STRIKETHROUGH && e.shiftKey && isOptionKeyCommand(e) ? 'strikethrough' : null;
            default:
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
