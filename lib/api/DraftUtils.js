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
     * Returns the range of given entity inside the block.
     * https://github.com/jpuri/draftjs-utils/blob/e81c0ae19c3b0fdef7e0c1b70d924398956be126/js/inline.js#L111
     * {
     *   anchorOffset: undefined,
     *   focusOffset: undefined,
     *   text: undefined,
     * }
     */
    getEntityRange(editorState, entityKey) {
        const block = this.getSelectedBlock(editorState);
        let entityRange;
        block.findEntityRanges(
            value => value.get('entity') === entityKey,
            (start, end) => {
                entityRange = {
                    start,
                    end,
                    text: block.get('text').slice(start, end),
                };
            },
        );
        return entityRange;
    },

    /**
     * Handles Shift + Enter keypress removing selection and inserting a line break.
     * https://github.com/jpuri/draftjs-utils/blob/112bbe449cc9156522fcf2b40f2910a071b795c2/js/block.js#L133
     */
    addLineBreakRemovingSelection(editorState) {
        const content = editorState.getCurrentContent();
        const selection = editorState.getSelection();
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
     * Returns the first selected block.
     */
    getSelectedBlock(editorState) {
        const selection = editorState.getSelection();
        const content = editorState.getCurrentContent();

        return content.getBlockMap().get(selection.getStartKey());
    },

    /**
     * Creates a selection on a given entity in the currently selected block.
     */
    getEntitySelection(editorState, entityKey) {
        const selectionState = editorState.getSelection();
        const entityRange = this.getEntityRange(editorState, entityKey);

        return selectionState.merge({
            anchorOffset: entityRange.start,
            focusOffset: entityRange.end,
        });
    },

    /**
     * Checks that the current selection has the given style.
     */
    hasCurrentInlineStyle(editorState, style) {
        const currentStyle = editorState.getCurrentInlineStyle();

        return currentStyle.has(style);
    },

    /**
     * Checks that the current selection is inside a block of the given type.
     */
    isSelectedBlockType(editorState, type) {
        const block = this.getSelectedBlock(editorState);

        return block && block.type === type;
    },

    // TODO Refactor to be a shortcut rather than use `Modifier`.
    createEntity(
        editorState,
        entityType,
        entityData,
        entityText,
        entityMutability = 'IMMUTABLE',
    ) {
        const contentState = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const contentStateWithEntity = contentState.createEntity(
            entityType,
            entityMutability,
            entityData,
        );
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        let nextContentState;

        if (selection.isCollapsed()) {
            nextContentState = Modifier.insertText(
                contentState,
                selection,
                entityText,
                null,
                entityKey,
            );
        } else {
            nextContentState = Modifier.replaceText(
                contentState,
                selection,
                entityText,
                null,
                entityKey,
            );
        }

        const nextState = EditorState.push(
            editorState,
            nextContentState,
            'insert',
        );

        return nextState;
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
     * Changes a block type to be `newType`. Other attributes of the block
     * can also be changed at the same time with `overrides`.
     */
    resetBlockWithType(editorState, newType, overrides = {}) {
        const contentState = editorState.getCurrentContent();
        const selectionState = editorState.getSelection();
        const key = selectionState.getStartKey();
        const blockMap = contentState.getBlockMap();
        const block = blockMap.get(key);
        const newBlock = block.mergeDeep(overrides, {
            type: newType,
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

    hasNoSelectionStartEntity(selection, block) {
        const startOffset = selection.getStartOffset();

        return block.getEntityAt(startOffset) === null;
    },

    insertTextWithoutEntity(editorState, text) {
        const currentContent = editorState.getCurrentContent();
        const selection = editorState.getSelection();
        const style = editorState.getCurrentInlineStyle();

        const newContent = Modifier.insertText(
            currentContent,
            selection,
            text,
            style,
            null,
        );

        return EditorState.push(editorState, newContent, 'insert-characters');
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
     * // https://github.com/jpuri/draftjs-utils/blob/e81c0ae19c3b0fdef7e0c1b70d924398956be126/js/block.js#L153
     */
    insertNewUnstyledBlock(editorState) {
        const newContent = Modifier.splitBlock(
            editorState.getCurrentContent(),
            editorState.getSelection(),
        );
        const newEditorState = EditorState.push(
            editorState,
            newContent,
            'split-block',
        );
        return EditorState.push(
            newEditorState,
            RichUtils.tryToRemoveBlockStyle(newEditorState),
            'change-block-type',
        );
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

            if (depth > 0) {
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
            const selection = editorState.getSelection();
            if (selection.isCollapsed()) {
                return RichUtils.insertSoftNewline(editorState);
            }

            return this.addLineBreakRemovingSelection(editorState);
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
