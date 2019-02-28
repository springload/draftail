import { List, Repeat } from "immutable";
import { EditorState, CharacterMetadata, ContentBlock } from "draft-js";

import behavior from "./behavior";
import {
  BLOCK_TYPE,
  INLINE_STYLE,
  KEY_CODES,
  CUSTOM_STYLE_MAP,
  ENTITY_TYPE,
} from "./constants";

const DraftFilters = require("draftjs-filters");

describe("behavior", () => {
  describe("#getBlockRenderMap", () => {
    it("has custom block with element", () => {
      expect(
        behavior
          .getBlockRenderMap([{ type: "TEST", element: "div" }])
          .get("TEST"),
      ).toEqual({ element: "div" });
    });

    it("no custom block without element", () => {
      expect(
        behavior.getBlockRenderMap([{ type: "TEST" }]).get("TEST"),
      ).not.toBeDefined();
    });

    describe("code block element", () => {
      it('default is "code"', () => {
        expect(
          behavior
            .getBlockRenderMap([{ type: BLOCK_TYPE.CODE }])
            .get(BLOCK_TYPE.CODE).element,
        ).toEqual("code");
      });

      it("can be overriden", () => {
        expect(
          behavior
            .getBlockRenderMap([{ type: BLOCK_TYPE.CODE, element: "span" }])
            .get(BLOCK_TYPE.CODE).element,
        ).toEqual("span");
      });
    });
  });

  describe("#blockStyleFn", () => {
    it("works", () => {
      expect(
        behavior.blockStyleFn(
          new ContentBlock({
            key: "test1234",
            type: "TEST",
            text: "This is test text",
            characterList: List(
              Repeat(
                CharacterMetadata.create({
                  entity: "test1234",
                }),
                "This is test text".length,
              ),
            ),
          }),
        ),
      ).toEqual("Draftail-block--TEST ");
    });

    it("depth", () => {
      expect(
        behavior.blockStyleFn(
          new ContentBlock({
            key: "1234",
            type: "TEST",
            text: "test",
            depth: 6,
            characterList: List(
              Repeat(
                CharacterMetadata.create({ entity: "1234" }),
                "test".length,
              ),
            ),
          }),
        ),
      ).toEqual("Draftail-block--TEST public-DraftStyleDefault-depth6");
    });
  });

  describe("#getKeyBindingFn", () => {
    it("has strict keyboard shortcut matching", () => {
      expect(
        behavior.getKeyBindingFn([], [{ type: "BOLD" }], [])({
          keyCode: KEY_CODES.B,
          metaKey: false,
          altKey: false,
          shiftKey: true,
          ctrlKey: true,
        }),
      ).toBe(undefined);
    });

    describe("styles", () => {
      it("disables default style key bindings", () => {
        expect(
          behavior.getKeyBindingFn([], [], [])({
            keyCode: KEY_CODES.B,
            metaKey: false,
            altKey: false,
            shiftKey: false,
            ctrlKey: true,
          }),
        ).toBe(undefined);
      });

      it("enables style key bindings when required", () => {
        expect(
          behavior.getKeyBindingFn([], [{ type: "BOLD" }], [])({
            keyCode: KEY_CODES.B,
            metaKey: false,
            altKey: false,
            shiftKey: false,
            ctrlKey: true,
          }),
        ).toBe("BOLD");
      });
    });

    describe("blocks", () => {
      it("has no default heading block key binding", () => {
        expect(
          behavior.getKeyBindingFn([], [], [])({
            keyCode: KEY_CODES[1],
            metaKey: false,
            altKey: true,
            shiftKey: false,
            ctrlKey: true,
          }),
        ).toBe(undefined);
      });

      it("enables heading block key binding when required", () => {
        expect(
          behavior.getKeyBindingFn([{ type: "header-one" }], [], [])({
            keyCode: KEY_CODES[1],
            metaKey: false,
            altKey: true,
            shiftKey: false,
            ctrlKey: true,
          }),
        ).toBe("header-one");
      });

      it("has default unstyled block key binding", () => {
        expect(
          behavior.getKeyBindingFn([], [], [])({
            keyCode: KEY_CODES[0],
            metaKey: false,
            altKey: true,
            shiftKey: false,
            ctrlKey: true,
          }),
        ).toBe("unstyled");
      });
    });

    describe("entities", () => {
      it("has no default link entity key binding", () => {
        expect(
          behavior.getKeyBindingFn([], [], [])({
            keyCode: KEY_CODES.K,
            metaKey: false,
            altKey: false,
            shiftKey: false,
            ctrlKey: true,
          }),
        ).toBe(undefined);
      });

      it("enables link entity key binding when required", () => {
        expect(
          behavior.getKeyBindingFn([], [], [{ type: "LINK" }])({
            keyCode: KEY_CODES.K,
            metaKey: false,
            altKey: false,
            shiftKey: false,
            ctrlKey: true,
          }),
        ).toBe("LINK");
      });
    });

    it("all shortcuts", () => {
      const blockTypes = Object.values(BLOCK_TYPE).map((type) => ({
        type,
      }));
      const inlineStyles = Object.values(INLINE_STYLE).map((type) => ({
        type,
      }));
      const entityTypes = Object.values(ENTITY_TYPE).map((type) => ({
        type,
      }));
      const keyBindingFn = behavior.getKeyBindingFn(
        blockTypes,
        inlineStyles,
        entityTypes,
      );

      const shiftKey = [
        {
          keyCode: KEY_CODES.B,
        },
        {
          keyCode: KEY_CODES.I,
        },
        {
          keyCode: KEY_CODES.J,
        },
        {
          keyCode: KEY_CODES.U,
        },
        {
          keyCode: KEY_CODES.X,
        },
        {
          keyCode: KEY_CODES.X,
          ctrlKey: true,
          output: INLINE_STYLE.STRIKETHROUGH,
        },
        {
          keyCode: KEY_CODES[7],
        },
        {
          keyCode: KEY_CODES[7],
          ctrlKey: true,
          output: BLOCK_TYPE.ORDERED_LIST_ITEM,
        },
        {
          keyCode: KEY_CODES[8],
        },
        {
          keyCode: KEY_CODES[8],
          ctrlKey: true,
          output: BLOCK_TYPE.UNORDERED_LIST_ITEM,
        },
        {
          keyCode: 1337,
        },
      ];

      const noShiftKey = [
        {
          keyCode: KEY_CODES.K,
        },
        {
          keyCode: KEY_CODES.B,
        },
        {
          keyCode: KEY_CODES.I,
        },
        {
          keyCode: KEY_CODES.I,
          ctrlKey: true,
          output: INLINE_STYLE.ITALIC,
        },
        {
          keyCode: KEY_CODES.J,
        },
        {
          keyCode: KEY_CODES.J,
          ctrlKey: true,
          output: INLINE_STYLE.CODE,
        },
        {
          keyCode: KEY_CODES.U,
        },
        {
          keyCode: KEY_CODES.U,
          ctrlKey: true,
          output: INLINE_STYLE.UNDERLINE,
        },
        {
          keyCode: KEY_CODES["."],
        },
        {
          keyCode: KEY_CODES["."],
          ctrlKey: true,
          output: INLINE_STYLE.SUPERSCRIPT,
        },
        {
          keyCode: KEY_CODES[","],
        },
        {
          keyCode: KEY_CODES[","],
          ctrlKey: true,
          output: INLINE_STYLE.SUBSCRIPT,
        },
        {
          keyCode: KEY_CODES[0],
        },
        {
          keyCode: KEY_CODES[1],
          metaKey: true,
          altKey: true,
          output: BLOCK_TYPE.HEADER_ONE,
        },
        {
          keyCode: KEY_CODES[1],
          metaKey: true,
        },
        {
          keyCode: KEY_CODES[2],
          metaKey: true,
          altKey: true,
          output: BLOCK_TYPE.HEADER_TWO,
        },
        {
          keyCode: KEY_CODES[2],
          metaKey: true,
        },
        {
          keyCode: KEY_CODES[3],
          metaKey: true,
          altKey: true,
          output: BLOCK_TYPE.HEADER_THREE,
        },
        {
          keyCode: KEY_CODES[3],
          metaKey: true,
        },
        {
          keyCode: KEY_CODES[4],
          metaKey: true,
          altKey: true,
          output: BLOCK_TYPE.HEADER_FOUR,
        },
        {
          keyCode: KEY_CODES[4],
          metaKey: true,
        },
        {
          keyCode: KEY_CODES[5],
          metaKey: true,
          altKey: true,
          output: BLOCK_TYPE.HEADER_FIVE,
        },
        {
          keyCode: KEY_CODES[5],
          metaKey: true,
        },
        {
          keyCode: KEY_CODES[6],
          metaKey: true,
          altKey: true,
          output: BLOCK_TYPE.HEADER_SIX,
        },
        {
          keyCode: KEY_CODES[6],
          metaKey: true,
        },
        {
          keyCode: 1337,
        },
      ];

      const shortcuts = []
        .concat(shiftKey.map((s) => Object.assign(s, { shiftKey: true })))
        .concat(noShiftKey);

      shortcuts.forEach((s) => {
        const result = keyBindingFn(
          Object.assign(
            {
              metaKey: false,
              altKey: false,
              shiftKey: false,
              ctrlKey: false,
            },
            s,
          ),
        );

        if (typeof s.output !== "undefined") {
          expect(result).toBe(s.output);
        } else {
          expect(result).toBeFalsy();
        }
      });
    });
  });

  describe("#hasKeyboardShortcut", () => {
    it("defined shortcut", () => {
      expect(behavior.hasKeyboardShortcut(BLOCK_TYPE.HEADER_FIVE)).toBe(true);
    });

    it("undefined shortcut", () => {
      expect(behavior.hasKeyboardShortcut("AAA")).toBe(false);
    });
  });

  describe("#getKeyboardShortcut", () => {
    it("header five shortcut", () => {
      expect(behavior.getKeyboardShortcut(BLOCK_TYPE.HEADER_FIVE)).toBe(
        "#####",
      );
    });

    it("header five shortcut, macOS", () => {
      expect(behavior.getKeyboardShortcut(BLOCK_TYPE.HEADER_FIVE, true)).toBe(
        "#####",
      );
    });

    it("undefined shortcut", () => {
      expect(behavior.getKeyboardShortcut("AAA")).not.toBeDefined();
    });
  });

  describe("#handleBeforeInputBlockType", () => {
    it("does not convert without the right types", () => {
      expect(
        behavior.handleBeforeInputBlockType("* ", [
          { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
        ]),
      ).toBe(false);
    });

    it("converts regardless of block type", () => {
      expect(
        behavior.handleBeforeInputBlockType("* ", [
          { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
        ]),
      ).toBe("unordered-list-item");
    });

    it('converts "* "', () => {
      expect(
        behavior.handleBeforeInputBlockType("* ", [
          { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
        ]),
      ).toBe("unordered-list-item");
    });

    it('converts "- "', () => {
      expect(
        behavior.handleBeforeInputBlockType("- ", [
          { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
        ]),
      ).toBe("unordered-list-item");
    });

    it('converts "1. "', () => {
      expect(
        behavior.handleBeforeInputBlockType("1. ", [
          { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
        ]),
      ).toBe("ordered-list-item");
    });
  });

  describe("#handleBeforeInputHR", () => {
    it("does not convert in code block", () => {
      expect(
        behavior.handleBeforeInputHR(
          "---",
          new ContentBlock({
            key: "test1234",
            type: "code-block",
            text: "--",
            characterList: List(
              Repeat(CharacterMetadata.create(), "--".length),
            ),
          }),
        ),
      ).toBe(false);
    });

    it('converts "---"', () => {
      expect(
        behavior.handleBeforeInputHR(
          "---",
          new ContentBlock({
            key: "test1234",
            type: "unstyled",
            text: "--",
            characterList: List(
              Repeat(CharacterMetadata.create(), "--".length),
            ),
          }),
        ),
      ).toBe(true);
    });
  });

  describe("#handleBeforeInputInlineStyle", () => {
    it.each`
      label                                        | beforeInput                | styles                | expected
      ${"no marker"}                               | ${"test"}                  | ${["ITALIC"]}         | ${false}
      ${"open only"}                               | ${"a _test"}               | ${["ITALIC"]}         | ${false}
      ${"close only"}                              | ${"a test_"}               | ${["ITALIC"]}         | ${false}
      ${"open - close markers"}                    | ${"a _test_"}              | ${["ITALIC"]}         | ${{}}
      ${"open - close markers in the middle"}      | ${"a _test_ a"}            | ${["ITALIC"]}         | ${false}
      ${"open - close markers whole text"}         | ${"_a test_"}              | ${["ITALIC"]}         | ${{}}
      ${"open - close markers single char"}        | ${"_a_"}                   | ${["ITALIC"]}         | ${{}}
      ${"no marked text"}                          | ${"a _test"}               | ${["ITALIC"]}         | ${false}
      ${"open only, or no marked text"}            | ${"a _test"}               | ${["ITALIC", "BOLD"]} | ${false}
      ${"open - close markers, or no marked text"} | ${"a _test_"}              | ${["ITALIC", "BOLD"]} | ${{ pattern: "_" }}
      ${"different open & close"}                  | ${"a _test*"}              | ${["ITALIC", "BOLD"]} | ${false}
      ${"different open & close but similar"}      | ${"a __test_"}             | ${["ITALIC", "BOLD"]} | ${false}
      ${"different open & close, after input"}     | ${"a _test__"}             | ${["ITALIC", "BOLD"]} | ${false}
      ${"two marker sets"}                         | ${"a __test__ two _test_"} | ${["ITALIC", "BOLD"]} | ${{ pattern: "_" }}
      ${"no whitespace before open"}               | ${"a_test_"}               | ${["ITALIC"]}         | ${false}
      ${"whitespace after open"}                   | ${"a _ test_"}             | ${["ITALIC"]}         | ${false}
      ${"whitespace before close"}                 | ${"a _test _"}             | ${["ITALIC"]}         | ${false}
    `("$label", ({ beforeInput, styles, expected }) => {
      const inlineStyles = styles.map((type) => ({ type }));
      const result = behavior.handleBeforeInputInlineStyle(
        beforeInput,
        inlineStyles,
      );
      if (expected) {
        expect(result).toMatchObject(expected);
      } else {
        expect(result).toEqual(expected);
      }
    });

    it("open - close marker, handling", () => {
      expect(
        behavior.handleBeforeInputInlineStyle("a **test**", [{ type: "BOLD" }]),
      ).toEqual({
        pattern: "**",
        start: 2,
        end: 10,
        type: "BOLD",
      });
    });
  });

  describe("#getCustomStyleMap", () => {
    it("existing styles, default styling", () => {
      expect(
        behavior.getCustomStyleMap([
          { label: "Bold", type: INLINE_STYLE.BOLD },
          { label: "Mark", type: INLINE_STYLE.MARK },
        ]),
      ).toEqual({
        [INLINE_STYLE.BOLD]: CUSTOM_STYLE_MAP[INLINE_STYLE.BOLD],
        [INLINE_STYLE.MARK]: CUSTOM_STYLE_MAP[INLINE_STYLE.MARK],
      });
    });

    it("existing styles, custom styling", () => {
      expect(
        behavior.getCustomStyleMap([
          {
            label: "Bold",
            type: INLINE_STYLE.BOLD,
            style: {
              color: "yellow",
            },
          },
        ]),
      ).toEqual({
        [INLINE_STYLE.BOLD]: {
          color: "yellow",
        },
      });
    });

    it("custom styles, custom styling", () => {
      expect(
        behavior.getCustomStyleMap([
          { label: "Red", type: "RED", style: { color: "red" } },
        ]),
      ).toEqual({
        RED: {
          color: "red",
        },
      });
    });

    it("custom styles, undefined styling", () => {
      expect(
        behavior.getCustomStyleMap([{ label: "Red", type: "RED" }]),
      ).toEqual({
        RED: {},
      });
    });
  });

  describe("#filterPaste", () => {
    beforeEach(() => {
      jest.spyOn(DraftFilters, "filterEditorState");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("works", () => {
      behavior.filterPaste(
        {
          maxListNesting: 1,
          enableHorizontalRule: false,
          enableLineBreak: false,
          blockTypes: [{ type: "blockquote" }],
          inlineStyles: [{ type: "BOLD" }],
          entityTypes: [],
        },
        EditorState.createEmpty(),
      );
      expect(DraftFilters.filterEditorState).toHaveBeenCalledWith(
        expect.objectContaining({
          whitespacedCharacters: ["\t", "📷", "\n"],
        }),
        expect.anything(),
      );
    });

    it("enableHorizontalRule", () => {
      behavior.filterPaste(
        {
          maxListNesting: 1,
          enableHorizontalRule: true,
          enableLineBreak: false,
          blockTypes: [],
          inlineStyles: [],
          entityTypes: [],
        },
        EditorState.createEmpty(),
      );
      expect(DraftFilters.filterEditorState).toHaveBeenCalledWith(
        expect.objectContaining({
          entities: [
            {
              type: "HORIZONTAL_RULE",
            },
          ],
        }),
        expect.anything(),
      );
    });

    it("enableLineBreak", () => {
      behavior.filterPaste(
        {
          maxListNesting: 1,
          enableHorizontalRule: false,
          enableLineBreak: true,
          blockTypes: [],
          inlineStyles: [],
          entityTypes: [],
        },
        EditorState.createEmpty(),
      );
      expect(DraftFilters.filterEditorState).toHaveBeenCalledWith(
        expect.objectContaining({
          whitespacedCharacters: ["\t", "📷"],
        }),
        expect.anything(),
      );
    });
  });
});
