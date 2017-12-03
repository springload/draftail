import { EditorState, CharacterMetadata } from 'draft-js';

import { BLOCK_TYPE, ENTITY_TYPE } from '../api/constants';

/**
 * Helper functions to filter/whitelist specific formatting.
 * Meant to be used when pasting unconstrained content.
 */
export default {
    filterPastedContent(
        editorState,
        maxListNesting,
        // TODO Implement.
        enableHorizontalRule,
        // TODO Implement.
        enableLineBreak,
        blockTypes = [],
        inlineStyles = [],
        // TODO Finish.
        entityTypes = [],
    ) {
        let nextEditorState = editorState;
        const enabledBlockTypes = blockTypes.map(type => type.type);
        const enabledEntityTypes = entityTypes.map(type => type.type);
        const enabledInlineStyles = inlineStyles.map(type => type.type);

        nextEditorState = this.normaliseBlockDepth(
            nextEditorState,
            maxListNesting,
        );

        nextEditorState = this.normaliseBlockType(
            nextEditorState,
            enabledBlockTypes,
        );

        nextEditorState = this.normaliseEntityType(
            nextEditorState,
            enabledEntityTypes,
        );

        nextEditorState = this.normaliseInlineStyle(
            nextEditorState,
            enabledInlineStyles,
        );

        return nextEditorState;
    },

    /**
     * Reset the depth of all the content to be at most maxListNesting.
     */
    normaliseBlockDepth(editorState, maxListNesting) {
        let contentState = editorState.getCurrentContent();
        let blockMap = contentState.getBlockMap();
        const blocks = blockMap
            .filter(block => block.getDepth() > maxListNesting)
            .map(block => block.set('depth', maxListNesting));

        // TODO Optimise so this runs only if there are changed blocks.
        blockMap = blockMap.merge(blocks);
        contentState = contentState.merge({ blockMap });

        return EditorState.set(editorState, {
            currentContent: contentState,
        });
    },

    /**
     * Reset all blocks that use unavailable types to unstyled.
     */
    normaliseBlockType(editorState, enabledBlockTypes) {
        let contentState = editorState.getCurrentContent();
        let blockMap = contentState.getBlockMap();

        const shouldNormaliseType = block => {
            const type = block.getType();
            return (
                type !== BLOCK_TYPE.UNSTYLED &&
                type !== BLOCK_TYPE.ATOMIC &&
                enabledBlockTypes.indexOf(type) === -1
            );
        };

        const blocks = blockMap
            .filter(shouldNormaliseType)
            .map(block => block.set('type', BLOCK_TYPE.UNSTYLED));

        // TODO Optimise so this runs only if there are changed blocks.
        blockMap = blockMap.merge(blocks);
        contentState = contentState.merge({ blockMap });

        return EditorState.set(editorState, {
            currentContent: contentState,
        });
    },

    /**
     * Reset all entity types (images, links, documents, embeds) that are unavailable.
     */
    normaliseEntityType(editorState, enabledTypes) {
        let contentState = editorState.getCurrentContent();
        let blockMap = contentState.getBlockMap();

        const isValidEntity = char => {
            let isValid = true;
            const entityKey = char.getEntity();
            if (entityKey !== null) {
                const entityType = contentState.getEntity(entityKey).getType();
                if (enabledTypes.indexOf(entityType) === -1) {
                    isValid = false;
                }
            }
            return isValid;
        };

        const isValidAtomicBlock = block => {
            // Remove invalid image and document blocks if not enabled
            let isValidBlock = true;
            block.findEntityRanges(
                char => {
                    isValidBlock = isValidEntity(char);
                },
                () => {},
            );
            return isValidBlock;
        };

        const isValidInline = block => {
            let altered = false;

            const chars = block.getCharacterList().filter(char => {
                let newChar = char;
                if (!isValidEntity(char)) {
                    altered = true;
                    newChar = CharacterMetadata.applyEntity(newChar, null);
                }
                return newChar;
            });

            return altered ? block.set('characterList', chars) : block;
        };

        blockMap = blockMap.filter(isValidAtomicBlock);
        const blocks = blockMap.map(isValidInline);
        blockMap = blockMap.merge(blocks);
        contentState = contentState.merge({ blockMap });

        let newEditorState = EditorState.set(editorState, {
            currentContent: contentState,
        });

        // TODO: instead of moving selection and focus to the end, move it to previous block,
        // if the last block in the paste selection was removed.
        newEditorState = EditorState.moveSelectionToEnd(newEditorState);
        newEditorState = EditorState.moveFocusToEnd(newEditorState);
        return newEditorState;
    },

    /**
     * Remove all styles that use unavailable types.
     * Meant to be used after a paste of unconstrained content.
     */
    normaliseInlineStyle(editorState, enabledTypes) {
        let contentState = editorState.getCurrentContent();
        let blockMap = contentState.getBlockMap();

        const blocks = blockMap.map(block => {
            let altered = false;

            const chars = block.getCharacterList().map(char => {
                let newChar = char;

                char
                    .getStyle()
                    .filter(type => enabledTypes.indexOf(type) === -1)
                    .forEach(type => {
                        altered = true;
                        newChar = CharacterMetadata.removeStyle(newChar, type);
                    });

                return newChar;
            });

            return altered ? block.set('characterList', chars) : block;
        });

        blockMap = blockMap.merge(blocks);
        contentState = contentState.merge({ blockMap });

        return EditorState.set(editorState, {
            currentContent: contentState,
        });
    },
};
