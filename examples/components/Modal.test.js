import React from "react";
import { shallow } from "enzyme";

import Modal from "./Modal";

describe("Modal", () => {
  it("has defaults", () => {
    expect(shallow(<Modal>Test</Modal>)).toMatchInlineSnapshot(`
      <Modal
        ariaHideApp={false}
        bodyOpenClassName="modal__container--open"
        className={
          Object {
            "afterOpen": "modal--open",
            "base": "modal",
            "beforeClose": "modal--before-close",
          }
        }
        closeTimeoutMS={0}
        contentElement={[Function]}
        isOpen={false}
        overlayClassName={
          Object {
            "afterOpen": "modal__overlay--open",
            "base": "modal__overlay",
            "beforeClose": "modal__overlay--before-close",
          }
        }
        overlayElement={[Function]}
        parentSelector={[Function]}
        portalClassName="portal"
        preventScroll={false}
        role="dialog"
        shouldCloseOnEsc={true}
        shouldCloseOnOverlayClick={true}
        shouldFocusAfterRender={true}
        shouldReturnFocusAfterClose={true}
      >
        Test
      </Modal>
    `);
  });

  it("forwards its props", () => {
    expect(
      shallow(<Modal forwarded>Test</Modal>)
        .find("Modal")
        .prop("forwarded"),
    ).toBe(true);
  });
});
