import {
    EditorState,
    Modifier,
    AtomicBlockUtils,
    RichUtils,
    SelectionState,
} from 'draft-js';
import isSoftNewlineEvent from 'draft-js/lib/isSoftNewlineEvent';

import { BLOCK_TYPE, ENTITY_TYPE } from '../api/constants';

/**
 * Inspired by draftjs-utils, with our custom functions.
 *
 * DraftUtils functions are utility helpers useful in isolation, specific to the Draft.js API,
 * without ties to Draftail's specific behavior or other APIs.
 */
export default {
    /**
     * Returns the first selected block.
     */
    getSelectedBlock(editorState) {
        const selection = editorState.getSelection();
        const content = editorState.getCurrentContent();

        return content.getBlockMap().get(selection.getStartKey());
    },

    /**
     * Returns the entity applicable to whole of current selection.
     * An entity can not span multiple blocks.
     * https://github.com/jpuri/draftjs-utils/blob/e81c0ae19c3b0fdef7e0c1b70d924398956be126/js/inline.js#L75
     */
    getSelectionEntity(editorState) {
        let entity;
        const selection = editorState.getSelection();
        let start = selection.getStartOffset();
        let end = selection.getEndOffset();
        if (start === end && start === 0) {
            end = 1;
        } else if (start === end) {
            start -= 1;
        }
        const block = this.getSelectedBlock(editorState);

        for (let i = start; i < end; i += 1) {
            const currentEntity = block.getEntityAt(i);
            if (!currentEntity) {
                entity = undefined;
                break;
            }
            if (i === start) {
                entity = currentEntity;
            } else if (entity !== currentEntity) {
                entity = undefined;
                break;
            }
        }
        return entity;
    },

    /**
     * Creates a selection on a given entity in the currently selected block.
     */
    getEntitySelection(editorState, entityKey) {
        const selectionState = editorState.getSelection();
        const block = this.getSelectedBlock(editorState);
        let entityRange;
        // https://github.com/jpuri/draftjs-utils/blob/e81c0ae19c3b0fdef7e0c1b70d924398956be126/js/inline.js#L111
        block.findEntityRanges(
            value => value.get('entity') === entityKey,
            (start, end) => {
                entityRange = {
                    start,
                    end,
                };
            },
        );

        return selectionState.merge({
            anchorOffset: entityRange.start,
            focusOffset: entityRange.end,
        });
    },

    /**
     * Updates a given atomic block's entity, merging new data with the old one.
     */
    updateBlockEntity(editorState, block, data) {
        const content = editorState.getCurrentContent();
        let nextContent = content.mergeEntityData(block.getEntityAt(0), data);

        // To remove in Draft.js 0.11.
        // This is necessary because entity data is still using a mutable, global store.
        nextContent = Modifier.mergeBlockData(
            nextContent,
            new SelectionState({
                anchorKey: block.getKey(),
                anchorOffset: 0,
                focusKey: block.getKey(),
                focusOffset: block.getLength(),
            }),
            {},
        );

        return EditorState.push(editorState, nextContent, 'apply-entity');
    },

    /**
     * Inserts a horizontal rule in the place of the current selection.
     * Returns updated EditorState.
     * Inspired by DraftUtils.addLineBreakRemovingSelection.
     */
    addHorizontalRuleRemovingSelection(editorState) {
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity(
            ENTITY_TYPE.HORIZONTAL_RULE,
            'IMMUTABLE',
            {},
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        return AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    },

    /**
     * Changes a block type to be `newType`, setting its new text.
     * Also removes the required characters from the characterList,
     * and resets block data.
     */
    resetBlockWithType(editorState, newType, newText) {
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const key = selectionState.getStartKey();
        const blockMap = contentState.getBlockMap();
        const block = blockMap.get(key);

        // Maintain persistence in the list while removing chars from the start.
        // https://github.com/facebook/draft-js/blob/788595984da7c1e00d1071ea82b063ff87140be4/src/model/transaction/removeRangeFromContentState.js#L333
        let chars = block.getCharacterList();
        let startOffset = 0;
        const sliceOffset = block.getText().length - newText.length;
        while (startOffset < sliceOffset) {
            chars = chars.shift();
            startOffset++;
        }

        const newBlock = block.merge({
            type: newType,
            text: newText,
            characterList: chars,
            data: {},
        });
        const newContentState = contentState.merge({
            blockMap: blockMap.set(key, newBlock),
        });
        const newSelectionState = selectionState.merge({
            anchorOffset: 0,
            focusOffset: 0,
        });

        return EditorState.acceptSelection(
            EditorState.set(editorState, {
                currentContent: newContentState,
            }),
            newSelectionState,
        );
    },

    /**
     * Removes the block at the given key.
     */
    removeBlock(editorState, key) {
        const content = editorState.getCurrentContent();
        const blockMap = content.getBlockMap().remove(key);

        return EditorState.set(editorState, {
            currentContent: content.merge({
                blockMap: blockMap,
            }),
        });
    },

    /**
     * Removes a block-level entity, turning the block into an empty paragraph,
     * and placing the selection on it.
     */
    removeBlockEntity(editorState, entityKey, blockKey) {
        let newState = editorState;

        const content = editorState.getCurrentContent();
        const blockMap = content.getBlockMap();
        const block = blockMap.get(blockKey);

        const newBlock = block.merge({
            type: BLOCK_TYPE.UNSTYLED,
            text: '',
            // No text = no character list
            characterList: block.getCharacterList().slice(0, 0),
            data: {},
        });

        const newSelection = new SelectionState({
            anchorKey: blockKey,
            focusKey: blockKey,
            anchorOffset: 0,
            focusOffset: 0,
        });

        const newContent = content.merge({
            blockMap: blockMap.set(blockKey, newBlock),
        });

        newState = EditorState.push(newState, newContent, 'change-block-type');
        newState = EditorState.forceSelection(newState, newSelection);

        return newState;
    },

    /**
     * Handles pressing delete within an atomic block. This can happen when selection is placed on an image.
     * Ideally this should be handled by the built-in RichUtils, but it's not.
     * See https://github.com/wagtail/wagtail/issues/4370.
     */
    handleDeleteAtomic(editorState) {
        const selection = editorState.getSelection();
        const content = editorState.getCurrentContent();
        const key = selection.getAnchorKey();
        const offset = selection.getAnchorOffset();
        const block = content.getBlockForKey(key);

        // Problematic selection. Pressing delete here would remove the entity, but not the block.
        if (
            selection.isCollapsed() &&
            block.getType() === BLOCK_TYPE.ATOMIC &&
            offset === 0
        ) {
            return this.removeBlockEntity(
                editorState,
                block.getEntityAt(0),
                key,
            );
        }

        return false;
    },

    /**
     * Get an entity decorator strategy based on the given entity type.
     * This strategy will find all entities of the given type.
     */
    getEntityTypeStrategy(entityType) {
        const strategy = (contentBlock, callback, contentState) => {
            contentBlock.findEntityRanges(character => {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === entityType
                );
            }, callback);
        };

        return strategy;
    },

    /**
     * Determines whether the editor should show its placeholder.
     * See https://draftjs.org/docs/api-reference-editor.html#placeholder
     * for details on why this is useful.
     */
    shouldHidePlaceholder(editorState) {
        const contentState = editorState.getCurrentContent();
        return (
            contentState.hasText() ||
            contentState
                .getBlockMap()
                .first()
                .getType() !== BLOCK_TYPE.UNSTYLED
        );
    },

    /**
     * Inserts new unstyled block.
     * Initially inspired from https://github.com/jpuri/draftjs-utils/blob/e81c0ae19c3b0fdef7e0c1b70d924398956be126/js/block.js#L153,
     * but changed so that the split + block type reset amounts to
     * only one change in the undo stack.
     */
    insertNewUnstyledBlock(editorState) {
        const selection = editorState.getSelection();
        let newContent = Modifier.splitBlock(
            editorState.getCurrentContent(),
            selection,
        );
        const blockMap = newContent.getBlockMap();
        const blockKey = selection.getStartKey();
        const insertedBlockKey = newContent.getKeyAfter(blockKey);

        const newBlock = blockMap
            .get(insertedBlockKey)
            .set('type', BLOCK_TYPE.UNSTYLED);

        newContent = newContent.merge({
            blockMap: blockMap.set(insertedBlockKey, newBlock),
        });

        return EditorState.push(editorState, newContent, 'split-block');
    },

    /**
     * Handles Shift + Enter keypress removing selection and inserting a line break.
     * https://github.com/jpuri/draftjs-utils/blob/112bbe449cc9156522fcf2b40f2910a071b795c2/js/block.js#L133
     */
    addLineBreak(editorState) {
        const content = editorState.getCurrentContent();
        const selection = editorState.getSelection();

        if (selection.isCollapsed()) {
            return RichUtils.insertSoftNewline(editorState);
        }

        let newContent = Modifier.removeRange(content, selection, 'forward');
        const fragment = newContent.getSelectionAfter();
        const block = newContent.getBlockForKey(fragment.getStartKey());
        newContent = Modifier.insertText(
            newContent,
            fragment,
            '\n',
            block.getInlineStyleAt(fragment.getStartOffset()),
            null,
        );
        return EditorState.push(editorState, newContent, 'insert-fragment');
    },

    /**
     * Handles hard newlines.
     * https://github.com/jpuri/draftjs-utils/blob/e81c0ae19c3b0fdef7e0c1b70d924398956be126/js/keyPress.js#L17
     */
    handleHardNewline(editorState) {
        const selection = editorState.getSelection();

        if (!selection.isCollapsed()) {
            return false;
        }

        const content = editorState.getCurrentContent();
        const blockKey = selection.getStartKey();
        const block = content.getBlockForKey(blockKey);
        const blockType = block.getType();
        const isListBlock = [
            BLOCK_TYPE.UNORDERED_LIST_ITEM,
            BLOCK_TYPE.ORDERED_LIST_ITEM,
        ].includes(blockType);

        if (
            !isListBlock &&
            block.getType() !== BLOCK_TYPE.UNSTYLED &&
            block.getLength() === selection.getStartOffset()
        ) {
            return this.insertNewUnstyledBlock(editorState);
        } else if (isListBlock && block.getLength() === 0) {
            const depth = block.getDepth();

            if (depth === 0) {
                return EditorState.push(
                    editorState,
                    RichUtils.tryToRemoveBlockStyle(editorState),
                    'change-block-type',
                );
            }

            const blockMap = content.getBlockMap();
            const newBlock = block.set('depth', depth - 1);

            return EditorState.push(
                editorState,
                content.merge({
                    blockMap: blockMap.set(blockKey, newBlock),
                }),
                'adjust-depth',
            );
        }

        return false;
    },

    /**
     * Handles three scenarios:
     * - Soft newlines.
     * - Hard newlines in the "defer breaking out of the block" case.
     * - Other hard newlines.
     * See https://github.com/springload/draftail/issues/104,
     * https://github.com/jpuri/draftjs-utils/issues/10.
     */
    handleNewLine(editorState, event) {
        // https://github.com/jpuri/draftjs-utils/blob/e81c0ae19c3b0fdef7e0c1b70d924398956be126/js/keyPress.js#L64
        if (isSoftNewlineEvent(event)) {
            return this.addLineBreak(editorState);
        }

        const content = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const key = selection.getStartKey();
        const offset = selection.getStartOffset();
        const block = content.getBlockForKey(key);

        const isDeferredBreakoutBlock = [BLOCK_TYPE.CODE].includes(
            block.getType(),
        );

        if (isDeferredBreakoutBlock) {
            const isEmpty =
                selection.isCollapsed() &&
                offset === 0 &&
                block.getLength() === 0;

            if (isEmpty) {
                return EditorState.push(
                    editorState,
                    Modifier.setBlockType(
                        content,
                        selection,
                        BLOCK_TYPE.UNSTYLED,
                    ),
                    'change-block-type',
                );
            }

            return false;
        }

        return this.handleHardNewline(editorState);
    },
};
