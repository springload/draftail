import React from "react";
import {
  act,
  fireEvent,
  getByText,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditorState } from "draft-js";

import {
  findRenderedDOMComponentWithClass,
  findRenderedDOMComponentWithTag,
} from "react-dom/test-utils";
import { DraftailEditor } from "../lib";
import { KEY_CODES } from "../lib/api/constants";

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

    // Everything is fine till here.

    userEvent.type("textbox", "123");

    // fails
    getByText(
      screen.getByRole("textbox", {
        name: "aria label",
      }),
      "abc123",
    );
  });

  it.skip("You can fire user events on it", async () => {
    const saveHandler = jest.fn();

    const renderResult = render(
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

    // fireEvent(textbox, new KeyboardEvent('keyDown', {
    //     keyCode: 65
    // }));

    act(() => {
      fireEvent.keyDown(textbox, { key: "A", code: "KeyA" });
    });

    textbox// textEvent.initTextEvent ('textInput', true, true, null, "aaa"); // const textEvent = document.createEvent('TextEvent'); // const textarea = textbox.getElementsByClassName('public-DraftEditor-content')[0]; // await new Promise((res) => setTimeout(() => res(null), 1000)) // console.log("1");
    // textarea.dispatchEvent(textEvent);

    // console.log("2");

    // const de = findRenderedDOMComponentWithClass(renderResult., 'public-DraftEditor-content');
    // console.log(de);

    // const newEditorState = EditorState.
    // EditorState.push()

    // https://github.com/facebook/draft-js/issues/325#issuecomment-300372428

    // userEvent.type(textbox, "hello");

    // function addTextToDraftJs(className, text) {
    //     const components = document.getElementsByClassName(className);
    //     if(components && components.length) {
    //       const textarea = components[0].getElementsByClassName('public-DraftEditor-content')[0];
    //       const textEvent = document.createEvent('TextEvent');
    //       textEvent.initTextEvent ('textInput', true, true, null, text);
    //       textarea.dispatchEvent(textEvent);
    //     }
    //   }

    //   addTextToDraftJs('public-DraftEditor-content', 'Add this text at cursor position');

    .screen
      .debug();
  });
});
