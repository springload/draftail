import React from "react";
import type { Node } from "react";

export type IconProp = string | string[] | Node;

type Props = {
  icon: IconProp;
  title: string | null | undefined;
  className: string | null | undefined;
};

/**
 * Icon as SVG element. Can optionally render a React element instead.
 */
const Icon = ({ icon, title, className }: Props) => {
  let children;

  if (typeof icon === "string") {
    if (icon.includes("#")) {
      children = <use xlinkHref={icon} />;
    } else {
      children = <path d={icon} />;
    }
  } else if (Array.isArray(icon)) {
    // eslint-disable-next-line @thibaudcolas/cookbook/react/no-array-index-key
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
      aria-hidden={title ? null : true}
      role={title ? "img" : null}
      aria-label={title || null}
    >
      {children}
    </svg>
  );
};

Icon.defaultProps = {
  title: null,
  className: null,
};

export default Icon;
