import {
  DraftailEditor,
  DraftUtils,
  BLOCK_TYPE,
  ENTITY_TYPE,
  INLINE_STYLE,
  Icon,
  ToolbarButton,
  InlineToolbar,
} from "./index";

describe("draftail", () => {
  it("#DraftailEditor", () => expect(DraftailEditor).toBeDefined());

  it("#DraftUtils", () => expect(DraftUtils).toBeDefined());

  it("#BLOCK_TYPE", () => expect(BLOCK_TYPE).toBeDefined());

  it("#ENTITY_TYPE", () => expect(ENTITY_TYPE).toBeDefined());

  it("#INLINE_STYLE", () => expect(INLINE_STYLE).toBeDefined());

  it("#Icon", () => expect(Icon).toBeDefined());

  it("#ToolbarButton", () => expect(ToolbarButton).toBeDefined());

  it("#InlineToolbar", () => expect(InlineToolbar).toBeDefined());
});
