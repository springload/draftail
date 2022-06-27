import { List, Repeat } from "immutable";
import {
  RichUtils,
  EditorState,
  convertFromHTML,
  ContentState,
  convertFromRaw,
  CharacterMetadata,
  ContentBlock,
  convertToRaw,
  RawDraftContentState,
} from "draft-js";

import React from "react";
import DraftUtils from "./DraftUtils";

describe("DraftUtils", () => {
  describe("#getSelectedBlock", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);

      expect(DraftUtils.getSelectedBlock(editorState).getText()).toBe("test");
    });
  });

  describe("#getSelectionEntity", () => {
    it("no entity", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);

      expect(DraftUtils.getSelectionEntity(editorState)).not.toBeDefined();
    });

    it("collapsed within", () => {
      let content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      let editorState = EditorState.createWithContent(content);
      content = content.createEntity("LINK", "MUTABLE", {
        url: "www.testing.com",
      });
      const entityKey = content.getLastCreatedEntityKey();
      editorState = RichUtils.toggleLink(
        editorState,
        editorState.getSelection().merge({
          anchorOffset: 2,
          focusOffset: 2,
        }),
        entityKey,
      );

      expect(DraftUtils.getSelectionEntity(editorState)).not.toBeDefined();
    });

    it("full entity", () => {
      let content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      let editorState = EditorState.createWithContent(content);
      content = content.createEntity("LINK", "MUTABLE", {
        url: "www.testing.com",
      });
      const entityKey = content.getLastCreatedEntityKey();
      editorState = RichUtils.toggleLink(
        editorState,
        editorState.getSelection().merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        entityKey,
      );

      expect(DraftUtils.getSelectionEntity(editorState)).toBe(entityKey);
    });

    it("two entities", () => {
      let content = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      let editorState = EditorState.createWithContent(content);
      content = content.createEntity("LINK", "MUTABLE", {
        url: "www.testing.com",
      });
      editorState = RichUtils.toggleLink(
        editorState,
        editorState.getSelection().merge({
          anchorOffset: 0,
          focusOffset: 2,
        }),
        content.getLastCreatedEntityKey(),
      );
      content = content.createEntity("LINK", "MUTABLE", {
        url: "www.example.com",
      });
      editorState = RichUtils.toggleLink(
        editorState,
        editorState.getSelection().merge({
          anchorOffset: 2,
          focusOffset: 4,
        }),
        content.getLastCreatedEntityKey(),
      );
      editorState = EditorState.forceSelection(
        editorState,
        editorState.getSelection().merge({
          anchorOffset: 0,
          focusOffset: 4,
        }),
      );

      expect(DraftUtils.getSelectionEntity(editorState)).not.toBeDefined();
    });
  });

  describe("#getEntitySelection", () => {
    it("works", () => {
      const content = ContentState.createFromText("hello, world");
      let editorState = EditorState.createWithContent(content);
      const selection = editorState.getSelection().merge({
        anchorOffset: 0,
        focusOffset: 4,
      });

      const contentStateWithEntity = content.createEntity("LINK", "MUTABLE", {
        url: "www.testing.com",
      });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      editorState = RichUtils.toggleLink(editorState, selection, entityKey);
      editorState = EditorState.forceSelection(
        editorState,
        selection.merge({ focusOffset: 0 }),
      );
      expect(
        DraftUtils.getEntitySelection(editorState, entityKey).toJS(),
      ).toMatchObject({
        anchorOffset: 0,
        focusOffset: 4,
      });
    });

    it("supports backwards selections (#168)", () => {
      const content = ContentState.createFromText("hello, world");
      let editorState = EditorState.createWithContent(content);
      const selection = editorState.getSelection().merge({
        anchorOffset: 5,
        focusOffset: 0,
        isBackward: true,
      });
      const contentStateWithEntity = content.createEntity("LINK", "MUTABLE", {
        url: "www.testing.com",
      });
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      editorState = RichUtils.toggleLink(editorState, selection, entityKey);
      editorState = EditorState.forceSelection(
        editorState,
        selection.merge({ anchorOffset: 0 }),
      );
      expect(
        DraftUtils.getEntitySelection(editorState, entityKey).toJS(),
      ).toMatchObject({
        anchorOffset: 5,
        focusOffset: 0,
        isBackward: true,
      });
    });

    it("entity not found should not change selection (#168)", () => {
      const content = ContentState.createFromText("hello, world");
      const editorState = EditorState.createWithContent(content);
      expect(DraftUtils.getEntitySelection(editorState, "1")).toBe(
        editorState.getSelection(),
      );
    });

    it("missing entity key should not change selection (#168)", () => {
      const content = ContentState.createFromText("hello, world");
      const editorState = EditorState.createWithContent(content);
      expect(DraftUtils.getEntitySelection(editorState, undefined)).toBe(
        editorState.getSelection(),
      );
    });
  });

  describe("#updateBlockEntity", () => {
    it("works", () => {
      const content = convertFromRaw({
        entityMap: {
          1: {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {
              src: "example.png",
            },
          },
        },
        blocks: [
          {
            key: "b0ei9",
            text: " ",
            type: "atomic",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [{ offset: 0, length: 1, key: 1 }],
          },
        ],
      } as RawDraftContentState);
      const editorState = DraftUtils.updateBlockEntity(
        EditorState.createWithContent(content),
        content.getFirstBlock(),
        {
          alt: "Test",
        },
      );

      expect(
        editorState
          .getCurrentContent()
          .getEntity(content.getFirstBlock().getEntityAt(0))
          .getData(),
      ).toMatchObject({
        src: "example.png",
        alt: "Test",
      });
    });
  });

  describe("#addHorizontalRuleRemovingSelection", () => {
    it("works", () => {
      const editorState = DraftUtils.addHorizontalRuleRemovingSelection(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(`<h1>Test</h1>`).contentBlocks,
          ),
        ),
      );
      const currentContent = editorState.getCurrentContent();
      const lastBlock = currentContent.getLastBlock();

      expect(lastBlock.getType()).toBe("unstyled");
      expect(currentContent.getBlockBefore(lastBlock.getKey())!.getType()).toBe(
        "atomic",
      );

      const lastEntity = currentContent.getEntity(
        currentContent.getLastCreatedEntityKey(),
      );
      expect(lastEntity.getType()).toBe("HORIZONTAL_RULE");
    });
  });

  describe("#resetBlockWithType", () => {
    it("works", () => {
      const editorState = DraftUtils.resetBlockWithType(
        EditorState.createWithContent(
          ContentState.createFromBlockArray(
            convertFromHTML(`<h1>Test</h1>`).contentBlocks,
          ),
        ),
        "header-two",
        "",
      );

      expect(editorState.getCurrentContent().getFirstBlock().getType()).toBe(
        "header-two",
      );
    });

    it("preserves styles", () => {
      const editorState = DraftUtils.resetBlockWithType(
        EditorState.createWithContent(
          convertFromRaw({
            entityMap: {},
            blocks: [
              {
                key: "a",
                text: "test bold",
                inlineStyleRanges: [
                  {
                    style: "BOLD",
                    offset: 5,
                    length: 4,
                  },
                ],
              },
            ],
          } as RawDraftContentState),
        ),
        "header-two",
        "test bold",
      );

      expect(
        convertToRaw(editorState.getCurrentContent()).blocks[0],
      ).toMatchObject({
        key: "a",
        type: "header-two",
        text: "test bold",
        inlineStyleRanges: [{ length: 4, offset: 5, style: "BOLD" }],
      });
    });

    it("can set data", () => {
      const editorState = DraftUtils.resetBlockWithType(
        EditorState.createWithContent(
          convertFromRaw({
            entityMap: {},
            blocks: [
              {
                key: "a",
                text: "test bold",
                data: {},
              },
            ],
          } as RawDraftContentState),
        ),
        "header-two",
        "test bold",
        { test: true },
      );

      expect(
        convertToRaw(editorState.getCurrentContent()).blocks[0],
      ).toMatchObject({
        key: "a",
        type: "header-two",
        text: "test bold",
        data: { test: true },
      });
    });
  });

  describe("#applyMarkdownStyle", () => {
    it("works", () => {
      let editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(`<p>This is a _Test_</p>`).contentBlocks,
        ),
      );
      editorState = EditorState.moveFocusToEnd(editorState);
      editorState = DraftUtils.applyMarkdownStyle(
        editorState,
        {
          start: 10,
          end: 16,
          pattern: "_",
          type: "ITALIC",
        },
        "!",
      );

      expect(
        convertToRaw(editorState.getCurrentContent()).blocks[0],
      ).toMatchObject({
        text: "This is a Test!",
        inlineStyleRanges: [{ length: 4, offset: 10, style: "ITALIC" }],
      });
      expect(editorState.getSelection().toJS()).toMatchObject({
        anchorOffset: 15,
        focusOffset: 15,
      });
    });

    it("stacks styles", () => {
      let editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(`<p>This is a _<strong>Test</strong>_</p>`)
            .contentBlocks,
        ),
      );
      editorState = EditorState.moveFocusToEnd(editorState);
      editorState = DraftUtils.applyMarkdownStyle(
        editorState,
        {
          start: 10,
          end: 16,
          pattern: "_",
          type: "ITALIC",
        },
        "!",
      );

      expect(
        convertToRaw(editorState.getCurrentContent()).blocks[0],
      ).toMatchObject({
        text: "This is a Test!",
        inlineStyleRanges: [
          { length: 4, offset: 10, style: "BOLD" },
          { length: 4, offset: 10, style: "ITALIC" },
        ],
      });
    });

    it("respects entities", () => {
      let editorState = EditorState.createWithContent(
        convertFromRaw({
          entityMap: {
            1: {
              type: "LINK",
              mutability: "MUTABLE",
              data: {
                url: "/test",
              },
            },
          },
          blocks: [
            {
              key: "a",
              text: "A _test_",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [
                {
                  key: 1,
                  offset: 3,
                  length: 4,
                },
              ],
            },
          ],
        }),
      );
      editorState = EditorState.moveFocusToEnd(editorState);
      editorState = DraftUtils.applyMarkdownStyle(
        editorState,
        {
          start: 2,
          end: 8,
          pattern: "_",
          type: "ITALIC",
        },
        "!",
      );

      expect(
        convertToRaw(editorState.getCurrentContent()).blocks[0],
      ).toMatchObject({
        text: "A test!",
        inlineStyleRanges: [{ length: 4, offset: 2, style: "ITALIC" }],
        entityRanges: [{ length: 4, offset: 2 }],
      });
    });

    it("supports arbitrary markers", () => {
      let editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          convertFromHTML(`<p>A !!!test!!!</p>`).contentBlocks,
        ),
      );
      editorState = EditorState.moveFocusToEnd(editorState);
      editorState = DraftUtils.applyMarkdownStyle(
        editorState,
        {
          start: 2,
          end: 12,
          pattern: "!!!",
          type: "CUSTOM",
        },
        "$",
      );

      expect(
        convertToRaw(editorState.getCurrentContent()).blocks[0],
      ).toMatchObject({
        text: "A test$",
        inlineStyleRanges: [{ length: 4, offset: 2, style: "CUSTOM" }],
      });
    });
  });

  describe("#removeBlock", () => {
    it("works", () => {
      const editorState = DraftUtils.removeBlock(
        EditorState.createWithContent(
          ContentState.createFromBlockArray([
            new ContentBlock({
              key: "test",
              type: "unstyled",
              text: "test *",
              characterList: List(
                Repeat(CharacterMetadata.create(), "test *".length),
              ),
            }),
            new ContentBlock({
              key: "1234",
              type: "unstyled",
              text: "test *",
              characterList: List(
                Repeat(CharacterMetadata.create(), "test *".length),
              ),
            }),
            new ContentBlock({
              key: "5678",
              type: "unstyled",
              text: "test *",
              characterList: List(
                Repeat(CharacterMetadata.create(), "test *".length),
              ),
            }),
          ]),
        ),
        "1234",
      );
      expect(
        Object.keys(
          editorState
            .getCurrentContent()
            .getBlockMap()
            .map((b) => b!.getKey())
            .toJS(),
        ),
      ).toEqual(["5678", "test"]);
    });
  });

  describe("#removeBlockEntity", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {
          1: {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {
              src: "example.png",
            },
          },
        },
        blocks: [
          {
            key: "a",
            text: " ",
            type: "atomic",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [{ offset: 0, length: 1, key: 1 }],
          },
        ],
      });
      let editorState = EditorState.createWithContent(contentState);
      editorState = DraftUtils.removeBlockEntity(editorState, "1", "a");
      expect(
        editorState
          .getCurrentContent()
          .getBlockMap()
          .map((b) => b!.toJS())
          .toJS(),
      ).toEqual({
        a: {
          characterList: [],
          data: {},
          depth: 0,
          key: "a",
          text: "",
          type: "unstyled",
        },
      });
    });
  });

  describe("#handleDeleteAtomic", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {
          1: {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {},
          },
        },
        blocks: [
          {
            key: "a",
            text: " ",
            type: "atomic",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [{ offset: 0, length: 1, key: 1 }],
          },
        ],
      });
      let editorState = EditorState.createWithContent(contentState);
      editorState = DraftUtils.handleDeleteAtomic(editorState) as EditorState;
      expect(
        editorState
          .getCurrentContent()
          .getBlockMap()
          .map((b) => b!.toJS())
          .toJS(),
      ).toEqual({
        a: {
          characterList: [],
          data: {},
          depth: 0,
          key: "a",
          text: "",
          type: "unstyled",
        },
      });
    });

    it("not collapsed", () => {
      const contentState = convertFromRaw({
        entityMap: {
          1: {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {},
          },
        },
        blocks: [
          {
            key: "a",
            text: " ",
            type: "atomic",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [{ offset: 0, length: 1, key: 1 }],
          },
        ],
      });
      let editorState = EditorState.createWithContent(contentState);
      const selection = editorState.getSelection().merge({
        anchorKey: "a",
        focusKey: "a",
        anchorOffset: 0,
        focusOffset: 1,
      });
      editorState = EditorState.forceSelection(editorState, selection);
      expect(DraftUtils.handleDeleteAtomic(editorState)).toEqual(false);
    });

    it("not block start", () => {
      const contentState = convertFromRaw({
        entityMap: {
          1: {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {},
          },
        },
        blocks: [
          {
            key: "a",
            text: " ",
            type: "atomic",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [{ offset: 0, length: 1, key: 1 }],
          },
        ],
      });
      let editorState = EditorState.createWithContent(contentState);
      const selection = editorState.getSelection().merge({
        anchorKey: "a",
        focusKey: "a",
        anchorOffset: 1,
        focusOffset: 1,
      });
      editorState = EditorState.forceSelection(editorState, selection);
      expect(DraftUtils.handleDeleteAtomic(editorState)).toEqual(false);
    });

    it("not atomic", () => {
      const contentState = convertFromRaw({
        entityMap: {
          1: {
            type: "IMAGE",
            mutability: "IMMUTABLE",
            data: {},
          },
        },
        blocks: [
          {
            key: "a",
            text: " ",
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [{ offset: 0, length: 1, key: 1 }],
          },
        ],
      });
      let editorState = EditorState.createWithContent(contentState);
      const selection = editorState.getSelection().merge({
        anchorKey: "a",
        focusKey: "a",
        anchorOffset: 0,
        focusOffset: 0,
      });
      editorState = EditorState.forceSelection(editorState, selection);
      expect(DraftUtils.handleDeleteAtomic(editorState)).toEqual(false);
    });
  });

  describe("#insertNewUnstyledBlock", () => {
    it("works", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      let editorState = EditorState.createWithContent(contentState);
      editorState = DraftUtils.insertNewUnstyledBlock(editorState);

      expect(editorState.getCurrentContent().getLastBlock().getType()).toBe(
        "unstyled",
      );
      expect(editorState.getUndoStack().size).toBe(1);
    });
  });

  describe("#addLineBreak", () => {
    it("works, collapsed", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);

      expect(
        DraftUtils.addLineBreak(editorState)
          .getCurrentContent()
          .getFirstBlock()
          .getText(),
      ).toBe("\ntest");
    });

    it("works, non-collapsed", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "a",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      let editorState = EditorState.createWithContent(contentState);
      const selection = editorState.getSelection().merge({
        anchorKey: "a",
        focusKey: "a",
        anchorOffset: 0,
        focusOffset: 2,
      });
      editorState = EditorState.forceSelection(editorState, selection);

      expect(
        DraftUtils.addLineBreak(editorState)
          .getCurrentContent()
          .getFirstBlock()
          .getText(),
      ).toBe("\nst");
    });
  });

  describe("#handleHardNewline", () => {
    let tryToRemoveBlockStyle: jest.SpyInstance;
    beforeEach(() => {
      jest.spyOn(DraftUtils, "insertNewUnstyledBlock");
      tryToRemoveBlockStyle = jest.spyOn(RichUtils, "tryToRemoveBlockStyle");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("non-collapsed selection", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-two",
          },
          {
            key: "a0ei9",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      let editorState = EditorState.createWithContent(contentState);
      const selection = editorState.getSelection().merge({
        anchorKey: "b0ei9",
        focusKey: "a0ei9",
        anchorOffset: 0,
        focusOffset: 4,
      });
      editorState = EditorState.forceSelection(editorState, selection);
      expect(DraftUtils.handleHardNewline(editorState)).toBe(false);
    });

    it("unstyled block", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "unstyled",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      expect(DraftUtils.handleHardNewline(editorState)).toBe(false);
    });

    it("non-unstyled block", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-one",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      expect(DraftUtils.handleHardNewline(editorState)).toBe(false);
    });

    it("non-unstyled block end of block", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      let editorState = EditorState.createWithContent(contentState);
      const selection = editorState.getSelection().merge({
        anchorOffset: 4,
        focusOffset: 4,
      });
      editorState = EditorState.forceSelection(editorState, selection);
      DraftUtils.handleHardNewline(editorState);

      expect(DraftUtils.insertNewUnstyledBlock).toHaveBeenCalled();
    });

    it("non-empty list block", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "unordered-list-item",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      expect(DraftUtils.handleHardNewline(editorState)).toBe(false);
    });

    it("non-empty custom list block", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "action-list-item",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      expect(DraftUtils.handleHardNewline(editorState)).toBe(false);
    });

    it("empty list block non-nested", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "",
            type: "unordered-list-item",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      DraftUtils.handleHardNewline(editorState);
      expect(RichUtils.tryToRemoveBlockStyle).toHaveBeenCalled();
    });

    it("empty list block non-nested, tryToRemoveBlockStyle fail", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "",
            type: "unordered-list-item",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      tryToRemoveBlockStyle.mockImplementationOnce(() => null);
      expect(DraftUtils.handleHardNewline(editorState)).toBe(false);
    });

    it("empty list block nested", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "",
            type: "unordered-list-item",
            depth: 1,
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      expect(
        (DraftUtils.handleHardNewline(editorState) as EditorState)
          .getCurrentContent()
          .getFirstBlock()
          .getDepth(),
      ).toBe(0);
    });
  });

  describe("#handleNewLine", () => {
    beforeEach(() => {
      jest.spyOn(DraftUtils, "handleHardNewline");
      jest.spyOn(DraftUtils, "addLineBreak");
      jest.spyOn(RichUtils, "insertSoftNewline");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("hard newline", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      DraftUtils.handleNewLine(editorState, {
        which: 13,
        getModifierState: () => false,
      } as unknown as React.KeyboardEvent<HTMLDivElement>);

      expect(DraftUtils.handleHardNewline).toHaveBeenCalled();
      expect(RichUtils.insertSoftNewline).not.toHaveBeenCalled();
    });

    it("soft newline", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-two",
          },
          {
            key: "a0ei9",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      let editorState = EditorState.createWithContent(contentState);
      const selection = editorState.getSelection().merge({
        anchorKey: "b0ei9",
        focusKey: "a0ei9",
        anchorOffset: 0,
        focusOffset: 4,
      });
      editorState = EditorState.forceSelection(editorState, selection);
      DraftUtils.handleNewLine(editorState, {
        which: 13,
        getModifierState: () => true,
      } as unknown as React.KeyboardEvent<HTMLDivElement>);

      expect(DraftUtils.handleHardNewline).not.toHaveBeenCalled();
      expect(RichUtils.insertSoftNewline).not.toHaveBeenCalled();
      expect(DraftUtils.addLineBreak).toHaveBeenCalled();
    });

    it("soft newline collapsed", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "header-two",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      DraftUtils.handleNewLine(editorState, {
        which: 13,
        getModifierState: () => true,
      } as unknown as React.KeyboardEvent<HTMLDivElement>);

      expect(DraftUtils.handleHardNewline).not.toHaveBeenCalled();
      expect(RichUtils.insertSoftNewline).toHaveBeenCalled();
    });

    it("hard newline in code-block", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "test",
            type: "code-block",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      expect(
        DraftUtils.handleNewLine(editorState, {
          which: 13,
          getModifierState: () => false,
        } as unknown as React.KeyboardEvent<HTMLDivElement>),
      ).toBe(false);
    });

    it("hard newline in empty code-block", () => {
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            key: "b0ei9",
            text: "",
            type: "code-block",
          },
        ],
      } as RawDraftContentState);
      const editorState = EditorState.createWithContent(contentState);
      expect(
        (
          DraftUtils.handleNewLine(editorState, {
            which: 13,
            getModifierState: () => false,
          } as unknown as React.KeyboardEvent<HTMLDivElement>) as EditorState
        )
          .getCurrentContent()
          .getFirstBlock()
          .getType(),
      ).toBe("unstyled");
    });
  });
});
