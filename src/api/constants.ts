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
} as const;

export type BlockType = typeof BLOCK_TYPE[keyof typeof BLOCK_TYPE];

export const ENTITY_TYPE = {
  LINK: "LINK",
  IMAGE: "IMAGE",
  HORIZONTAL_RULE: "HORIZONTAL_RULE",
} as const;

export type EntityType = typeof ENTITY_TYPE[keyof typeof ENTITY_TYPE];

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
} as const;

export type InlineStyle = typeof INLINE_STYLE[keyof typeof INLINE_STYLE];

const BLOCK_TYPES = Object.values(BLOCK_TYPE);
const ENTITY_TYPES = Object.values(ENTITY_TYPE);
const INLINE_STYLES = Object.values(INLINE_STYLE);

export const KEY_COMMANDS = [
  ...BLOCK_TYPES,
  ...ENTITY_TYPES,
  ...INLINE_STYLES,
  // Lowercase identifiers used by Draft.js
  // See https://github.com/facebook/draft-js/blob/585af35c3a8c31fefb64bc884d4001faa96544d3/src/model/constants/DraftEditorCommand.js#L58-L61.
  "bold",
  "italic",
  "underline",
  "code",
] as const;

export type KnownKeyCommand = typeof KEY_COMMANDS[number];

export const FONT_FAMILY_MONOSPACE =
  "Consolas, Menlo, Monaco, Lucida Console, Liberation Mono, DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace, sans-serif";

// See https://github.com/facebook/draft-js/blob/master/src/model/immutable/DefaultDraftInlineStyle.js
export const CUSTOM_STYLE_MAP = {
  [INLINE_STYLE.BOLD]: {
    fontWeight: "bold",
  },
  [INLINE_STYLE.ITALIC]: {
    fontStyle: "italic",
  },
  [INLINE_STYLE.STRIKETHROUGH]: {
    textDecoration: "line-through",
  },
  [INLINE_STYLE.UNDERLINE]: {
    textDecoration: "underline",
  },
  [INLINE_STYLE.CODE]: {
    padding: "0.2em 0.3125em",
    margin: "0",
    fontSize: "85%",
    backgroundColor: "rgba(27, 31, 35, 0.05)",
    fontFamily: FONT_FAMILY_MONOSPACE,
    borderRadius: "3px",
  },
  [INLINE_STYLE.MARK]: {
    backgroundColor: "yellow",
  },
  [INLINE_STYLE.QUOTATION]: {
    fontStyle: "italic",
  },
  [INLINE_STYLE.SMALL]: {
    fontSize: "smaller",
  },
  [INLINE_STYLE.SAMPLE]: {
    fontFamily: FONT_FAMILY_MONOSPACE,
  },
  [INLINE_STYLE.INSERT]: {
    textDecoration: "underline",
  },
  [INLINE_STYLE.DELETE]: {
    textDecoration: "line-through",
  },
  [INLINE_STYLE.KEYBOARD]: {
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
  },
  [INLINE_STYLE.SUPERSCRIPT]: {
    fontSize: "80%",
    verticalAlign: "super",
    lineHeight: "1",
  },
  [INLINE_STYLE.SUBSCRIPT]: {
    fontSize: "80%",
    verticalAlign: "sub",
    lineHeight: "1",
  },
} as const;

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
} as const;

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
} as const;

export const INPUT_STYLE_MAP = [
  // Order matters, as shorter patterns are contained in the longer ones.
  { pattern: "**", type: INLINE_STYLE.BOLD },
  { pattern: "__", type: INLINE_STYLE.BOLD },
  { pattern: "*", type: INLINE_STYLE.ITALIC },
  { pattern: "_", type: INLINE_STYLE.ITALIC },
  { pattern: "~~", type: INLINE_STYLE.STRIKETHROUGH },
  { pattern: "~", type: INLINE_STYLE.STRIKETHROUGH },
  { pattern: "`", type: INLINE_STYLE.CODE },
].map(({ pattern, type }) => {
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

export const INPUT_ENTITY_MAP = {
  [ENTITY_TYPE.HORIZONTAL_RULE]: "---",
} as const;

export const LABELS = {
  [BLOCK_TYPE.UNSTYLED]: "P",
  [BLOCK_TYPE.HEADER_ONE]: "H1",
  [BLOCK_TYPE.HEADER_TWO]: "H2",
  [BLOCK_TYPE.HEADER_THREE]: "H3",
  [BLOCK_TYPE.HEADER_FOUR]: "H4",
  [BLOCK_TYPE.HEADER_FIVE]: "H5",
  [BLOCK_TYPE.HEADER_SIX]: "H6",
  [BLOCK_TYPE.UNORDERED_LIST_ITEM]: "UL",
  [BLOCK_TYPE.ORDERED_LIST_ITEM]: "OL",
  [BLOCK_TYPE.CODE]: "{ }",
  [BLOCK_TYPE.BLOCKQUOTE]: "❝",

  [INLINE_STYLE.BOLD]: "𝐁",
  [INLINE_STYLE.ITALIC]: "𝘐",
  [INLINE_STYLE.CODE]: "{ }",
  [INLINE_STYLE.UNDERLINE]: "U",
  [INLINE_STYLE.STRIKETHROUGH]: "S",
  [INLINE_STYLE.MARK]: "☆",
  [INLINE_STYLE.QUOTATION]: "❛",
  [INLINE_STYLE.SMALL]: "Small",
  [INLINE_STYLE.SAMPLE]: "Data",
  [INLINE_STYLE.INSERT]: "Ins",
  [INLINE_STYLE.DELETE]: "Del",
  [INLINE_STYLE.SUPERSCRIPT]: "Sup",
  [INLINE_STYLE.SUBSCRIPT]: "Sub",
  [INLINE_STYLE.KEYBOARD]: "⌘",

  [ENTITY_TYPE.LINK]: "🔗",
  [ENTITY_TYPE.IMAGE]: "🖼",
  [ENTITY_TYPE.HORIZONTAL_RULE]: "―",
  [BR_TYPE]: "↵",

  [UNDO_TYPE]: "↺",
  [REDO_TYPE]: "↻",
} as const;

export const DESCRIPTIONS = {
  [BLOCK_TYPE.UNSTYLED]: "Paragraph",
  [BLOCK_TYPE.HEADER_ONE]: "Heading 1",
  [BLOCK_TYPE.HEADER_TWO]: "Heading 2",
  [BLOCK_TYPE.HEADER_THREE]: "Heading 3",
  [BLOCK_TYPE.HEADER_FOUR]: "Heading 4",
  [BLOCK_TYPE.HEADER_FIVE]: "Heading 5",
  [BLOCK_TYPE.HEADER_SIX]: "Heading 6",
  [BLOCK_TYPE.UNORDERED_LIST_ITEM]: "Bulleted list",
  [BLOCK_TYPE.ORDERED_LIST_ITEM]: "Numbered list",
  [BLOCK_TYPE.BLOCKQUOTE]: "Blockquote",
  [BLOCK_TYPE.CODE]: "Code block",

  [INLINE_STYLE.BOLD]: "Bold",
  [INLINE_STYLE.ITALIC]: "Italic",
  [INLINE_STYLE.CODE]: "Code",
  [INLINE_STYLE.UNDERLINE]: "Underline",
  [INLINE_STYLE.STRIKETHROUGH]: "Strikethrough",
  [INLINE_STYLE.MARK]: "Highlight",
  [INLINE_STYLE.QUOTATION]: "Inline quotation",
  [INLINE_STYLE.SMALL]: "Small",
  [INLINE_STYLE.SAMPLE]: "Program output",
  [INLINE_STYLE.INSERT]: "Inserted",
  [INLINE_STYLE.DELETE]: "Deleted",
  [INLINE_STYLE.KEYBOARD]: "Shortcut key",
  [INLINE_STYLE.SUPERSCRIPT]: "Superscript",
  [INLINE_STYLE.SUBSCRIPT]: "Subscript",

  [ENTITY_TYPE.LINK]: "Link",
  [ENTITY_TYPE.IMAGE]: "Image",
  [ENTITY_TYPE.HORIZONTAL_RULE]: "Horizontal line",

  [BR_TYPE]: "Line break",

  [UNDO_TYPE]: "Undo",
  [REDO_TYPE]: "Redo",
} as const;

export type KnownFormatType = keyof typeof LABELS;

export const KEYBOARD_SHORTCUTS = {
  [BLOCK_TYPE.UNSTYLED]: "⌫",
  [BLOCK_TYPE.HEADER_ONE]: "#",
  [BLOCK_TYPE.HEADER_TWO]: "##",
  [BLOCK_TYPE.HEADER_THREE]: "###",
  [BLOCK_TYPE.HEADER_FOUR]: "####",
  [BLOCK_TYPE.HEADER_FIVE]: "#####",
  [BLOCK_TYPE.HEADER_SIX]: "######",
  [BLOCK_TYPE.UNORDERED_LIST_ITEM]: "-",
  [BLOCK_TYPE.ORDERED_LIST_ITEM]: "1.",
  [BLOCK_TYPE.BLOCKQUOTE]: ">",
  [BLOCK_TYPE.CODE]: "```",

  [INLINE_STYLE.BOLD]: { other: "Ctrl + B", macOS: "⌘ + B" },
  [INLINE_STYLE.ITALIC]: { other: "Ctrl + I", macOS: "⌘ + I" },
  [INLINE_STYLE.UNDERLINE]: {
    other: "Ctrl + U",
    macOS: "⌘ + U",
  },
  [INLINE_STYLE.STRIKETHROUGH]: {
    other: "Ctrl + ⇧ + X",
    macOS: "⌘ + ⇧ + X",
  },
  [INLINE_STYLE.SUPERSCRIPT]: {
    other: "Ctrl + .",
    macOS: "⌘ + .",
  },
  [INLINE_STYLE.SUBSCRIPT]: {
    other: "Ctrl + ,",
    macOS: "⌘ + ,",
  },

  [ENTITY_TYPE.LINK]: { other: "Ctrl + K", macOS: "⌘ + K" },

  [BR_TYPE]: "⇧ + ↵",
  [ENTITY_TYPE.HORIZONTAL_RULE]: "- - -",

  [UNDO_TYPE]: { other: "Ctrl + Z", macOS: "⌘ + Z" },
  [REDO_TYPE]: { other: "Ctrl + ⇧ + Z", macOS: "⌘ + ⇧ + Z" },
} as const;

export type KeyboardShortcutType = keyof typeof KEYBOARD_SHORTCUTS;

export const HANDLED = "handled";
export const NOT_HANDLED = "not-handled";
