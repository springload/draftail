import React from "react";
import {
  createEvent,
  fireEvent,
  getByText,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { DraftailEditor } from "../lib";

describe("DraftailEditor RTL", () => {
  it("selectable by ARIA attributes", () => {
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

  it("updateable with RTL APIs", async () => {
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
