import React from "react";
import { shallow } from "enzyme";
import { EditorState, convertFromHTML, ContentState } from "draft-js";
import CharCount from "./CharCount";
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