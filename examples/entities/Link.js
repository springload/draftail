import PropTypes from "prop-types";
import React from "react";

import TooltipEntity from "./TooltipEntity";

const Link = (props) => {
  const { entityKey, contentState } = props;
  const { url, linkType } = contentState.getEntity(entityKey).getData();
  const isEmailLink = linkType === "email" || url.startsWith("mailto:");
  const icon = `#icon-${isEmailLink ? "mail" : "link"}`;
  const label = url.replace(/(^\w+:|^)\/\//, "").split("/")[0];

  return <TooltipEntity {...props} icon={icon} label={label} />;
};

Link.propTypes = {
  entityKey: PropTypes.string.isRequired,
  contentState: PropTypes.object.isRequired,
};

export default Link;
