import { OrderedSet } from "immutable";
import React from "react";
import { shallow, mount } from "enzyme";
import {
  convertFromRaw,
  EditorState,
  SelectionState,
  ContentBlock,
  RichUtils,
} from "draft-js";
import Editor from "draft-js-plugins-editor";
import behavior from "../api/behavior";
import DraftUtils from "../api/DraftUtils";
import DividerBlock from "../blocks/DividerBlock";
import DraftailEditor from "./DraftailEditor";
import Toolbar from "./Toolbar/Toolbar";
import { ENTITY_TYPE, INLINE_STYLE } from "../api/constants";
jest.mock("draft-js/lib/generateRandomKey", () => () => "a");

const shallowNoLifecycle = (elt) =>
  shallow(elt, {
    disableLifecycleMethods: true,
  });

describe("DraftailEditor", () => {
  it("empty", () => {
    expect(shallowNoLifecycle(<DraftailEditor />)).toMatchSnapshot();
  });
  it("#rawContentState sets local state", () => {
    const wrapper = shallowNoLifecycle(
      <DraftailEditor
        rawContentState={{
          entityMap: {},
          blocks: [
            {
              text: "test",
            },
          ],
        }}
      />,
    );
    expect(wrapper.state("editorState")).toBeInstanceOf(EditorState);
  });
  it("#editorState is passed through", () => {
    const editorState = EditorState.createEmpty();
    const wrapper = shallowNoLifecycle(
      <DraftailEditor editorState={editorState} />,
    );
    expect(wrapper.find("PluginEditor").prop("editorState")).toBe(editorState);
  });
  it("editorRef", () => {
    expect(mount(<DraftailEditor />).instance().editorRef).toBeDefined();
  });
  describe("readOnly", () => {
    it("readOnly state", () => {
      expect(
        shallowNoLifecycle(<DraftailEditor />)
          .setState({
            readOnlyState: true,
          })
          .hasClass("Draftail-Editor--readonly"),
      ).toBeTruthy();
    });
    it("#readOnly prop", () => {
      expect(
        shallowNoLifecycle(<DraftailEditor readOnly />).hasClass(
          "Draftail-Editor--readonly",
        ),
      ).toBeTruthy();
    });
    it("#readOnly prop & readOnly state", () => {
      expect(
        shallowNoLifecycle(<DraftailEditor readOnly />)
          .setState({
            readOnlyState: true,
          })
          .hasClass("Draftail-Editor--readonly"),
      ).toBeTruthy();
    });
  });
  describe("#placeholder", () => {
    it("visible", () => {
      expect(
        shallowNoLifecycle(<DraftailEditor placeholder="Write here…" />)
          .find(Editor)
          .prop("placeholder"),
      ).toEqual("Write here…");
    });
    it("hidden", () => {
      expect(
        shallowNoLifecycle(
          <DraftailEditor
            placeholder="Write here…"
            rawContentState={{
              entityMap: {},
              blocks: [
                {
                  text: "test",
                },
              ],
            }}
          />,
        )
          .find("div")
          .prop("className"),
      ).toContain("Draftail-Editor--hide-placeholder");
    });
  });
  it("#spellCheck", () => {
    expect(
      shallowNoLifecycle(<DraftailEditor spellCheck />)
        .find(Editor)
        .prop("spellCheck"),
    ).toEqual(true);
  });
  it("#textAlignment", () => {
    expect(
      shallowNoLifecycle(<DraftailEditor textAlignment="left" />)
        .find(Editor)
        .prop("textAlignment"),
    ).toEqual("left");
  });
  it("#textDirectionality", () => {
    expect(
      shallowNoLifecycle(<DraftailEditor textDirectionality="RTL" />)
        .find(Editor)
        .prop("textDirectionality"),
    ).toEqual("RTL");
  });
  it("#autoCapitalize", () => {
    expect(
      shallowNoLifecycle(<DraftailEditor autoCapitalize="characters" />)
        .find(Editor)
        .prop("autoCapitalize"),
    ).toEqual("characters");
  });
  it("#autoComplete", () => {
    expect(
      shallowNoLifecycle(<DraftailEditor autoComplete="given-name" />)
        .find(Editor)
        .prop("autoComplete"),
    ).toEqual("given-name");
  });
  it("#autoCorrect", () => {
    expect(
      shallowNoLifecycle(<DraftailEditor autoCorrect="on" />)
        .find(Editor)
        .prop("autoCorrect"),
    ).toEqual("on");
  });
  it("#ariaDescribedBy", () => {
    expect(
      shallowNoLifecycle(<DraftailEditor ariaDescribedBy="test" />)
        .find(Editor)
        .prop("ariaDescribedBy"),
    ).toEqual("test");
  });
  describe("#topToolbar", () => {
    it("defaults to top static Toolbar", () => {
      expect(
        shallowNoLifecycle(<DraftailEditor />)
          .find(Toolbar)
          .exists(),
      ).toBe(true);
    });
    it("can be disabled", () => {
      expect(
        shallowNoLifecycle(<DraftailEditor topToolbar={null} />)
          .find(Toolbar)
          .exists(),
      ).toBe(false);
    });
    it("can be customised", () => {
      expect(
        shallowNoLifecycle(
          <DraftailEditor
            topToolbar={() => <div className="CustomTopToolbar">Test</div>}
          />,
        )
          .find("topToolbar")
          .dive()
          .find(".CustomTopToolbar")
          .exists(),
      ).toBe(true);
    });
    it("receives default toolbar props", () => {
      expect(
        Object.keys(
          shallowNoLifecycle(<DraftailEditor topToolbar={() => <div />} />)
            .find("topToolbar")
            .props(),
        ),
      ).toEqual([
        "currentStyles",
        "currentBlock",
        "enableHorizontalRule",
        "enableLineBreak",
        "showUndoControl",
        "showRedoControl",
        "blockTypes",
        "inlineStyles",
        "entityTypes",
        "controls",
        "readOnly",
        "toggleBlockType",
        "toggleInlineStyle",
        "addHR",
        "addBR",
        "onUndoRedo",
        "onRequestSource",
        "getEditorState",
        "onChange",
      ]);
    });
  });
  describe("#bottomToolbar", () => {
    it("defaults to no bottom toolbar", () => {
      expect(
        shallowNoLifecycle(<DraftailEditor />)
          .find("bottomToolbar")
          .exists(),
      ).toBe(false);
    });
    it("can be customised", () => {
      expect(
        shallowNoLifecycle(
          <DraftailEditor
            bottomToolbar={() => (
              <div className="CustomBottomToolbar">Test</div>
            )}
          />,
        )
          .find("bottomToolbar")
          .dive()
          .find(".CustomBottomToolbar")
          .exists(),
      ).toBe(true);
    });
    it("receives default toolbar props", () => {
      expect(
        Object.keys(
          shallowNoLifecycle(<DraftailEditor bottomToolbar={() => <div />} />)
            .find("bottomToolbar")
            .props(),
        ),
      ).toEqual([
        "currentStyles",
        "currentBlock",
        "enableHorizontalRule",
        "enableLineBreak",
        "showUndoControl",
        "showRedoControl",
        "blockTypes",
        "inlineStyles",
        "entityTypes",
        "controls",
        "readOnly",
        "toggleBlockType",
        "toggleInlineStyle",
        "addHR",
        "addBR",
        "onUndoRedo",
        "onRequestSource",
        "getEditorState",
        "onChange",
      ]);
    });
  });
  it("#maxListNesting", () => {
    expect(
      shallowNoLifecycle(<DraftailEditor maxListNesting={6} />),
    ).toMatchSnapshot();
  });
  describe("#onSave", () => {
    it("works", () => {
      jest.useFakeTimers();
      const onSave = jest.fn();
      const wrapper = shallowNoLifecycle(
        <DraftailEditor onSave={onSave} stateSaveInterval={100} />,
      );
      wrapper.instance().onChange(EditorState.createEmpty());
      jest.advanceTimersByTime(150);
      expect(onSave).toHaveBeenCalled();
    });
    it("does not get called when onChange is used", () => {
      jest.useFakeTimers();
      const onSave = jest.fn();
      const wrapper = shallowNoLifecycle(
        <DraftailEditor onSave={onSave} onChange={() => {}} />,
      );
      wrapper.instance().onChange(EditorState.createEmpty());
      jest.advanceTimersByTime(1000);
      expect(onSave).not.toHaveBeenCalled();
    });
  });
  it("#stateSaveInterval", () => {
    jest.useFakeTimers();
    const onSave = jest.fn();
    const wrapper = shallowNoLifecycle(
      <DraftailEditor onSave={onSave} stateSaveInterval={100} />,
    );
    const contentState = convertFromRaw({
      entityMap: {},
      blocks: [
        {
          text: "test",
        },
      ],
    });
    const editorState = EditorState.push(
      EditorState.createEmpty(),
      contentState,
      "insert-fragment",
    );
    wrapper.instance().onChange(editorState);
    jest.advanceTimersByTime(50);
    expect(onSave).not.toHaveBeenCalled();
    jest.advanceTimersByTime(50);
    expect(onSave).toHaveBeenCalledTimes(1);
  });
  it("readOnly", () => {
    const onSave = jest.fn();
    const wrapper = shallowNoLifecycle(<DraftailEditor onSave={onSave} />);
    wrapper.instance().toggleEditor(true);
    expect(wrapper.state("readOnlyState")).toBe(true);
    wrapper.instance().toggleEditor(false);
    expect(wrapper.state("readOnlyState")).toBe(false);
  });
  it("componentWillUnmount", () => {
    const wrapper = mount(<DraftailEditor />);
    const { copySource } = wrapper.instance();
    jest.spyOn(copySource, "unregister");
    jest.spyOn(window, "clearTimeout");
    expect(copySource).not.toBeNull();
    wrapper.unmount();
    expect(copySource.unregister).toHaveBeenCalled();
    expect(window.clearTimeout).toHaveBeenCalled();
  });
  describe("onChange", () => {
    beforeEach(() => {
      jest
        .spyOn(behavior, "filterPaste")
        .mockImplementation((opt, editorState) => editorState);
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("no filter when typing", () => {
      const wrapper = shallowNoLifecycle(
        <DraftailEditor stripPastedStyles={false} />,
      );
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            text: "test",
          },
        ],
      });
      const editorState = EditorState.push(
        EditorState.createEmpty(),
        contentState,
        "insert-characters",
      );
      wrapper.instance().onChange(editorState);
      expect(behavior.filterPaste).not.toHaveBeenCalled();
    });
    it("filter on paste", () => {
      const wrapper = shallowNoLifecycle(
        <DraftailEditor stripPastedStyles={false} />,
      );
      const contentState = convertFromRaw({
        entityMap: {},
        blocks: [
          {
            text: "test",
          },
        ],
      });
      const editorState = EditorState.push(
        EditorState.createEmpty(),
        contentState,
        "insert-fragment",
      );
      wrapper.instance().onChange(editorState);
      expect(behavior.filterPaste).toHaveBeenCalled();
    });
    it("calls onSave", () => {
      jest.useFakeTimers();
      const onSave = jest.fn();
      const wrapper = shallowNoLifecycle(<DraftailEditor onSave={onSave} />);
      wrapper.instance().onChange(EditorState.createEmpty());
      jest.advanceTimersByTime(1000);
      expect(onSave).toHaveBeenCalled();
    });
    it("calls onChange if used instead", () => {
      jest.useFakeTimers();
      const onSave = jest.fn();
      const onChange = jest.fn();
      const wrapper = shallowNoLifecycle(
        <DraftailEditor onSave={onSave} onChange={onChange} />,
      );
      wrapper.instance().onChange(EditorState.createEmpty());
      jest.advanceTimersByTime(1000);
      expect(onSave).not.toHaveBeenCalled();
      expect(onChange).toHaveBeenCalled();
    });
  });
  describe("getEditorState", () => {
    it("works with uncontrolled editor", () => {
      const wrapper = shallowNoLifecycle(<DraftailEditor />);
      expect(wrapper.instance().getEditorState()).toBeInstanceOf(EditorState);
    });
    it("works with controlled editor", () => {
      const editorState = EditorState.createEmpty();
      const wrapper = shallowNoLifecycle(
        <DraftailEditor editorState={editorState} />,
      );
      expect(wrapper.instance().getEditorState()).toBe(editorState);
    });
  });
  describe("handleReturn", () => {
    it("default", () => {
      jest
        .spyOn(DraftUtils, "handleNewLine")
        .mockImplementation(() => EditorState.createEmpty());
      const wrapper = shallowNoLifecycle(<DraftailEditor />);
      expect(
        wrapper.instance().handleReturn({
          keyCode: 13,
        }),
      ).toBe("handled");
      DraftUtils.handleNewLine.mockRestore();
    });
    it("enabled br", () => {
      const wrapper = shallowNoLifecycle(<DraftailEditor enableLineBreak />);
      expect(
        wrapper.instance().handleReturn({
          keyCode: 13,
        }),
      ).toBe("not-handled");
    });
    it("alt + enter on text", () => {
      const wrapper = shallowNoLifecycle(<DraftailEditor />);
      expect(
        wrapper.instance().handleReturn({
          altKey: true,
        }),
      ).toBe("handled");
    });
    it("alt + enter on entity without url", () => {
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          rawContentState={{
            entityMap: {
              1: {
                type: "LINK",
                data: {
                  url: "test",
                },
              },
              2: {
                type: "LINK",
              },
            },
            blocks: [
              {
                text: "test",
                entityRanges: [
                  {
                    offset: 0,
                    length: 4,
                    key: 2,
                  },
                ],
              },
            ],
          }}
        />,
      );
      expect(
        wrapper.instance().handleReturn({
          altKey: true,
        }),
      ).toBe("handled");
    });
    it("alt + enter on entity", () => {
      jest.spyOn(window, "open");
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          rawContentState={{
            entityMap: {
              1: {
                type: "LINK",
                data: {
                  url: "test",
                },
              },
            },
            blocks: [
              {
                text: "test",
                entityRanges: [
                  {
                    offset: 0,
                    length: 4,
                    key: 1,
                  },
                ],
              },
            ],
          }}
        />,
      );
      expect(
        wrapper.instance().handleReturn({
          altKey: true,
        }),
      ).toBe("handled");
      expect(window.open).toHaveBeenCalled();
      window.open.mockRestore();
    });
    it("style shortcut", () => {
      jest.spyOn(DraftUtils, "applyMarkdownStyle");
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          rawContentState={{
            entityMap: {},
            blocks: [
              {
                text: "A *test*",
              },
            ],
          }}
          inlineStyles={[
            {
              type: INLINE_STYLE.ITALIC,
            },
          ]}
        />,
      );
      expect(wrapper.instance().handleReturn({})).toBe("handled");
      expect(DraftUtils.applyMarkdownStyle).toHaveBeenCalled();
      DraftUtils.applyMarkdownStyle.mockRestore();
    });
    it("style shortcut but selection is not collapsed", () => {
      jest.spyOn(DraftUtils, "applyMarkdownStyle");
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          rawContentState={{
            entityMap: {},
            blocks: [
              {
                key: "aaaa2",
                text: "A *test*",
              },
            ],
          }}
          inlineStyles={[
            {
              type: INLINE_STYLE.ITALIC,
            },
          ]}
        />,
      );
      // Monkey-patching the one method. A bit dirty.
      const selection = new SelectionState().set("anchorKey", "aaaa2");

      selection.isCollapsed = () => false;

      wrapper.setState({
        editorState: Object.assign(wrapper.state("editorState"), {
          getSelection: () => selection,
          getCurrentInlineStyle: () => new OrderedSet(),
        }),
      });
      expect(wrapper.instance().handleReturn({})).toBe("not-handled");
      expect(DraftUtils.applyMarkdownStyle).not.toHaveBeenCalled();
      DraftUtils.applyMarkdownStyle.mockRestore();
    });
  });
  it("onFocus, onBlur", () => {
    const wrapper = shallowNoLifecycle(<DraftailEditor />);
    expect(wrapper.state("hasFocus")).toBe(false);
    wrapper.instance().onFocus();
    expect(wrapper.state("hasFocus")).toBe(true);
    wrapper.instance().onBlur();
    expect(wrapper.state("hasFocus")).toBe(false);
  });
  it("onBlur does not call onSave (#173)", () => {
    const onSave = jest.fn();
    const wrapper = shallowNoLifecycle(<DraftailEditor onSave={onSave} />);
    const contentState = convertFromRaw({
      entityMap: {},
      blocks: [
        {
          text: "test",
        },
      ],
    });
    const editorState = EditorState.push(
      EditorState.createEmpty(),
      contentState,
      "insert-fragment",
    );
    wrapper.instance().onChange(editorState);
    wrapper.instance().onBlur();
    expect(onSave).not.toHaveBeenCalled();
  });
  it("#onFocus", () => {
    const onFocus = jest.fn();
    const wrapper = shallowNoLifecycle(<DraftailEditor onFocus={onFocus} />);
    wrapper.instance().onFocus();
    expect(onFocus).toHaveBeenCalled();
  });
  it("#onBlur", () => {
    const onBlur = jest.fn();
    const wrapper = shallowNoLifecycle(<DraftailEditor onBlur={onBlur} />);
    wrapper.instance().onBlur();
    expect(onBlur).toHaveBeenCalled();
  });
  it("onTab", () => {
    jest.spyOn(RichUtils, "onTab");
    expect(
      shallowNoLifecycle(<DraftailEditor />)
        .instance()
        .onTab(),
    ).toBe(true);
    expect(RichUtils.onTab).toHaveBeenCalled();
    RichUtils.onTab.mockRestore();
  });
  describe("handleKeyCommand", () => {
    it("draftjs internal, handled", () => {
      RichUtils.handleKeyCommand = jest.fn((editorState) => editorState);
      expect(
        shallowNoLifecycle(<DraftailEditor />)
          .instance()
          .handleKeyCommand("backspace"),
      ).toBe("handled");
      RichUtils.handleKeyCommand.mockRestore();
    });
    it("draftjs internal, not handled", () => {
      RichUtils.handleKeyCommand = jest.fn(() => false);
      expect(
        shallowNoLifecycle(<DraftailEditor />)
          .instance()
          .handleKeyCommand("backspace"),
      ).toBe("not-handled");
      RichUtils.handleKeyCommand.mockRestore();
    });
    it("entity type - active", () => {
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          entityTypes={[
            {
              type: "LINK",
              source: () => null,
            },
          ]}
        />,
      ).instance();
      jest.spyOn(wrapper, "onRequestSource");
      expect(wrapper.handleKeyCommand("LINK")).toBe("handled");
      expect(wrapper.onRequestSource).toHaveBeenCalled();
    });
    it("entity type - inactive", () => {
      const wrapper = shallowNoLifecycle(<DraftailEditor />).instance();
      jest.spyOn(wrapper, "onRequestSource");
      expect(wrapper.handleKeyCommand("LINK")).toBe("handled");
      expect(wrapper.onRequestSource).not.toHaveBeenCalled();
    });
    it("block type - active", () => {
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          blockTypes={[
            {
              type: "header-one",
            },
          ]}
        />,
      ).instance();
      jest.spyOn(wrapper, "toggleBlockType");
      expect(wrapper.handleKeyCommand("header-one")).toBe("handled");
      expect(wrapper.toggleBlockType).toHaveBeenCalled();
    });
    it("block type - inactive", () => {
      const wrapper = shallowNoLifecycle(<DraftailEditor />).instance();
      jest.spyOn(wrapper, "toggleBlockType");
      expect(wrapper.handleKeyCommand("header-one")).toBe("handled");
      expect(wrapper.toggleBlockType).not.toHaveBeenCalled();
    });
    it("inline style - active", () => {
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          inlineStyles={[
            {
              type: "BOLD",
            },
          ]}
        />,
      ).instance();
      jest.spyOn(wrapper, "toggleInlineStyle");
      expect(wrapper.handleKeyCommand("BOLD")).toBe("handled");
      expect(wrapper.toggleInlineStyle).toHaveBeenCalled();
    });
    it("inline style - inactive", () => {
      const wrapper = shallowNoLifecycle(<DraftailEditor />).instance();
      jest.spyOn(wrapper, "toggleInlineStyle");
      expect(wrapper.handleKeyCommand("BOLD")).toBe("handled");
      expect(wrapper.toggleInlineStyle).not.toHaveBeenCalled();
    });
    it("draft-js defaults", () => {
      const wrapper = shallowNoLifecycle(<DraftailEditor />).instance();
      jest.spyOn(wrapper, "toggleInlineStyle");
      expect(wrapper.handleKeyCommand("bold")).toBe("handled");
      expect(wrapper.handleKeyCommand("italic")).toBe("handled");
      expect(wrapper.handleKeyCommand("underline")).toBe("handled");
      expect(wrapper.handleKeyCommand("code")).toBe("handled");
      expect(wrapper.toggleInlineStyle).not.toHaveBeenCalled();
    });
    describe("delete", () => {
      it("handled", () => {
        jest
          .spyOn(DraftUtils, "handleDeleteAtomic")
          .mockImplementation((e) => e);
        expect(
          shallowNoLifecycle(<DraftailEditor />)
            .instance()
            .handleKeyCommand("delete"),
        ).toBe("handled");
        expect(DraftUtils.handleDeleteAtomic).toHaveBeenCalled();
        DraftUtils.handleDeleteAtomic.mockRestore();
      });
      it("not handled", () => {
        jest.spyOn(DraftUtils, "handleDeleteAtomic");
        expect(
          shallowNoLifecycle(<DraftailEditor />)
            .instance()
            .handleKeyCommand("delete"),
        ).toBe("not-handled");
        expect(DraftUtils.handleDeleteAtomic).toHaveBeenCalled();
        DraftUtils.handleDeleteAtomic.mockRestore();
      });
    });
  });
  describe("handleBeforeInput", () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallowNoLifecycle(<DraftailEditor enableHorizontalRule />);
      jest.spyOn(DraftUtils, "resetBlockWithType");
      jest
        .spyOn(DraftUtils, "getSelectedBlock")
        .mockImplementation(() => new ContentBlock());
      jest.spyOn(DraftUtils, "addHorizontalRuleRemovingSelection");
      jest.spyOn(DraftUtils, "applyMarkdownStyle");
      jest.spyOn(behavior, "handleBeforeInputBlockType");
      jest.spyOn(behavior, "handleBeforeInputHR");
      jest.spyOn(behavior, "handleBeforeInputInlineStyle");
      jest.spyOn(wrapper.instance(), "onChange");
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    it("non-collapsed selection", () => {
      // Monkey-patching the one method. A bit dirty.
      const selection = new SelectionState();

      selection.isCollapsed = () => false;

      wrapper.setState({
        editorState: Object.assign(wrapper.state("editorState"), {
          getSelection: () => selection,
          getCurrentInlineStyle: () => new OrderedSet(),
        }),
      });
      expect(wrapper.instance().handleBeforeInput("a")).toBe("not-handled");
      expect(wrapper.instance().onChange).not.toHaveBeenCalled();
    });
    it("no matching processing", () => {
      DraftUtils.hasNoSelectionStartEntity = jest.fn(() => false);
      expect(wrapper.instance().handleBeforeInput("a")).toBe("not-handled");
      expect(wrapper.instance().onChange).not.toHaveBeenCalled();
    });
    it("enter text", () => {
      expect(wrapper.instance().handleBeforeInput("a")).toBe("not-handled");
    });
    it("change block type", () => {
      behavior.handleBeforeInputBlockType = jest.fn(() => "header-one");
      expect(wrapper.instance().handleBeforeInput(" ")).toBe("handled");
      expect(wrapper.instance().onChange).toHaveBeenCalled();
      expect(DraftUtils.resetBlockWithType).toHaveBeenCalled();
    });
    it("enter hr", () => {
      wrapper.instance().render = () => {};

      behavior.handleBeforeInputHR = jest.fn(() => true);
      DraftUtils.shouldHidePlaceholder = jest.fn(() => true);
      expect(wrapper.instance().handleBeforeInput("-")).toBe("handled");
      expect(wrapper.instance().onChange).toHaveBeenCalled();
      expect(DraftUtils.addHorizontalRuleRemovingSelection).toHaveBeenCalled();
      DraftUtils.shouldHidePlaceholder.mockRestore();
    });
    it("change style", () => {
      wrapper.instance().render = () => {};

      behavior.handleBeforeInputInlineStyle = jest.fn(() => ({
        pattern: "**",
        type: "BOLD",
        start: 0,
        end: 0,
      }));
      expect(wrapper.instance().handleBeforeInput("!")).toBe("handled");
      expect(wrapper.instance().onChange).toHaveBeenCalled();
      expect(DraftUtils.applyMarkdownStyle).toHaveBeenCalled();
    });
  });
  describe("handlePastedText", () => {
    it("default handling", () => {
      const wrapper = mount(<DraftailEditor stripPastedStyles={false} />);
      expect(
        wrapper
          .instance()
          .handlePastedText(
            "this is plain text paste",
            "this is plain text paste",
            wrapper.state("editorState"),
          ),
      ).toBe("not-handled");
    });
    it("stripPastedStyles", () => {
      const wrapper = mount(<DraftailEditor stripPastedStyles />);
      expect(
        wrapper
          .instance()
          .handlePastedText(
            "bold",
            "<p><strong>bold</strong></p>",
            wrapper.state("editorState"),
          ),
      ).toBe("not-handled");
    });
    it("handled by handleDraftEditorPastedText", () => {
      const wrapper = mount(<DraftailEditor stripPastedStyles={false} />);
      const text = "hello,\nworld!";
      const content = {
        blocks: [
          {
            data: {},
            depth: 0,
            entityRanges: [],
            inlineStyleRanges: [],
            key: "a",
            text,
            type: "unstyled",
          },
        ],
        entityMap: {},
      };
      const html = `<div data-draftjs-conductor-fragment='${JSON.stringify(
        content,
      )}'><p>${text}</p></div>`;
      expect(
        wrapper
          .instance()
          .handlePastedText(text, html, wrapper.state("editorState")),
      ).toBe("handled");
    });
    it("entities onPaste not-handled", () => {
      const onPaste = jest.fn(() => "not-handled");
      const wrapper = mount(
        <DraftailEditor
          entityTypes={[
            {
              type: ENTITY_TYPE.LINK,
              onPaste,
            },
          ]}
        />,
      );
      expect(
        wrapper
          .instance()
          .handlePastedText(
            "https://www.example.com/",
            "https://www.example.com/",
            wrapper.state("editorState"),
          ),
      ).toBe("not-handled");
    });
    it("entities onPaste handled", () => {
      const onPaste = jest.fn(() => "handled");
      const wrapper = mount(
        <DraftailEditor
          entityTypes={[
            {
              type: ENTITY_TYPE.LINK,
              onPaste,
            },
          ]}
        />,
      );
      expect(
        wrapper
          .instance()
          .handlePastedText(
            "https://www.example.com/",
            "https://www.example.com/",
            wrapper.state("editorState"),
          ),
      ).toBe("handled");
    });
    it("entities onPaste handled trumps stripPastedStyles", () => {
      const onPaste = jest.fn(() => "handled");
      const wrapper = mount(
        <DraftailEditor
          entityTypes={[
            {
              type: ENTITY_TYPE.LINK,
              onPaste,
            },
          ]}
          stripPastedStyles
        />,
      );
      expect(
        wrapper
          .instance()
          .handlePastedText(
            "https://www.example.com/",
            "https://www.example.com/",
            wrapper.state("editorState"),
          ),
      ).toBe("handled");
    });
  });
  describe("toggleBlockType", () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallowNoLifecycle(<DraftailEditor />);
      jest.spyOn(RichUtils, "toggleBlockType");
      jest.spyOn(wrapper.instance(), "onChange");
    });
    afterEach(() => {
      RichUtils.toggleBlockType.mockRestore();
    });
    it("works", () => {
      wrapper.instance().toggleBlockType("header-one");
      expect(RichUtils.toggleBlockType).toHaveBeenCalled();
      expect(wrapper.instance().onChange).toHaveBeenCalled();
    });
  });
  describe("toggleInlineStyle", () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallowNoLifecycle(<DraftailEditor />);
      jest.spyOn(RichUtils, "toggleInlineStyle");
      jest.spyOn(wrapper.instance(), "onChange");
    });
    afterEach(() => {
      RichUtils.toggleInlineStyle.mockRestore();
    });
    it("works", () => {
      wrapper.instance().toggleInlineStyle("BOLD");
      expect(RichUtils.toggleInlineStyle).toHaveBeenCalled();
      expect(wrapper.instance().onChange).toHaveBeenCalled();
    });
  });
  describe("onEditEntity", () => {
    const rawContentState = {
      entityMap: {
        1: {
          type: "LINK",
          mutability: "IMMUTABLE",
          data: {
            url: "test",
          },
        },
      },
      blocks: [
        {
          key: "b3kdk",
          text: "test",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [
            {
              offset: 0,
              length: 4,
              key: 1,
            },
          ],
          data: {},
        },
      ],
    };
    beforeEach(() => {
      jest
        .spyOn(DraftUtils, "getEntitySelection")
        .mockImplementation((editorState) => editorState.getSelection());
    });
    afterEach(() => {
      DraftUtils.getEntitySelection.mockRestore();
    });
    it("works", () => {
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          rawContentState={rawContentState}
          entityTypes={[
            {
              type: ENTITY_TYPE.LINK,
              source: () => {},
            },
          ]}
        />,
      );
      jest.spyOn(wrapper.instance(), "toggleSource");
      wrapper.instance().onEditEntity("1");
      expect(DraftUtils.getEntitySelection).toHaveBeenCalled();
      expect(wrapper.instance().toggleSource).toHaveBeenCalled();
    });
    it("block", () => {
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          rawContentState={rawContentState}
          entityTypes={[
            {
              type: ENTITY_TYPE.LINK,
              source: () => {},
              block: () => {},
            },
          ]}
        />,
      );
      jest.spyOn(wrapper.instance(), "toggleSource");
      wrapper.instance().onEditEntity("1");
      expect(DraftUtils.getEntitySelection).not.toHaveBeenCalled();
      expect(wrapper.instance().toggleSource).toHaveBeenCalled();
    });
  });
  describe("onRemoveEntity", () => {
    const rawContentState = {
      entityMap: {
        1: {
          type: "LINK",
          mutability: "IMMUTABLE",
          data: {
            url: "test",
          },
        },
      },
      blocks: [
        {
          key: "b3kdk",
          text: "test",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [],
          entityRanges: [
            {
              offset: 0,
              length: 4,
              key: 1,
            },
          ],
          data: {},
        },
      ],
    };
    beforeEach(() => {
      EditorState.push = jest.fn((e) => e);
      RichUtils.toggleLink = jest.fn();
      DraftUtils.getEntitySelection = jest.fn();
      DraftUtils.removeBlockEntity = jest.fn();
    });
    afterEach(() => {
      RichUtils.toggleLink.mockRestore();
      DraftUtils.getEntitySelection.mockRestore();
    });
    it("works", () => {
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          rawContentState={rawContentState}
          entityTypes={[
            {
              type: ENTITY_TYPE.LINK,
              source: () => {},
            },
          ]}
        />,
      );
      wrapper.instance().onChange = jest.fn();
      wrapper.instance().onRemoveEntity("1", "b3kdk");
      expect(RichUtils.toggleLink).toHaveBeenCalled();
      expect(EditorState.push).not.toHaveBeenCalled();
      expect(wrapper.instance().onChange).toHaveBeenCalled();
    });
    it("block", () => {
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          rawContentState={rawContentState}
          entityTypes={[
            {
              type: ENTITY_TYPE.LINK,
              source: () => {},
              block: () => {},
            },
          ]}
        />,
      );
      wrapper.instance().onChange = jest.fn();
      wrapper.instance().onRemoveEntity("1");
      expect(RichUtils.toggleLink).not.toHaveBeenCalled();
      expect(DraftUtils.removeBlockEntity).toHaveBeenCalled();
      expect(wrapper.instance().onChange).toHaveBeenCalled();
    });
  });
  describe("addHR", () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallowNoLifecycle(<DraftailEditor />);
      jest.spyOn(DraftUtils, "addHorizontalRuleRemovingSelection");
      jest.spyOn(wrapper.instance(), "onChange");
    });
    afterEach(() => {
      DraftUtils.addHorizontalRuleRemovingSelection.mockRestore();
    });
    it("works", () => {
      wrapper.instance().addHR();
      expect(DraftUtils.addHorizontalRuleRemovingSelection).toHaveBeenCalled();
      expect(wrapper.instance().onChange).toHaveBeenCalled();
    });
  });
  describe("addBR", () => {
    let wrapper;
    beforeEach(() => {
      wrapper = shallowNoLifecycle(<DraftailEditor />);
      jest.spyOn(DraftUtils, "addLineBreak");
      jest.spyOn(wrapper.instance(), "onChange");
    });
    afterEach(() => {
      DraftUtils.addLineBreak.mockRestore();
    });
    it("works", () => {
      wrapper.instance().addBR();
      expect(DraftUtils.addLineBreak).toHaveBeenCalled();
      expect(wrapper.instance().onChange).toHaveBeenCalled();
    });
  });
  describe("onUndoRedo", () => {
    let wrapper;
    beforeEach(() => {
      jest.spyOn(EditorState, "undo");
      jest.spyOn(EditorState, "redo");
      wrapper = shallowNoLifecycle(<DraftailEditor />);
      jest.spyOn(wrapper.instance(), "onChange");
    });
    afterEach(() => {
      EditorState.undo.mockRestore();
      EditorState.redo.mockRestore();
    });
    it("undo", () => {
      wrapper.instance().onUndoRedo("undo");
      expect(EditorState.undo).toHaveBeenCalled();
      expect(wrapper.instance().onChange).toHaveBeenCalled();
    });
    it("redo", () => {
      wrapper.instance().onUndoRedo("redo");
      expect(EditorState.redo).toHaveBeenCalled();
      expect(wrapper.instance().onChange).toHaveBeenCalled();
    });
    it("invalid", () => {
      wrapper.instance().onUndoRedo("invalid");
      expect(EditorState.undo).not.toHaveBeenCalled();
      expect(EditorState.redo).not.toHaveBeenCalled();
      expect(wrapper.instance().onChange).toHaveBeenCalled();
    });
  });
  describe("blockRenderer", () => {
    it("default", () => {
      const rawContentState = {
        entityMap: {},
        blocks: [
          {
            text: " ",
            type: "unstyled",
          },
        ],
      };
      expect(
        shallowNoLifecycle(<DraftailEditor rawContentState={rawContentState} />)
          .instance()
          .blockRenderer(convertFromRaw(rawContentState).getFirstBlock()),
      ).toBe(null);
    });
    it("atomic", () => {
      const rawContentState = {
        entityMap: {
          0: {
            type: "IMAGE",
          },
        },
        blocks: [
          {
            text: " ",
            type: "atomic",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 0,
              },
            ],
          },
        ],
      };
      const wrapper = shallowNoLifecycle(
        <DraftailEditor
          rawContentState={rawContentState}
          entityTypes={[
            {
              type: "IMAGE",
              source: () => {},
              decorator: () => {},
              block: () => {},
            },
          ]}
        />,
      );
      const contentState = convertFromRaw(rawContentState);
      expect(
        wrapper.instance().blockRenderer(contentState.getFirstBlock()),
      ).toMatchObject({
        props: {
          entityType: {
            type: "IMAGE",
          },
        },
      });
    });
    it("HORIZONTAL_RULE", () => {
      const rawContentState = {
        entityMap: {
          0: {
            type: "HORIZONTAL_RULE",
          },
        },
        blocks: [
          {
            text: " ",
            type: "atomic",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 0,
              },
            ],
          },
        ],
      };
      const wrapper = shallowNoLifecycle(
        <DraftailEditor rawContentState={rawContentState} />,
      );
      const contentState = convertFromRaw(rawContentState);
      expect(
        wrapper.instance().blockRenderer(contentState.getFirstBlock()),
      ).toMatchObject({
        component: DividerBlock,
      });
    });
    it("atomic missing entity", () => {
      const rawContentState = {
        entityMap: {},
        blocks: [
          {
            text: " ",
            type: "atomic",
          },
        ],
      };
      const wrapper = shallowNoLifecycle(
        <DraftailEditor rawContentState={rawContentState} />,
      );
      const contentState = convertFromRaw(rawContentState);
      expect(
        wrapper.instance().blockRenderer(contentState.getFirstBlock()),
      ).toEqual({
        editable: false,
      });
    });
  });
  describe("source", () => {
    describe("onRequestSource", () => {
      it("empty", () => {
        const wrapper = shallowNoLifecycle(<DraftailEditor />);
        wrapper.instance().onRequestSource("LINK");
        expect(wrapper.state()).toMatchObject({
          readOnlyState: true,
          sourceOptions: {
            entityType: undefined,
          },
        });
      });
      it("with sourceOptions", () => {
        const source = () => <blockquote />;

        const wrapper = shallowNoLifecycle(
          <DraftailEditor
            entityTypes={[
              {
                type: "LINK",
                source,
              },
            ]}
          />,
        );
        wrapper.instance().onRequestSource("LINK");
        expect(wrapper.state()).toMatchObject({
          readOnlyState: true,
          sourceOptions: {
            entityType: {
              type: "LINK",
              source,
            },
          },
        });
      });
      it("with entity", () => {
        const source = () => <blockquote />;

        const wrapper = shallowNoLifecycle(
          <DraftailEditor
            entityTypes={[
              {
                type: "LINK",
                source,
              },
            ]}
            rawContentState={{
              entityMap: {
                0: {
                  type: "LINK",
                  mutability: "MUTABLE",
                  data: {
                    href: "example.com",
                  },
                },
              },
              blocks: [
                {
                  key: "b3kdk",
                  text: "test",
                  type: "unstyled",
                  depth: 0,
                  inlineStyleRanges: [],
                  entityRanges: [
                    {
                      offset: 0,
                      length: 4,
                      key: 0,
                    },
                  ],
                  data: {},
                },
              ],
            }}
          />,
        );
        wrapper.instance().onRequestSource("LINK");
        expect(wrapper.state()).toMatchObject({
          readOnlyState: true,
          sourceOptions: {
            entityType: {
              type: "LINK",
              source,
            },
          },
        });
      });
    });
    describe("onCompleteSource", () => {
      beforeEach(() => {
        jest.useFakeTimers();
      });
      it("empty", () => {
        const wrapper = mount(<DraftailEditor />);
        wrapper.instance().onCompleteSource(null);
        expect(wrapper.state("sourceOptions")).toBe(null);
        jest.runOnlyPendingTimers();
        expect(wrapper.state("readOnlyState")).toBe(false);
        const focus = jest.fn();
        wrapper.instance().editorRef.focus = focus;
        jest.runOnlyPendingTimers();
        expect(focus).toHaveBeenCalled();
      });
      it("works", () => {
        const wrapper = shallowNoLifecycle(<DraftailEditor />);
        wrapper.instance().onCompleteSource(wrapper.state("editorState"));
        expect(wrapper.state("hasFocus")).toBe(false);
      });
    });
  });
  describe("onCloseSource", () => {
    it("works", () => {
      const wrapper = shallowNoLifecycle(<DraftailEditor />);
      wrapper.instance().toggleSource();
      wrapper.instance().onCloseSource();
      expect(wrapper.state("sourceOptions")).toBe(null);
      expect(wrapper.state("readOnlyState")).toBe(false);
    });
  });
  describe("#focus", () => {
    it("works", () => {
      const wrapper = mount(<DraftailEditor />);
      const focus = jest.fn();
      wrapper.instance().editorRef.focus = focus;
      wrapper.instance().focus();
      expect(focus).toHaveBeenCalled();
    });
  });
  describe("#plugins", () => {
    it("forwards to draft-js-plugins-editor", () => {
      expect(
        shallowNoLifecycle(
          <DraftailEditor
            plugins={[
              {
                test: true,
              },
            ]}
          />,
        )
          .find(Editor)
          .prop("plugins")
          .slice(0, -1),
      ).toEqual([
        {
          test: true,
        },
      ]);
    });
    it("contains keyBindingFn for default behaviour", () => {
      const getBinding = jest.spyOn(behavior, "getKeyBindingFn");
      const plugins = shallowNoLifecycle(<DraftailEditor />)
        .find(Editor)
        .prop("plugins");
      expect(getBinding).toHaveBeenCalled();
      const keyBindingFn = getBinding.mock.results[0].value;
      expect(plugins).toEqual([
        {
          keyBindingFn,
        },
      ]);
    });
    it("passes plugin keyBindingFns to Draft-JS", () => {
      const pluginBinding = jest.fn();
      const keyBindingFn = shallowNoLifecycle(
        <DraftailEditor
          plugins={[
            {
              keyBindingFn: pluginBinding,
            },
          ]}
        />,
      )
        .find(Editor)
        .dive()
        .prop("keyBindingFn");
      keyBindingFn(
        new KeyboardEvent("keydown", {
          key: "e",
        }),
      );
      expect(pluginBinding).toHaveBeenCalled();
    });
  });
});