import {
  EditorState,
  ContentState,
  convertFromHTML,
  convertToRaw,
} from "draft-js";
import LinkSource from "../sources/LinkSource";

import { getValidLinkURL, hasLinkPattern, onPasteLink } from "./Link";

const testEntityType = {
  type: "Test",
  source: LinkSource,
  schemes: ["http:", "https:", "ftp:", "ftps:"],
};

describe.each`
  text                                 | url                                 | pattern
  ${"test@example.com"}                | ${"mailto:test@example.com"}        | ${true}
  ${"start test@example.com"}          | ${false}                            | ${true}
  ${"test@example.com end"}            | ${false}                            | ${true}
  ${"start test@example.com end"}      | ${false}                            | ${true}
  ${"test@example.com-test"}           | ${false}                            | ${false}
  ${"test@example-site.com"}           | ${"mailto:test@example-site.com"}   | ${true}
  ${"test@test.example.com"}           | ${"mailto:test@test.example.com"}   | ${true}
  ${"test@test.example.co.uk"}         | ${"mailto:test@test.example.co.uk"} | ${true}
  ${"test@xn--ls8h.la"}                | ${"mailto:test@xn--ls8h.la"}        | ${true}
  ${"test@example"}                    | ${false}                            | ${false}
  ${"test@.com"}                       | ${false}                            | ${false}
  ${"mailto:test@.com"}                | ${false}                            | ${false}
  ${"example.com"}                     | ${false}                            | ${false}
  ${"test@example.com-"}               | ${false}                            | ${false}
  ${"http://example.com"}              | ${"http://example.com"}             | ${true}
  ${"start http://example.com"}        | ${false}                            | ${true}
  ${"http://example.com end"}          | ${false}                            | ${true}
  ${"start http://example.com end"}    | ${false}                            | ${true}
  ${"http://example-site.com"}         | ${"http://example-site.com"}        | ${true}
  ${"http://example.com-test"}         | ${"http://example.com-test"}        | ${true}
  ${"http://test.example.com"}         | ${"http://test.example.com"}        | ${true}
  ${"http://test.example.co.uk"}       | ${"http://test.example.co.uk"}      | ${true}
  ${"https://example.com"}             | ${"https://example.com"}            | ${true}
  ${"http://white.co http://space.co"} | ${false}                            | ${true}
  ${"https://xn--ls8h.la"}             | ${"https://xn--ls8h.la"}            | ${true}
  ${"ftp://example.com"}               | ${"ftp://example.com"}              | ${true}
  ${"ftps://example.com"}              | ${"ftps://example.com"}             | ${true}
  ${"//example.com"}                   | ${false}                            | ${false}
  ${"https://example.com/#test"}       | ${"https://example.com/#test"}      | ${true}
  ${"example"}                         | ${false}                            | ${false}
  ${"03069990000"}                     | ${false}                            | ${false}
  ${"tel:03069990000"}                 | ${false}                            | ${false}
  ${"file://test"}                     | ${false}                            | ${false}
`("link detection", ({ text, url, pattern }) => {
  test(`getValidLinkURL ${text}`, () => {
    expect(getValidLinkURL(text, testEntityType.schemes)).toBe(url);
  });

  test(`hasLinkPattern ${text}`, () => {
    expect(hasLinkPattern(text)).toBe(pattern);
  });
});

describe("onPasteLink", () => {
  let editorState: EditorState;
  let setEditorState: jest.Mock<(state: EditorState) => void>;

  beforeEach(() => {
    const { contentBlocks } = convertFromHTML("<p>hello</p>");
    const contentState = ContentState.createFromBlockArray(contentBlocks);
    editorState = EditorState.createWithContent(contentState);

    setEditorState = jest.fn((state) => state);
  });

  it("discards invalid URLs", () => {
    expect(
      onPasteLink(
        "test",
        null,
        editorState,
        { setEditorState },
        testEntityType,
      ),
    ).toBe("not-handled");
    expect(setEditorState).not.toHaveBeenCalled();
  });

  it("creates link onto selected text", () => {
    const selection = editorState.getSelection().merge({
      focusOffset: 4,
    });
    const selected = EditorState.forceSelection(editorState, selection);
    expect(
      onPasteLink(
        "https://example.com/selected",
        null,
        selected,
        { setEditorState },
        testEntityType,
      ),
    ).toBe("handled");
    const content = setEditorState.mock.calls[0][0].getCurrentContent();
    expect(content.getFirstBlock().getText()).toBe("hello");
    expect(
      content.getEntity(content.getLastCreatedEntityKey()).getData().url,
    ).toBe("https://example.com/selected");
  });

  it("creates link with paste as link text when collapsed", () => {
    expect(
      onPasteLink(
        "https://example.com/collapsed",
        null,
        editorState,
        { setEditorState },
        testEntityType,
      ),
    ).toBe("handled");
    const content = setEditorState.mock.calls[0][0].getCurrentContent();
    expect(content.getFirstBlock().getText()).toBe(
      "https://example.com/collapsedhello",
    );
    expect(
      content.getEntity(content.getLastCreatedEntityKey()).getData().url,
    ).toBe("https://example.com/collapsed");
  });

  it("creates link within text on paste", () => {
    expect(
      onPasteLink(
        "start https://example.com/",
        "<span>start https://example.com/</span>",
        editorState,
        { setEditorState },
        testEntityType,
      ),
    ).toBe("handled");
    const content = setEditorState.mock.calls[0][0].getCurrentContent();
    expect(content.getFirstBlock().getText()).toBe(
      "start https://example.com/hello",
    );
    expect(
      content.getEntity(content.getLastCreatedEntityKey()).getData().url,
    ).toBe("https://example.com/");
    expect(convertToRaw(content)).toBe("test");
  });
});
