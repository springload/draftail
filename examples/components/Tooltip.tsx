import React from "react";
import { TextDirectionality } from "../../src";

const TOP = "top";
const START = "start";
const TOP_START = "top-start";

export type Rect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type Direction = "top" | "start" | "top-start";

const getTooltipStyles = (
  target: Rect,
  direction: Direction,
  textDirectionality: "RTL" | "LTR" | null,
): {
  top: number;
  insetInlineStart: number;
} => {
  const documentRTL = document.dir === "rtl";
  const forcedRTL = textDirectionality === "RTL";
  const isRTL = forcedRTL || documentRTL;
  const dirFactor = isRTL ? -1 : 1;
  const top = window.scrollY + target.top;
  const start =
    window.scrollX + dirFactor * target.left + (isRTL ? window.innerWidth : 0);

  switch (direction) {
    case TOP:
      return {
        top: top + target.height,
        insetInlineStart: start + dirFactor * (target.width / 2),
      };
    case START:
      return {
        top: top + target.height / 2,
        insetInlineStart: start + (isRTL ? 0 : target.width),
      };
    case TOP_START:
    default:
      return {
        top: top + target.height,
        insetInlineStart: start,
      };
  }
};

type Props = {
  target: Rect;
  children: React.ReactNode;
  direction: Direction;
  textDirectionality: TextDirectionality;
};

/**
 * A tooltip, with arbitrary content.
 */
const Tooltip = ({
  target,
  children,
  direction,
  textDirectionality,
}: Props) => (
  <div
    style={getTooltipStyles(target, direction, textDirectionality)}
    className={`Tooltip Tooltip--${direction}`}
    role="tooltip"
    dir={textDirectionality === "RTL" ? "rtl" : undefined}
  >
    {children}
  </div>
);

export default Tooltip;
