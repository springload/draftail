import React from "react";

import FontIcon from "../components/FontIcon";
import TooltipEntity from "./TooltipEntity";
import { EntityDecoratorProps } from "../../src";

export const DOCUMENT_ICON = <FontIcon icon="document" />;

const Document = ({
  entityKey,
  contentState,
  children,
  onEdit,
  onRemove,
  textDirectionality,
}: EntityDecoratorProps) => {
  const { url, id } = contentState.getEntity(entityKey).getData();
  // Supports documents defined based on a URL, and id.
  const label = url ? url.replace(/(^\w+:|^)\/\//, "").split("/")[0] : id;
  return (
    <TooltipEntity
      entityKey={entityKey}
      contentState={contentState}
      onEdit={onEdit}
      onRemove={onRemove}
      textDirectionality={textDirectionality}
      icon={DOCUMENT_ICON}
      label={label}
    >
      {children}
    </TooltipEntity>
  );
};

export default Document;
