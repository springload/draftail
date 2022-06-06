// @flow
import type { ContentState, ContentBlock, EditorState } from "draft-js";

declare module "draftjs-filters" {
  /**
   * Parameters to determine which entity instances to keep.
   */
  declare export type EntityRule = {
    type: string,
    attributes?: $ReadOnlyArray<string>,
    allowlist?: { [attribute: string]: string | boolean },
    whitelist?: { [attribute: string]: string | boolean },
  };
  /**
   * Clones entities in the entityMap, so each range points to its own entity instance.
   * This only clones entities as necessary – if an entity is only referenced
   * in a single range, it won't be changed.
   */
  declare export function cloneEntities(content: ContentState): ContentState;
  /**
   * Filters entity ranges (where entities are applied on text) based on the result of
   * the callback function. Returning true keeps the entity range, false removes it.
   * Draft.js automatically removes entities if they are not applied on any text.
   */
  declare export function filterEntityRanges(
    filterFn: (
      content: ContentState,
      entityKey: string,
      block: ContentBlock,
    ) => boolean,
    content: ContentState,
  ): ContentState;
  /**
   * Keeps all entity types (images, links, documents, embeds) that are enabled.
   */
  declare export function shouldKeepEntityType(
    allowlist: $ReadOnlyArray<EntityRule>,
    type: string,
  ): boolean;
  /**
   * Removes invalid images – they should only be in atomic blocks.
   * This only removes the image entity, not the camera emoji (📷) that Draft.js inserts.
   */
  declare export function shouldRemoveImageEntity(
    entityType: string,
    blockType: string,
  ): boolean;
  /**
   * Filters entities based on the data they contain.
   */
  declare export function shouldKeepEntityByAttribute(
    entityTypes: $ReadOnlyArray<EntityRule>,
    entityType: string,
    data: {},
  ): boolean;
  /**
   * Filters data on an entity to only retain what is allowed.
   * This is crucial for IMAGE and LINK, where Draft.js adds a lot
   * of unneeded attributes (width, height, etc).
   */
  declare export function filterEntityData(
    entityTypes: $ReadOnlyArray<EntityRule>,
    content: ContentState,
  ): ContentState;

  /**
   * Creates atomic blocks where they would be required for a block-level entity
   * to work correctly, when such an entity exists.
   * Note: at the moment, this is only useful for IMAGE entities that Draft.js
   * injects on arbitrary blocks on paste.
   */
  declare export function preserveAtomicBlocks(
    content: ContentState,
  ): ContentState;
  /**
   * Resets atomic blocks to have a single-space char and no styles.
   * This is how they are stored by Draft.js by default.
   */
  declare export function resetAtomicBlocks(
    content: ContentState,
  ): ContentState;
  /**
   * Removes atomic blocks for which the entity type isn't allowed.
   */
  declare export function removeInvalidAtomicBlocks(
    allowlist: $ReadOnlyArray<EntityRule>,
    content: ContentState,
  ): ContentState;

  /**
   * Removes blocks that have a non-zero depth, and aren't list items.
   * Happens with Apple Pages inserting `unstyled` items between list items.
   */
  declare export function removeInvalidDepthBlocks(
    content: ContentState,
  ): ContentState;
  /**
   * Rules used to automatically convert blocks from one type to another
   * based on the block’s text. Also supports setting the block depth.
   * Defaults to the filters’ built-in block prefix rules.
   */
  declare export type BlockTextRule = {|
    test: string,
    type: string,
    depth: number,
  |};

  /**
   * Changes block type and depth based on the block's text. – some word processors
   * add a specific prefix within the text, eg. "· Bulleted list" in Word 2010.
   * Also removes the matched text.
   * This is meant first and foremost for list items where the list bullet or numeral
   * ends up in the text. Other use cases may not be well covered.
   */
  declare export function preserveBlockByText(
    rules: $ReadOnlyArray<BlockTextRule>,
    content: ContentState,
  ): ContentState;
  /**
   * Resets the depth of all the content to at most max.
   */
  declare export function limitBlockDepth(
    max: number,
    content: ContentState,
  ): ContentState;
  /**
   * Converts all block types not present in the list to unstyled.
   * Also sets depth to 0 (for potentially nested list items).
   */
  declare export function filterBlockTypes(
    allowlist: $ReadOnlyArray<string>,
    content: ContentState,
  ): ContentState;

  /**
   * Removes all styles not present in the list.
   */
  declare export function filterInlineStyles(
    allowlist: $ReadOnlyArray<string>,
    content: ContentState,
  ): ContentState;

  /**
   * Replaces the given characters by their equivalent length of spaces, in all blocks.
   */
  declare export function replaceTextBySpaces(
    characters: $ReadOnlyArray<string>,
    content: ContentState,
  ): ContentState;

  /**
   * Applies the new content to the editor state, optionally moving the selection
   * to be on a valid block, inserting one if needed.
   * See https://github.com/thibaudcolas/draftjs-filters/issues/27.
   */
  declare export function applyContentWithSelection(
    editorState: EditorState,
    content: ContentState,
    nextContent: ContentState,
  ): EditorState;

  declare export type FilterOptions = {|
    blocks: $ReadOnlyArray<string>,
    styles: $ReadOnlyArray<string>,
    entities: $ReadOnlyArray<EntityRule>,
    maxNesting: number,
    whitespacedCharacters: $ReadOnlyArray<string>,
    blockTextRules?: $ReadOnlyArray<BlockTextRule>,
  |};
  /**
   * Applies filtering and preservation operations to the editor content,
   * to restrict it to supported patterns.
   * Will not alter the editor state if there are no changes to make.
   */
  declare export function filterEditorState(
    options: FilterOptions,
    editorState: EditorState,
  ): EditorState;
  /**
   * Condenses an array of content blocks into a single block.
   * - Skipping the undo-redo stack.
   * - Adding a space between each block to match the behavior of vanilla HTML fields.
   * - Making sure the space gets the correct styles or entities applied.
   * - Placing the selection at the same end offset as the last selection.
   *
   * This exhibits two known issues:
   * - A link / other entity spread over multiple lines will be split into multiple entities of identical data.
   * - Upon redo-ing the change, the selection isn’t correctly placed.
   */
  declare export function condenseBlocks(
    nextState: EditorState,
    prevState: EditorState,
  ): EditorState;
}
