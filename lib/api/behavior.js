// @flow
import {
  DefaultDraftBlockRenderMap,
  getDefaultKeyBinding,
  KeyBindingUtil,
  EditorState,
} from "draft-js";
import type { ContentBlock } from "draft-js";
import { filterEditorState } from "draftjs-filters";
import { blockDepthStyleFn } from "draftjs-conductor";

import {
  ENTITY_TYPE,
  BLOCK_TYPE,
  KEY_CODES,
  KEYBOARD_SHORTCUTS,
  CUSTOM_STYLE_MAP,
  INPUT_BLOCK_MAP,
  INPUT_STYLE_MAP,
  INPUT_ENTITY_MAP,
  INLINE_STYLE,
} from "./constants";

const { hasCommandModifier, isOptionKeyCommand } = KeyBindingUtil;
const hasCmd = hasCommandModifier;

// Hack relying on the internals of Draft.js.
// See https://github.com/facebook/draft-js/pull/869
// $FlowFixMe
const IS_MAC_OS = isOptionKeyCommand({ altKey: "test" }) === "test";

/**
 * Methods defining the behavior of the editor, depending on its configuration.
 */
export default {
  /**
   * Configure block render map from block types list.
   */
  getBlockRenderMap(
    blockTypes: $ReadOnlyArray<{ type: string, element?: string }>,
  ) {
    let renderMap = DefaultDraftBlockRenderMap;

    // Override default element for code block.
    // Fix https://github.com/facebook/draft-js/issues/406.
    if (blockTypes.some((block) => block.type === BLOCK_TYPE.CODE)) {
      renderMap = renderMap.set(BLOCK_TYPE.CODE, {
        element: "code",
        wrapper: DefaultDraftBlockRenderMap.get(BLOCK_TYPE.CODE).wrapper,
      });
    }

    blockTypes.filter((block) => block.element).forEach((block) => {
      renderMap = renderMap.set(block.type, {
        element: block.element,
      });
    });

    return renderMap;
  },

  /**
   * block style function automatically adding a class with the block's type.
   */
  blockStyleFn(block: ContentBlock) {
    const type = block.getType();

    return `Draftail-block--${type} ${blockDepthStyleFn(block)}`;
  },

  /**
   * Configure key binding function from enabled blocks, styles, entities.
   */
  getKeyBindingFn(
    blockTypes: $ReadOnlyArray<{ type: string }>,
    inlineStyles: $ReadOnlyArray<{ type: string }>,
    entityTypes: $ReadOnlyArray<{ type: string }>,
  ) {
    const getEnabled = (activeTypes) =>
      activeTypes.reduce((enabled, type) => {
        enabled[type.type] = type.type;
        return enabled;
      }, {});

    const blocks = getEnabled(blockTypes);
    const styles = getEnabled(inlineStyles);
    const entities = getEnabled(entityTypes);

    // Emits key commands to use in `handleKeyCommand` in `Editor`.
    const keyBindingFn = (e: SyntheticKeyboardEvent<>) => {
      // Safeguard that we only trigger shortcuts with exact matches.
      // eg. cmd + shift + b should not trigger bold.
      if (e.shiftKey) {
        // Key bindings supported by Draft.js must be explicitely discarded.
        // See https://github.com/facebook/draft-js/issues/941.
        switch (e.keyCode) {
          case KEY_CODES.B:
            return undefined;
          case KEY_CODES.I:
            return undefined;
          case KEY_CODES.J:
            return undefined;
          case KEY_CODES.U:
            return undefined;
          case KEY_CODES.X:
            return hasCmd(e) && styles[INLINE_STYLE.STRIKETHROUGH];
          case KEY_CODES[7]:
            return hasCmd(e) && blocks[BLOCK_TYPE.ORDERED_LIST_ITEM];
          case KEY_CODES[8]:
            return hasCmd(e) && blocks[BLOCK_TYPE.UNORDERED_LIST_ITEM];
          default:
            return getDefaultKeyBinding(e);
        }
      }

      const ctrlAlt = (e.ctrlKey || e.metaKey) && e.altKey;

      switch (e.keyCode) {
        case KEY_CODES.K:
          return hasCmd(e) && entities.LINK;
        case KEY_CODES.B:
          return hasCmd(e) && styles[INLINE_STYLE.BOLD];
        case KEY_CODES.I:
          return hasCmd(e) && styles[INLINE_STYLE.ITALIC];
        case KEY_CODES.J:
          return hasCmd(e) && styles[INLINE_STYLE.CODE];
        case KEY_CODES.U:
          return hasCmd(e) && styles[INLINE_STYLE.UNDERLINE];
        case KEY_CODES["."]:
          return hasCmd(e) && styles[INLINE_STYLE.SUPERSCRIPT];
        case KEY_CODES[","]:
          return hasCmd(e) && styles[INLINE_STYLE.SUBSCRIPT];
        case KEY_CODES[0]:
          // Reverting to unstyled block is always available.
          return ctrlAlt && BLOCK_TYPE.UNSTYLED;
        case KEY_CODES[1]:
          return ctrlAlt && blocks[BLOCK_TYPE.HEADER_ONE];
        case KEY_CODES[2]:
          return ctrlAlt && blocks[BLOCK_TYPE.HEADER_TWO];
        case KEY_CODES[3]:
          return ctrlAlt && blocks[BLOCK_TYPE.HEADER_THREE];
        case KEY_CODES[4]:
          return ctrlAlt && blocks[BLOCK_TYPE.HEADER_FOUR];
        case KEY_CODES[5]:
          return ctrlAlt && blocks[BLOCK_TYPE.HEADER_FIVE];
        case KEY_CODES[6]:
          return ctrlAlt && blocks[BLOCK_TYPE.HEADER_SIX];
        default:
          return getDefaultKeyBinding(e);
      }
    };

    return keyBindingFn;
  },

  hasKeyboardShortcut(type: string) {
    return !!KEYBOARD_SHORTCUTS[type];
  },

  getKeyboardShortcut(type: string, isMacOS: boolean = IS_MAC_OS) {
    const shortcut = KEYBOARD_SHORTCUTS[type];
    const system = isMacOS ? "macOS" : "other";

    return (shortcut && shortcut[system]) || shortcut;
  },

  /**
   * Defines whether a block should be altered to a new type when
   * the user types a given mark.
   * This powers the "autolist" feature.
   *
   * Returns the new block type, or false if no replacement should occur.
   */
  handleBeforeInputBlockType(
    mark: string,
    blockTypes: $ReadOnlyArray<{ type: string }>,
  ) {
    return blockTypes.find((b) => b.type === INPUT_BLOCK_MAP[mark])
      ? INPUT_BLOCK_MAP[mark]
      : false;
  },

  handleBeforeInputHR(mark: string, block: ContentBlock) {
    return (
      mark === INPUT_ENTITY_MAP[ENTITY_TYPE.HORIZONTAL_RULE] &&
      block.getType() !== BLOCK_TYPE.CODE
    );
  },

  handleBeforeInputInlineStyle(
    beforeInput: string,
    inlineStyles: $ReadOnlyArray<{ type: string }>,
  ) {
    const activeShortcuts = INPUT_STYLE_MAP.filter((shortcut) =>
      inlineStyles.some((s) => s.type === shortcut[1]),
    );

    // This is so matching happens based on the Markdown shortcuts closest to the cursor, in case the text contains
    // multiple shortcuts.
    // This reversing ignores combining marks and astral symbols. This is fine, since shortcuts are ASCII-only.
    // See https://github.com/mathiasbynens/esrever for further details.
    const input = beforeInput
      .split("")
      .reverse()
      .join("");
    let firstMatch;
    let secondMatch;

    const match = activeShortcuts.find(([pattern]) => {
      const regex = new RegExp(
        pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "g",
      );
      firstMatch = regex.exec(input);
      secondMatch = regex.exec(input);

      return (
        firstMatch &&
        secondMatch &&
        // The two matches aren't side by side.
        firstMatch.index + pattern.length !== secondMatch.index &&
        // The first match is at the end of the text / start of reversed text.
        firstMatch.index === 0 &&
        // Second match is at the start of the text / end of reversed text, or preceded (followed) by whitespace.
        // This helps prevent patterns like “Use either _privateMethod(), or _[...]” from matching.
        (secondMatch.index + pattern.length === input.length ||
          /\s/.test(input[secondMatch.index + pattern.length]))
      );
    });

    return firstMatch && secondMatch && match
      ? {
          pattern: match[0],
          start: input.length - secondMatch.index - match[0].length,
          end: input.length - firstMatch.index,
          length: secondMatch.index + match[0].length - firstMatch.index,
          type: match[1],
        }
      : false;
  },

  getCustomStyleMap(
    inlineStyles: $ReadOnlyArray<{ type: string, style?: {} }>,
  ) {
    const customStyleMap = {};

    inlineStyles.forEach((style) => {
      if (style.style) {
        customStyleMap[style.type] = style.style;
      } else if (CUSTOM_STYLE_MAP[style.type]) {
        customStyleMap[style.type] = CUSTOM_STYLE_MAP[style.type];
      } else {
        customStyleMap[style.type] = {};
      }
    });

    return customStyleMap;
  },

  /**
   * Applies whitelist and blacklist operations to the editor content,
   * so the resulting editor state is shaped according to Draftail
   * expectations and configuration.
   */
  filterPaste(
    {
      maxListNesting,
      enableHorizontalRule,
      enableLineBreak,
      blockTypes,
      inlineStyles,
      entityTypes,
    }: {
      maxListNesting: number,
      enableHorizontalRule: boolean | {},
      enableLineBreak: boolean | {},
      blockTypes: $ReadOnlyArray<{ type: string }>,
      inlineStyles: $ReadOnlyArray<{ type: string }>,
      entityTypes: $ReadOnlyArray<{
        type: string,
        attributes?: $ReadOnlyArray<string>,
        whitelist?: {
          [attribute: string]: string | boolean,
        },
      }>,
    },
    editorState: EditorState,
  ) {
    const enabledEntityTypes = entityTypes.slice();
    const whitespacedCharacters = ["\t", "📷"];

    if (enableHorizontalRule) {
      enabledEntityTypes.push({
        type: ENTITY_TYPE.HORIZONTAL_RULE,
      });
    }

    if (!enableLineBreak) {
      whitespacedCharacters.push("\n");
    }

    return filterEditorState(
      {
        blocks: blockTypes.map((b) => b.type),
        styles: inlineStyles.map((s) => s.type),
        entities: enabledEntityTypes,
        maxNesting: maxListNesting,
        whitespacedCharacters,
      },
      editorState,
    );
  },
};
