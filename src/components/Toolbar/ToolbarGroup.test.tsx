import React from "react";
import { shallow } from "enzyme";
import ToolbarGroup from "./ToolbarGroup";

describe("ToolbarGroup", () => {
  it("children", () => {
    expect(
      shallow(
        <ToolbarGroup name="empty">
          <span>Test child</span>
        </ToolbarGroup>,
      ),
    ).toMatchSnapshot();
  });

  it("empty", () => {
    expect(shallow(<ToolbarGroup name="empty" />)).toMatchSnapshot();
  });

  it("empty children", () => {
    expect(
      shallow(
        <ToolbarGroup name="empty">
          {null}
          {null}
        </ToolbarGroup>,
      ),
    ).toMatchSnapshot();
  });

  it("empty array children", () => {
    expect(
      shallow(<ToolbarGroup name="empty">{[]}</ToolbarGroup>),
    ).toMatchSnapshot();
  });
});
