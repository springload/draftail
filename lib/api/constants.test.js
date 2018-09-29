import {
  BLOCK_TYPE,
  ENTITY_TYPE,
  INLINE_STYLE,
  BLOCK_TYPES,
  ENTITY_TYPES,
  INLINE_STYLES,
  FONT_FAMILY_MONOSPACE,
  CUSTOM_STYLE_MAP,
  BR_TYPE,
  UNDO_TYPE,
  REDO_TYPE,
  KEY_CODES,
  INPUT_BLOCK_MAP,
  INPUT_ENTITY_MAP,
  LABELS,
  DESCRIPTIONS,
  KEYBOARD_SHORTCUTS,
  HANDLED,
  NOT_HANDLED,
} from "./constants";

describe("constants", () => {
  it("#BLOCK_TYPE", () => expect(BLOCK_TYPE).toBeDefined());
  it("#ENTITY_TYPE", () => expect(ENTITY_TYPE).toBeDefined());
  it("#INLINE_STYLE", () => expect(INLINE_STYLE).toBeDefined());
  it("#BLOCK_TYPES", () => expect(BLOCK_TYPES).toBeDefined());
  it("#ENTITY_TYPES", () => expect(ENTITY_TYPES).toBeDefined());
  it("#INLINE_STYLES", () => expect(INLINE_STYLES).toBeDefined());
  it("#FONT_FAMILY_MONOSPACE", () =>
    expect(FONT_FAMILY_MONOSPACE).toBeDefined());
  it("#CUSTOM_STYLE_MAP", () => expect(CUSTOM_STYLE_MAP).toBeDefined());
  it("#BR_TYPE", () => expect(BR_TYPE).toBeDefined());
  it("#UNDO_TYPE", () => expect(UNDO_TYPE).toBeDefined());
  it("#REDO_TYPE", () => expect(REDO_TYPE).toBeDefined());
  it("#KEY_CODES", () => expect(KEY_CODES).toBeDefined());
  it("#INPUT_BLOCK_MAP", () => expect(INPUT_BLOCK_MAP).toBeDefined());
  it("#INPUT_ENTITY_MAP", () => expect(INPUT_ENTITY_MAP).toBeDefined());
  it("#LABELS", () => expect(LABELS).toBeDefined());
  it("#DESCRIPTIONS", () => expect(DESCRIPTIONS).toBeDefined());
  it("#KEYBOARD_SHORTCUTS", () => expect(KEYBOARD_SHORTCUTS).toBeDefined());
  it("#HANDLED", () => expect(HANDLED).toBeDefined());
  it("#NOT_HANDLED", () => expect(NOT_HANDLED).toBeDefined());
});
