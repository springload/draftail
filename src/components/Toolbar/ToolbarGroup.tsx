import React from "react";

interface ToolbarGroupProps {
  children?: React.ReactNode;
}

const ToolbarGroup = ({ children }: ToolbarGroupProps) => {
  const hasChildren = React.Children.toArray(children).some((c) => c !== null);
  return hasChildren ? (
    <div className="Draftail-ToolbarGroup">{children}</div>
  ) : null;
};

export default ToolbarGroup;
