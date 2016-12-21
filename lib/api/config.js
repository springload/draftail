import { Map } from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';

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
};
