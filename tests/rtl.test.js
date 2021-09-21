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

  it("It fires the saveHandler when the component mounts", async () => {
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

    // 100ms is too low
    await new Promise((res) => setTimeout(res, 500));

    expect(saveHandler).toHaveBeenCalledTimes(1);
  });

  it("It fires the saveHandler a second time when text is entered (timeouts technique)", async () => {
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

    // 100ms is too low
    await new Promise((res) => setTimeout(res, 500));

    expect(saveHandler).toHaveBeenCalledTimes(1);

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

    await new Promise((res) => setTimeout(res, 500));

    expect(saveHandler).toHaveBeenCalledTimes(2);
  });

  it("It fires the saveHandler a second time when text is entered (waitfor technique)", async () => {
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

    await waitFor(() => expect(saveHandler).toHaveBeenCalledTimes(1));

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
    await waitFor(() => expect(saveHandler).toHaveBeenCalledTimes(2));
  });

  it("If you don't wait for the original onMount saveHandler, then the two onSaves will be batched into one", async () => {
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

    await new Promise((res) => setTimeout(res, 500));

    expect(saveHandler).toHaveBeenCalledTimes(1);
  });
});
