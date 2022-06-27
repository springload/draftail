import React from "react";
import { IconProp } from "../api/types";

export interface IconProps {
  icon: IconProp;
  title?: string | null;
  className?: string | null;
}

/**
 * Icon as SVG element. Can optionally render a React element instead.
 */
const Icon = ({ icon, title, className }: IconProps) => {
  let children;

  if (typeof icon === "string") {
    if (icon.includes("#")) {
      children = <use xlinkHref={icon} />;
    } else {
      children = <path d={icon} />;
    }
  } else if (Array.isArray(icon)) {
    // eslint-disable-next-line react/no-array-index-key
    children = icon.map((d, i) => <path key={i} d={d} />);
  } else {
    return icon;
  }

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 1024 1024"
      className={`Draftail-Icon ${className || ""}`}
      aria-hidden={title ? undefined : "true"}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
    >
      {children}
    </svg>
  );
};

export default Icon;
