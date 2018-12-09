import PropTypes from "prop-types";
import React from "react";

import FontIcon from "../components/FontIcon";
import TooltipEntity from "./TooltipEntity";

export const DOCUMENT_ICON = <FontIcon icon="document" />;

const Document = (props) => {
  const { entityKey, contentState } = props;
  const { url, id } = contentState.getEntity(entityKey).getData();
  // Supports documents defined based on a URL, and id.
  const label = url ? url.replace(/(^\w+:|^)\/\//, "").split("/")[0] : id;
  return <TooltipEntity {...props} icon={DOCUMENT_ICON} label={label} />;
};

Document.propTypes = {
  entityKey: PropTypes.string.isRequired,
  contentState: PropTypes.object.isRequired,
};

export default Document;
