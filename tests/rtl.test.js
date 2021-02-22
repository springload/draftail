import React from "react";
import { getByText, render, screen } from "@testing-library/react";
import { EditorState, ContentState } from "draft-js";

import { DraftailEditor } from "../lib";

describe("Draftail", async () => {
  it("Is selectable by aria tags", () => {
    const saveHandler = jest.fn();

    render(
      <DraftailEditor
        ariaDescribedBy="foo"
        ariaLabel="aria label"
        inlineStyles={[]}
        spellCheck={false}
        rawContentState={{
          entityMap: {},
          blocks: [
            {
              key: "aaa",
              text: "abc",
            },
          ],
        }}
        blockTypes={[]}
        onSave={saveHandler}
        placeholder="placeholder"
        className="classname"
      />,
    );

    const textbox = screen.getByRole("textbox", {
      name: "aria label",
    });

    // Check initial value exists
    getByText(textbox, "abc");
  });

  it("You can update the state of it", async () => {
    const saveHandler = jest.fn();

    let onChange = null;
    const onMount = (onchange) => {
      onChange = onchange;
    };

    render(
      <DraftailEditor
        onMount={onMount}
        ariaDescribedBy="foo"
        ariaLabel="aria label"
        inlineStyles={[]}
        spellCheck={false}
        rawContentState={{
          entityMap: {},
          blocks: [
            {
              key: "aaa",
              text: "abc",
            },
          ],
        }}
        blockTypes={[]}
        onSave={saveHandler}
        placeholder="placeholder"
        className="classname"
      />,
    );

    const textbox = screen.getByRole("textbox", {
      name: "aria label",
    });

    // Check initial value exists
    getByText(textbox, "abc");

    // Update the content
    onChange(
      EditorState.createWithContent(ContentState.createFromText("hello")),
    );

    // Expect that it has changed
    getByText(
      screen.getByRole("textbox", {
        name: "aria label",
      }),
      "hello",
    );
  });
});
