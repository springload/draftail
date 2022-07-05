import React from "react";
import { shallow } from "enzyme";

import Tooltip from "./Tooltip";

const target = {
  top: 1,
  left: 1,
  width: 12,
  height: 1200,
};

describe("Tooltip", () => {
  it("#direction top", () => {
    expect(
      shallow(
        <Tooltip target={target} direction="top" textDirectionality="LTR">
          Test
        </Tooltip>,
      ),
    ).toMatchInlineSnapshot(`
      <div
        className="Tooltip Tooltip--top"
        role="tooltip"
        style={
          Object {
            "insetInlineStart": 7,
            "top": 1201,
          }
        }
      >
        Test
      </div>
    `);
  });

  it("#direction start", () => {
    expect(
      shallow(
        <Tooltip target={target} direction="start" textDirectionality="LTR">
          Test
        </Tooltip>,
      ),
    ).toMatchInlineSnapshot(`
      <div
        className="Tooltip Tooltip--start"
        role="tooltip"
        style={
          Object {
            "insetInlineStart": 13,
            "top": 601,
          }
        }
      >
        Test
      </div>
    `);
  });

  it("#direction top-start", () => {
    expect(
      shallow(
        <Tooltip target={target} direction="top-start" textDirectionality="LTR">
          Test
        </Tooltip>,
      ),
    ).toMatchInlineSnapshot(`
      <div
        className="Tooltip Tooltip--top-start"
        role="tooltip"
        style={
          Object {
            "insetInlineStart": 1,
            "top": 1201,
          }
        }
      >
        Test
      </div>
    `);
  });
});
