import React from "react";
import { shallow } from "enzyme";
import { EditorState, convertFromHTML, ContentState } from "draft-js";

import CharCount, { countChars } from "./CharCount";

describe("CharCount", () => {
  it("works", () => {
    const { contentBlocks } = convertFromHTML("<p>hello</p>");
    const contentState = ContentState.createFromBlockArray(contentBlocks);
    const editorState = EditorState.createWithContent(contentState);

    expect(shallow(<CharCount getEditorState={() => editorState} />))
      .toMatchInlineSnapshot(`
      <div
        className="Draftail-ToolbarButton CharCount"
      >
        5
      </div>
    `);
  });

  it("supports 0", () => {
    expect(
      shallow(<CharCount getEditorState={() => EditorState.createEmpty()} />),
    ).toMatchInlineSnapshot(`
      <div
        className="Draftail-ToolbarButton CharCount"
      >
        0
      </div>
    `);
  });
});

describe.each`
  text         | length | segmenterLength
  ${"123456"}  | ${6}   | ${6}
  ${"123 45"}  | ${6}   | ${6}
  ${"123\n45"} | ${6}   | ${6}
  ${"\n"}      | ${1}   | ${1}
  ${""}        | ${0}   | ${0}
  ${" "}       | ${1}   | ${1}
  ${"❤️"}      | ${2}   | ${1}
  ${"👨‍👨‍👧"}      | ${5}   | ${1}
`("countChars", ({ text, length, segmenterLength }) => {
  test(text, () => {
    expect(countChars(text)).toBe(length);
    const s = new Intl.Segmenter("en", { granularity: "grapheme" });
    expect(Array.from(s.segment(text))).toHaveLength(segmenterLength);
  });
});
