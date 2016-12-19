import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

import { BLOCK_TYPE } from '../api/constants';

// Maximum level of nesting for unordered and ordered lists.
export const MAX_LIST_NESTING = 3;
// Frequency at which the save callback is triggered.
export const STATE_SAVE_INTERVAL = 250;

/**
 * Options / configuration methods for the editor.
 */
export default {
    getBlockRenderMap(BLOCK_TYPES = []) {
        const renderMap = {};

        BLOCK_TYPES.filter(type => type.element)
            .forEach((type) => {
                renderMap[type.style] = { element: type.element };
            });

        return DefaultDraftBlockRenderMap.merge(Map(renderMap));
    },

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
};
