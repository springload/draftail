// @flow
import React from "react";
import type { Node } from "react";
import { ContentState } from "draft-js";

import TooltipEntity from "./TooltipEntity";

type Props = {
  entityKey: string,
  contentState: ContentState,
  children: Node,
  onEdit: (string) => void,
  onRemove: (string) => void,
};

const Link = ({
  entityKey,
  contentState,
  children,
  onEdit,
  onRemove,
}: Props) => {
  const { url, linkType } = contentState.getEntity(entityKey).getData();
  const isEmailLink = linkType === "email" || url.startsWith("mailto:");
  const icon = `#icon-${isEmailLink ? "mail" : "link"}`;
  const label = url.replace(/(^\w+:|^)\/\//, "").split("/")[0];

  return (
    <TooltipEntity
      entityKey={entityKey}
      contentState={contentState}
      children={children}
      onEdit={onEdit}
      onRemove={onRemove}
      icon={icon}
      label={label}
    />
  );
};

export default Link;
