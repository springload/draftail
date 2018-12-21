// @flow
import React from "react";

const FontIcon = ({ icon }: { icon: string }) => (
  <span className={`icon icon-${icon}`} aria-hidden />
);

export default FontIcon;
