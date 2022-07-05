import React from "react";
import { shallow } from "enzyme";
import Portal, { PortalProps } from "./Portal";

const f = expect.any(Function);

const typedShallow = (elt: React.ReactElement) =>
  shallow<Portal, PortalProps>(elt);

describe("Portal", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("empty", () => {
    expect(typedShallow(<Portal onClose={() => {}} />)).toMatchSnapshot();
  });

  it("#children", () => {
    expect(
      typedShallow(<Portal onClose={() => {}}>Test!</Portal>),
    ).toMatchSnapshot();
  });

  it("component lifecycle", () => {
    jest.spyOn(document, "removeEventListener");
    jest.spyOn(window, "removeEventListener");

    const wrapper = typedShallow(<Portal onClose={() => {}}>Test!</Portal>);

    wrapper.instance().componentDidMount();

    expect(document.body.innerHTML).toMatchSnapshot();

    expect(wrapper.instance().portal).toBe(document.body.children[0]);

    wrapper.instance().componentDidMount();

    wrapper.instance().componentWillUnmount();

    expect(document.body.innerHTML).toBe("");

    expect(document.removeEventListener).toHaveBeenCalledWith("mouseup", f);
    expect(document.removeEventListener).toHaveBeenCalledWith("keyup", f);
    expect(window.removeEventListener).toHaveBeenCalledWith("resize", f);

    jest.restoreAllMocks();
  });

  describe("#onClose", () => {
    beforeEach(() => {
      jest.spyOn(document, "addEventListener");
      jest.spyOn(window, "addEventListener");
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it("#closeOnClick", () => {
      const onClose = jest.fn();
      typedShallow(
        <Portal onClose={onClose} closeOnClick>
          Test!
        </Portal>,
      );
      expect(document.addEventListener).toHaveBeenCalledWith("mouseup", f);
    });

    it("#closeOnType", () => {
      const onClose = jest.fn();
      typedShallow(
        <Portal onClose={onClose} closeOnType>
          Test!
        </Portal>,
      );
      expect(document.addEventListener).toHaveBeenCalledWith("keyup", f);
    });

    it("#closeOnResize", () => {
      const onClose = jest.fn();
      typedShallow(
        <Portal onClose={onClose} closeOnResize>
          Test!
        </Portal>,
      );
      expect(window.addEventListener).toHaveBeenCalledWith("error", f);
    });
  });

  describe("onCloseEvent", () => {
    it("shouldClose", () => {
      const onClose = jest.fn();
      const wrapper = typedShallow(<Portal onClose={onClose}>Test!</Portal>);
      const target = document.createElement("div");

      wrapper.instance().onCloseEvent({ target } as unknown as KeyboardEvent);

      expect(onClose).toHaveBeenCalled();
    });

    it("not shouldClose", () => {
      const onClose = jest.fn();
      const wrapper = typedShallow(
        <Portal onClose={onClose}>
          <div id="test">Test</div>
        </Portal>,
      );
      const target = document.querySelector("#test");

      wrapper.instance().onCloseEvent({ target } as unknown as KeyboardEvent);

      expect(onClose).not.toHaveBeenCalled();
    });
  });
});
