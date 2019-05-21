// @flow
import React from "react";
import type { Node } from "react";
import { ContentState } from "draft-js";

import TooltipEntity from "./TooltipEntity";

type Props = {|
  entityKey: string,
  contentState: ContentState,
  children: Node,
  onEdit: (string) => void,
  onRemove: (string) => void,
|};

const CUSTOM_ICON_URLS = {
  "https://www.youtube.com/": "#icon-media",
  "https://one.npr.org/": "#icon-media",
  "https://twitter.com/": "#icon-twitter",
};

const getLinkIcon = (url, linkType) => {
  const isEmailLink = linkType === "email" || url.startsWith("mailto:");

  if (isEmailLink) {
    return "#icon-mail";
  }

  const customIcon = Object.keys(CUSTOM_ICON_URLS).find((key) =>
    url.includes(key),
  );

  if (customIcon) {
    return CUSTOM_ICON_URLS[customIcon];
  }

  return "#icon-link";
};

const Link = ({
  entityKey,
  contentState,
  children,
  onEdit,
  onRemove,
}: Props) => {
  const { url, linkType } = contentState.getEntity(entityKey).getData();
  const icon = getLinkIcon(url, linkType);
  const label = url.replace(/(^\w+:|^)\/\//, "").split("/")[0];

  return (
    <TooltipEntity
      entityKey={entityKey}
      contentState={contentState}
      onEdit={onEdit}
      onRemove={onRemove}
      icon={icon}
      label={label}
    >
      {children}
    </TooltipEntity>
  );
};

export default Link;
