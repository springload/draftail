import PropTypes from "prop-types";
import React from "react";

const FontIcon = ({ icon }) => (
  <span className={`icon icon-${icon}`} aria-hidden />
);

FontIcon.propTypes = {
  icon: PropTypes.string.isRequired,
};

export default FontIcon;
