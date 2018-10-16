// @flow
import React from "react";
import type { Node } from "react";
import { ContentState } from "draft-js";

export const COLOR_ICON =
  "M322.018 832l57.6-192h264.764l57.6 192h113.632l-191.996-640h-223.236l-192 640h113.636zM475.618 320h72.764l57.6 192h-187.964l57.6-192z";

type Props = {|
  entityKey: string,
  contentState: ContentState,
  children: Node,
|};

const Color = (props: Props) => {
  const { entityKey, contentState, children } = props;
  const { color } = contentState.getEntity(entityKey).getData();
  return <span style={{ color }}>{children}</span>;
};

export default Color;
