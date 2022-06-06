import React from "react";
type Props = {
  icon: string;
};

const FontIcon = ({ icon }: Props) => (
  <span className={`icon icon-${icon}`} aria-hidden />
);

export default FontIcon;