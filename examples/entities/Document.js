// @flow
import React from "react";
import type { Node } from "react";
import { ContentState } from "draft-js";

import FontIcon from "../components/FontIcon";
import TooltipEntity from "./TooltipEntity";

export const DOCUMENT_ICON = <FontIcon icon="document" />;

type Props = {
  entityKey: string,
  contentState: ContentState,
  children: Node,
  onEdit: (string) => void,
  onRemove: (string) => void,
};

const Document = ({
  entityKey,
  contentState,
  children,
  onEdit,
  onRemove,
}: Props) => {
  const { url, id } = contentState.getEntity(entityKey).getData();
  // Supports documents defined based on a URL, and id.
  const label = url ? url.replace(/(^\w+:|^)\/\//, "").split("/")[0] : id;
  return (
    <TooltipEntity
      entityKey={entityKey}
      contentState={contentState}
      children={children}
      onEdit={onEdit}
      onRemove={onRemove}
      icon={DOCUMENT_ICON}
      label={label}
    />
  );
};

export default Document;
