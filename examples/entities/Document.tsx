import React from "react";
import type { Node } from "react";
import { ContentState } from "draft-js";

import FontIcon from "../components/FontIcon";
import TooltipEntity from "./TooltipEntity";

export const DOCUMENT_ICON = <FontIcon icon="document" />;

type Props = {
  entityKey: string;
  contentState: ContentState;
  children: Node;
  onEdit: (entityType: string) => void;
  onRemove: (entityType: string) => void;
  textDirectionality: "LTR" | "RTL";
};

const Document = ({
  entityKey,
  contentState,
  children,
  onEdit,
  onRemove,
  textDirectionality,
}: Props) => {
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
