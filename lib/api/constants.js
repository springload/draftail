// @flow
import { DefaultDraftInlineStyle } from "draft-js";

// See https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftBlockRenderMap.js
export const BLOCK_TYPE = {
  // This is used to represent a normal text block (paragraph).
  UNSTYLED: "unstyled",
  HEADER_ONE: "header-one",
  HEADER_TWO: "header-two",
  HEADER_THREE: "header-three",
  HEADER_FOUR: "header-four",
  HEADER_FIVE: "header-five",
  HEADER_SIX: "header-six",
  UNORDERED_LIST_ITEM: "unordered-list-item",
  ORDERED_LIST_ITEM: "ordered-list-item",
  BLOCKQUOTE: "blockquote",
  CODE: "code-block",
  // This represents a "custom" block, not for rich text, with arbitrary content.
  ATOMIC: "atomic",
};

export const ENTITY_TYPE = {
  LINK: "LINK",
  IMAGE: "IMAGE",
  HORIZONTAL_RULE: "HORIZONTAL_RULE",
};

// See https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftInlineStyle.js
export const INLINE_STYLE = {
  BOLD: "BOLD",
  ITALIC: "ITALIC",
  CODE: "CODE",
  UNDERLINE: "UNDERLINE",
  STRIKETHROUGH: "STRIKETHROUGH",
  MARK: "MARK",
  QUOTATION: "QUOTATION",
  SMALL: "SMALL",
  SAMPLE: "SAMPLE",
  INSERT: "INSERT",
  DELETE: "DELETE",
  KEYBOARD: "KEYBOARD",
  SUPERSCRIPT: "SUPERSCRIPT",
  SUBSCRIPT: "SUBSCRIPT",
};

export const BLOCK_TYPES = Object.values(BLOCK_TYPE);
export const ENTITY_TYPES = Object.values(ENTITY_TYPE);
export const INLINE_STYLES = Object.values(INLINE_STYLE);

export const FONT_FAMILY_MONOSPACE =
  "Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif";

// See https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftInlineStyle.js
export const CUSTOM_STYLE_MAP = {};
CUSTOM_STYLE_MAP[INLINE_STYLE.BOLD] =
  DefaultDraftInlineStyle[INLINE_STYLE.BOLD];
CUSTOM_STYLE_MAP[INLINE_STYLE.ITALIC] =
  DefaultDraftInlineStyle[INLINE_STYLE.ITALIC];
CUSTOM_STYLE_MAP[INLINE_STYLE.STRIKETHROUGH] =
  DefaultDraftInlineStyle[INLINE_STYLE.STRIKETHROUGH];
CUSTOM_STYLE_MAP[INLINE_STYLE.UNDERLINE] =
  DefaultDraftInlineStyle[INLINE_STYLE.UNDERLINE];

CUSTOM_STYLE_MAP[INLINE_STYLE.CODE] = {
  padding: "0.2em 0.3125em",
  margin: "0",
  fontSize: "85%",
  backgroundColor: "rgba(27, 31, 35, 0.05)",
  fontFamily: FONT_FAMILY_MONOSPACE,
  borderRadius: "3px",
};

CUSTOM_STYLE_MAP[INLINE_STYLE.MARK] = {
  backgroundColor: "yellow",
};
CUSTOM_STYLE_MAP[INLINE_STYLE.QUOTATION] = {
  fontStyle: "italic",
};
CUSTOM_STYLE_MAP[INLINE_STYLE.SMALL] = {
  fontSize: "smaller",
};
CUSTOM_STYLE_MAP[INLINE_STYLE.SAMPLE] = {
  fontFamily: FONT_FAMILY_MONOSPACE,
};
CUSTOM_STYLE_MAP[INLINE_STYLE.INSERT] = {
  textDecoration: "underline",
};
CUSTOM_STYLE_MAP[INLINE_STYLE.DELETE] = {
  textDecoration: "line-through",
};
CUSTOM_STYLE_MAP[INLINE_STYLE.KEYBOARD] = {
  fontFamily: FONT_FAMILY_MONOSPACE,
  padding: "3px 5px",
  fontSize: "11px",
  lineHeight: "10px",
  color: "#444d56",
  verticalAlign: "middle",
  backgroundColor: "#fafbfc",
  border: "solid 1px #c6cbd1",
  borderBottomColor: "#959da5",
  borderRadius: "3px",
  boxShadow: "inset 0 -1px 0 #959da5",
};
CUSTOM_STYLE_MAP[INLINE_STYLE.SUPERSCRIPT] = {
  fontSize: "80%",
  verticalAlign: "super",
  lineHeight: "1",
};
CUSTOM_STYLE_MAP[INLINE_STYLE.SUBSCRIPT] = {
  fontSize: "80%",
  verticalAlign: "sub",
  lineHeight: "1",
};

export const BR_TYPE = "BR";

export const UNDO_TYPE = "undo";
export const REDO_TYPE = "redo";

// Originally from https://github.com/facebook/draft-js/blob/master/src/component/utils/getDefaultKeyBinding.js.
export const KEY_CODES = {
  K: 75,
  B: 66,
  U: 85,
  J: 74,
  I: 73,
  X: 88,
  "0": 48,
  "1": 49,
  "2": 50,
  "3": 51,
  "4": 52,
  "5": 53,
  "6": 54,
  "7": 55,
  "8": 56,
  ".": 190,
  ",": 188,
};

export const INPUT_BLOCK_MAP = {
  "* ": BLOCK_TYPE.UNORDERED_LIST_ITEM,
  "- ": BLOCK_TYPE.UNORDERED_LIST_ITEM,
  "1. ": BLOCK_TYPE.ORDERED_LIST_ITEM,
  "# ": BLOCK_TYPE.HEADER_ONE,
  "## ": BLOCK_TYPE.HEADER_TWO,
  "### ": BLOCK_TYPE.HEADER_THREE,
  "#### ": BLOCK_TYPE.HEADER_FOUR,
  "##### ": BLOCK_TYPE.HEADER_FIVE,
  "###### ": BLOCK_TYPE.HEADER_SIX,
  "> ": BLOCK_TYPE.BLOCKQUOTE,
  // It makes more sense not to require a space here.
  // This matches how Dropbox Paper operates.
  "```": BLOCK_TYPE.CODE,
};

export const INPUT_STYLE_MAP = [
  // Order matters, as shorter patterns are contained in the longer ones.
  { pattern: "**", type: INLINE_STYLE.BOLD },
  { pattern: "__", type: INLINE_STYLE.BOLD },
  { pattern: "*", type: INLINE_STYLE.ITALIC },
  { pattern: "_", type: INLINE_STYLE.ITALIC },
  { pattern: "~~", type: INLINE_STYLE.STRIKETHROUGH },
  { pattern: "~", type: INLINE_STYLE.STRIKETHROUGH },
  { pattern: "`", type: INLINE_STYLE.CODE },
].map<{|
  pattern: string,
  type: string,
  regex: string,
|}>(({ pattern, type }) => {
  const pat = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const char = pattern[0].replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // https://regexper.com/#%28%5Cs%7C%5E%29__%28%5B%5E%5Cs_%5D%7B1%2C2%7D%7C%5B%5E%5Cs_%5D.%2B%5B%5E%5Cs_%5D%29__%24
  // This is stored as an escaped string instead of a RegExp object because they are stateful.
  // This regex encapsulates a few rules:
  // - The pattern must be preceded by whitespace, or be at the start of the input.
  // - The pattern must end the input.
  // - In-between the start and end patterns, there can't be only whitespace or characters from the pattern.
  // - There has to be at least 1 char that's not whitespace or the pattern’s char.
  const regex = `(\\s|^)${pat}([^\\s${char}]{1,2}|[^\\s${char}].+[^\\s${char}])${pat}$`;

  return {
    pattern,
    type,
    regex,
  };
});

export const INPUT_ENTITY_MAP = {};

INPUT_ENTITY_MAP[ENTITY_TYPE.HORIZONTAL_RULE] = "---";

export const LABELS = {};

LABELS[BLOCK_TYPE.UNSTYLED] = "P";
LABELS[BLOCK_TYPE.HEADER_ONE] = "H1";
LABELS[BLOCK_TYPE.HEADER_TWO] = "H2";
LABELS[BLOCK_TYPE.HEADER_THREE] = "H3";
LABELS[BLOCK_TYPE.HEADER_FOUR] = "H4";
LABELS[BLOCK_TYPE.HEADER_FIVE] = "H5";
LABELS[BLOCK_TYPE.HEADER_SIX] = "H6";
LABELS[BLOCK_TYPE.UNORDERED_LIST_ITEM] = "UL";
LABELS[BLOCK_TYPE.ORDERED_LIST_ITEM] = "OL";
LABELS[BLOCK_TYPE.CODE] = "{ }";
LABELS[BLOCK_TYPE.BLOCKQUOTE] = "❝";

LABELS[INLINE_STYLE.BOLD] = "B";
LABELS[INLINE_STYLE.ITALIC] = "𝘐";
LABELS[INLINE_STYLE.CODE] = "{ }";
LABELS[INLINE_STYLE.UNDERLINE] = "U";
LABELS[INLINE_STYLE.STRIKETHROUGH] = "S";
LABELS[INLINE_STYLE.MARK] = "☆";
LABELS[INLINE_STYLE.QUOTATION] = "❛";
LABELS[INLINE_STYLE.SMALL] = "𝖲𝗆a𝗅𝗅";
LABELS[INLINE_STYLE.SAMPLE] = "𝙳𝚊𝚝𝚊";
LABELS[INLINE_STYLE.INSERT] = "Ins";
LABELS[INLINE_STYLE.DELETE] = "Del";
LABELS[INLINE_STYLE.SUPERSCRIPT] = "Sup";
LABELS[INLINE_STYLE.SUBSCRIPT] = "Sub";
LABELS[INLINE_STYLE.KEYBOARD] = "⌘";

LABELS[ENTITY_TYPE.LINK] = "🔗";
LABELS[ENTITY_TYPE.IMAGE] = "🖼";
LABELS[ENTITY_TYPE.HORIZONTAL_RULE] = "―";
LABELS[BR_TYPE] = "↵";

LABELS[UNDO_TYPE] = "↺";
LABELS[REDO_TYPE] = "↻";

export const DESCRIPTIONS = {};

DESCRIPTIONS[BLOCK_TYPE.UNSTYLED] = "Paragraph";
DESCRIPTIONS[BLOCK_TYPE.HEADER_ONE] = "Heading 1";
DESCRIPTIONS[BLOCK_TYPE.HEADER_TWO] = "Heading 2";
DESCRIPTIONS[BLOCK_TYPE.HEADER_THREE] = "Heading 3";
DESCRIPTIONS[BLOCK_TYPE.HEADER_FOUR] = "Heading 4";
DESCRIPTIONS[BLOCK_TYPE.HEADER_FIVE] = "Heading 5";
DESCRIPTIONS[BLOCK_TYPE.HEADER_SIX] = "Heading 6";
DESCRIPTIONS[BLOCK_TYPE.UNORDERED_LIST_ITEM] = "Bulleted list";
DESCRIPTIONS[BLOCK_TYPE.ORDERED_LIST_ITEM] = "Numbered list";
DESCRIPTIONS[BLOCK_TYPE.BLOCKQUOTE] = "Blockquote";
DESCRIPTIONS[BLOCK_TYPE.CODE] = "Code block";

DESCRIPTIONS[INLINE_STYLE.BOLD] = "Bold";
DESCRIPTIONS[INLINE_STYLE.ITALIC] = "Italic";
DESCRIPTIONS[INLINE_STYLE.CODE] = "Code";
DESCRIPTIONS[INLINE_STYLE.UNDERLINE] = "Underline";
DESCRIPTIONS[INLINE_STYLE.STRIKETHROUGH] = "Strikethrough";
DESCRIPTIONS[INLINE_STYLE.MARK] = "Highlight";
DESCRIPTIONS[INLINE_STYLE.QUOTATION] = "Inline quotation";
DESCRIPTIONS[INLINE_STYLE.SMALL] = "Small";
DESCRIPTIONS[INLINE_STYLE.SAMPLE] = "Program output";
DESCRIPTIONS[INLINE_STYLE.INSERT] = "Inserted";
DESCRIPTIONS[INLINE_STYLE.DELETE] = "Deleted";
DESCRIPTIONS[INLINE_STYLE.KEYBOARD] = "Shortcut key";
DESCRIPTIONS[INLINE_STYLE.SUPERSCRIPT] = "Superscript";
DESCRIPTIONS[INLINE_STYLE.SUBSCRIPT] = "Subscript";

DESCRIPTIONS[ENTITY_TYPE.LINK] = "Link";
DESCRIPTIONS[ENTITY_TYPE.IMAGE] = "Image";
DESCRIPTIONS[ENTITY_TYPE.HORIZONTAL_RULE] = "Horizontal line";

DESCRIPTIONS[BR_TYPE] = "Line break";

DESCRIPTIONS[UNDO_TYPE] = "Undo";
DESCRIPTIONS[REDO_TYPE] = "Redo";

export const KEYBOARD_SHORTCUTS = {};

KEYBOARD_SHORTCUTS[BLOCK_TYPE.UNSTYLED] = "⌫";
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_ONE] = "#";
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_TWO] = "##";
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_THREE] = "###";
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_FOUR] = "####";
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_FIVE] = "#####";
KEYBOARD_SHORTCUTS[BLOCK_TYPE.HEADER_SIX] = "######";
KEYBOARD_SHORTCUTS[BLOCK_TYPE.UNORDERED_LIST_ITEM] = "-";
KEYBOARD_SHORTCUTS[BLOCK_TYPE.ORDERED_LIST_ITEM] = "1.";
KEYBOARD_SHORTCUTS[BLOCK_TYPE.BLOCKQUOTE] = ">";
KEYBOARD_SHORTCUTS[BLOCK_TYPE.CODE] = "```";

KEYBOARD_SHORTCUTS[INLINE_STYLE.BOLD] = { other: "Ctrl + B", macOS: "⌘ + B" };
KEYBOARD_SHORTCUTS[INLINE_STYLE.ITALIC] = { other: "Ctrl + I", macOS: "⌘ + I" };
KEYBOARD_SHORTCUTS[INLINE_STYLE.UNDERLINE] = {
  other: "Ctrl + U",
  macOS: "⌘ + U",
};
KEYBOARD_SHORTCUTS[INLINE_STYLE.STRIKETHROUGH] = {
  other: "Ctrl + ⇧ + X",
  macOS: "⌘ + ⇧ + X",
};
KEYBOARD_SHORTCUTS[INLINE_STYLE.SUPERSCRIPT] = {
  other: "Ctrl + .",
  macOS: "⌘ + .",
};
KEYBOARD_SHORTCUTS[INLINE_STYLE.SUBSCRIPT] = {
  other: "Ctrl + ,",
  macOS: "⌘ + ,",
};

KEYBOARD_SHORTCUTS[ENTITY_TYPE.LINK] = { other: "Ctrl + K", macOS: "⌘ + K" };

KEYBOARD_SHORTCUTS[BR_TYPE] = "⇧ + ↵";
KEYBOARD_SHORTCUTS[ENTITY_TYPE.HORIZONTAL_RULE] = "- - -";

KEYBOARD_SHORTCUTS[UNDO_TYPE] = { other: "Ctrl + Z", macOS: "⌘ + Z" };
KEYBOARD_SHORTCUTS[REDO_TYPE] = { other: "Ctrl + ⇧ + Z", macOS: "⌘ + ⇧ + Z" };

export const HANDLED = "handled";
export const NOT_HANDLED = "not-handled";
