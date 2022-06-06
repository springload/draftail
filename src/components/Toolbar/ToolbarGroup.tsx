import React from "react";
import type { Node } from "react";

type Props = {
  children?: Node;
};

const ToolbarGroup = ({ children }: Props) => {
  const hasChildren = React.Children.toArray(children).some((c) => c !== null);
  return hasChildren ? (
    <div className="Draftail-ToolbarGroup">{children}</div>
  ) : null;
};

ToolbarGroup.defaultProps = {
  children: null,
};

export default ToolbarGroup;
