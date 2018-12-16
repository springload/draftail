import React from "react";
import { shallow } from "enzyme";

import Modal from "./Modal";

describe("Modal", () => {
  it("has defaults", () => {
    expect(shallow(<Modal>Test</Modal>)).toMatchSnapshot();
  });

  it("forwards its props", () => {
    expect(
      shallow(<Modal forwarded>Test</Modal>)
        .find("Modal")
        .prop("forwarded"),
    ).toBe(true);
  });
});
