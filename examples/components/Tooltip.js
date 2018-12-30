// @flow
import React from "react";
import type { Node } from "react";

const TOP = "top";
const LEFT = "left";
const TOP_LEFT = "top-left";

export type Rect = {
  top: number,
  left: number,
  width: number,
  height: number,
};

type Direction = "top" | "left" | "top-left";

const getTooltipStyles = (
  target: Rect,
  direction: Direction,
): {| top: number, left: number |} => {
  const top = window.pageYOffset + target.top;
  const left = window.pageXOffset + target.left;
  switch (direction) {
    case TOP:
      return {
        top: top + target.height,
        left: left + target.width / 2,
      };
    case LEFT:
      return {
        top: top + target.height / 2,
        left: left + target.width,
      };
    case TOP_LEFT:
    default:
      return {
        top: top + target.height,
        left,
      };
  }
};

type Props = {|
  target: Rect,
  children: Node,
  direction: Direction,
|};

/**
 * A tooltip, with arbitrary content.
 */
const Tooltip = ({ target, children, direction }: Props) => (
  <div
    style={getTooltipStyles(target, direction)}
    className={`Tooltip Tooltip--${direction}`}
    role="tooltip"
  >
    {children}
  </div>
);

export default Tooltip;
