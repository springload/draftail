import React from "react";

interface ToolbarGroupProps {
  name: string;
  children?: React.ReactNode;
}

const ToolbarGroup = ({ name, children }: ToolbarGroupProps) => {
  const hasChildren = React.Children.toArray(children).some((c) => c !== null);
  return hasChildren ? (
    <div className={`Draftail-ToolbarGroup Draftail-ToolbarGroup--${name}`}>
      {children}
    </div>
  ) : null;
};

export default ToolbarGroup;
