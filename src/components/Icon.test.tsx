import React from "react";
import { shallow } from "enzyme";
import Icon from "./Icon";

const SQUARE = "M10 10 H 90 V 90 H 10 Z";

const CustomIcon = ({ icon }: { icon: string }) => (
  <span className={`icon icon-${icon}`} aria-hidden />
);

describe("Icon", () => {
  it("#className", () => {
    expect(
      shallow(<Icon icon={SQUARE} className="u-test" />),
    ).toMatchSnapshot();
  });

  it("#title", () => {
    expect(
      shallow(<Icon icon={SQUARE} title="Test title" />),
    ).toMatchSnapshot();
  });

  describe("#icon", () => {
    it("svg path", () => {
      expect(shallow(<Icon icon={SQUARE} />)).toMatchSnapshot();
    });

    it("svg path array", () => {
      expect(shallow(<Icon icon={[SQUARE, SQUARE]} />)).toMatchSnapshot();
    });

    it("inline svg ref", () => {
      expect(shallow(<Icon icon="#square" />)).toMatchSnapshot();
    });

    it("external svg ref", () => {
      expect(shallow(<Icon icon="test.svg#square" />)).toMatchSnapshot();
    });

    it("custom", () => {
      expect(
        shallow(<Icon icon={<CustomIcon icon="square" />} />),
      ).toMatchSnapshot();
    });
  });
});
