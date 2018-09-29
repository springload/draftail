import React from "react";
import { shallow } from "enzyme";

import getComponentWrapper from "./getComponentWrapper";

describe("getComponentWrapper", () => {
  it("works", () => {
    const Wrapped = () => <div />;
    const Wrapper = getComponentWrapper(Wrapped, {
      test: true,
    });

    expect(shallow(<Wrapper />)).toMatchSnapshot();
  });
});
