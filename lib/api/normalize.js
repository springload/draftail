import { EditorState, CharacterMetadata } from 'draft-js';

import { BLOCK_TYPE, ENTITY_TYPE } from '../api/constants';

/**
 * Helper functions to filter/whitelist specific formatting.
 * Meant to be used when pasting unconstrained content.
 */
export default {
    /**
     * Applies whitelist and blacklist operations to the editor content,
     * so the resulting editor state is shaped according to Draftail
     * expectations and configuration.
     */
    filterEditorState(
        editorState,
        maxListNesting,
        enableHorizontalRule,
        blockTypes = [],
        inlineStyles = [],
        entityTypes = [],
    ) {
        let nextEditorState = editorState;
        const enabledBlockTypes = blockTypes.map(type => type.type).concat([
            // Always enabled in a Draftail editor.
            BLOCK_TYPE.UNSTYLED,
            // This is filtered at the entity stage if it has to be.
            BLOCK_TYPE.ATOMIC,
        ]);
        const enabledInlineStyles = inlineStyles.map(type => type.type);
        const enabledEntityTypes = entityTypes.map(type => type.type);

        if (enableHorizontalRule) {
            enabledEntityTypes.push(ENTITY_TYPE.HORIZONTAL_RULE);
        }

        nextEditorState = this.resetBlockDepth(nextEditorState, maxListNesting);

        nextEditorState = this.resetBlockType(
            nextEditorState,
            enabledBlockTypes,
        );

        nextEditorState = this.filterInlineStyle(
            nextEditorState,
            enabledInlineStyles,
        );

        nextEditorState = this.filterEntityType(
            nextEditorState,
            enabledEntityTypes,
        );

        return nextEditorState;
    },

    /**
     * Resets the depth of all the content to at most maxListNesting.
     */
    resetBlockDepth(editorState, maxListNesting) {
        const content = editorState.getCurrentContent();
        const blockMap = content.getBlockMap();

        const changedBlocks = blockMap
            .filter(block => block.getDepth() > maxListNesting)
            .map(block => block.set('depth', maxListNesting));

        if (changedBlocks.size !== 0) {
            return EditorState.set(editorState, {
                currentContent: content.merge({
                    blockMap: blockMap.merge(changedBlocks),
                }),
            });
        }

        return editorState;
    },

    /**
     * Resets all blocks that use unavailable types to unstyled.
     */
    resetBlockType(editorState, enabledBlockTypes) {
        const content = editorState.getCurrentContent();
        const blockMap = content.getBlockMap();

        const changedBlocks = blockMap
            .filter(block => !enabledBlockTypes.includes(block.getType()))
            .map(block => block.set('type', BLOCK_TYPE.UNSTYLED));

        if (changedBlocks.size !== 0) {
            return EditorState.set(editorState, {
                currentContent: content.merge({
                    blockMap: blockMap.merge(changedBlocks),
                }),
            });
        }

        return editorState;
    },

    /**
     * Removes all styles that use unavailable types.
     */
    filterInlineStyle(editorState, enabledTypes) {
        const content = editorState.getCurrentContent();
        const blockMap = content.getBlockMap();

        const blocks = blockMap.map(block => {
            let altered = false;

            const chars = block.getCharacterList().map(char => {
                let newChar = char;

                char
                    .getStyle()
                    .filter(type => !enabledTypes.includes(type))
                    .forEach(type => {
                        altered = true;
                        newChar = CharacterMetadata.removeStyle(newChar, type);
                    });

                return newChar;
            });

            return altered ? block.set('characterList', chars) : block;
        });

        return EditorState.set(editorState, {
            currentContent: content.merge({
                blockMap: blockMap.merge(blocks),
            }),
        });
    },

    /**
     * Reset all entity types (images, links, documents, embeds) that are unavailable.
     */
    filterEntityType(editorState, enabledTypes) {
        const content = editorState.getCurrentContent();
        const blockMap = content.getBlockMap();
        let blocks = blockMap;

        /**
         * Resets atomic blocks to unstyled if the atomic block entity isn't enabled.
         */
        const changedBlocks = blocks
            .filter(block => block.getType() === BLOCK_TYPE.ATOMIC)
            .filter(block => {
                const entityKey = block.getEntityAt(0);

                if (entityKey) {
                    const entityType = content.getEntity(entityKey).getType();

                    return !enabledTypes.includes(entityType);
                }

                return false;
            })
            .map(block => block.set('type', BLOCK_TYPE.UNSTYLED));

        if (changedBlocks.size !== 0) {
            blocks = blockMap.merge(changedBlocks);
        }

        /**
         * Removes entities from the character list if the character entity isn't enabled.
         * Also removes image entities placed outside of atomic blocks, which can happen
         * on paste.
         * A better approach would probably be to split the block where the image is and
         * create an atomic block there, but that's another story. This is what Draft.js
         * does when the copy-paste is all within one editor.
         */
        blocks = blocks.map(block => {
            const blockType = block.getType();
            let altered = false;

            const chars = block.getCharacterList().map(char => {
                const entityKey = char.getEntity();

                if (entityKey) {
                    const entityType = content.getEntity(entityKey).getType();
                    const shouldFilter = !enabledTypes.includes(entityType);
                    /**
                     * Special case for images. They should only be in atomic blocks.
                     * This only removes the image entity, not the camera emoji (📷)
                     * that Draft.js inserts.
                     * If we want to remove this in the future, consider that:
                     * - It needs to be removed in the block text, where it's 2 chars / 1 code point.
                     * - The corresponding CharacterMetadata needs to be removed too, and it's 2 instances
                     */
                    const shouldFilterImage =
                        entityType === ENTITY_TYPE.IMAGE &&
                        blockType !== BLOCK_TYPE.ATOMIC;

                    if (shouldFilter || shouldFilterImage) {
                        altered = true;
                        return CharacterMetadata.applyEntity(char, null);
                    }
                }

                return char;
            });

            return altered ? block.set('characterList', chars) : block;
        });

        return EditorState.set(editorState, {
            currentContent: content.merge({
                blockMap: blockMap.merge(blocks),
            }),
        });
    },
};
