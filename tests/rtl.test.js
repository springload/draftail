import React from "react";
import {
  createEvent,
  fireEvent,
  getByText,
  render,
  screen,
} from "@testing-library/react";
import { DraftailEditor } from "../lib";

describe("Draftail", () => {
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

  it("You can update the state of it using RTL", async () => {
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

    const textarea = screen.getByRole("textbox", {
      name: "aria label",
    });

    const event = createEvent.paste(textarea, {
      clipboardData: {
        types: ["text/plain"],
        getData: () => "hello",
      },
    });

    fireEvent(textarea, event);

    const textbox = screen.getByRole("textbox", {
      name: "aria label",
    });

    getByText(textbox, "abchello");
  });
});
