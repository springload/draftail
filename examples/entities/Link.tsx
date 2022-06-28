import React from "react";
import { EditorState, Modifier, RichUtils } from "draft-js";

import TooltipEntity from "./TooltipEntity";
import { EntityDecoratorProps, EntityTypeControl } from "../../src";

const CUSTOM_ICON_URLS = {
  "://www.youtube.com/": "#icon-media",
  "://one.npr.org/": "#icon-media",
  "://twitter.com/": "#icon-twitter",
} as const;

const getLinkIcon = (url: string, linkType: string) => {
  const isEmailLink = linkType === "email" || url.startsWith("mailto:");

  if (isEmailLink) {
    return "#icon-mail";
  }

  const customIcon = Object.entries(CUSTOM_ICON_URLS).find(([key]) =>
    url.includes(key),
  );

  return customIcon ? customIcon[1] : "#icon-link";
};

const Link = ({
  entityKey,
  contentState,
  children,
  onEdit,
  onRemove,
  textDirectionality,
}: EntityDecoratorProps) => {
  const { url, linkType } = contentState.getEntity(entityKey).getData();
  const icon = getLinkIcon(url, linkType);
  const label = url.replace(/(^\w+:|^)\/\//, "").split("/")[0];

  return (
    <TooltipEntity
      entityKey={entityKey}
      contentState={contentState}
      onEdit={onEdit}
      onRemove={onRemove}
      textDirectionality={textDirectionality}
      icon={icon}
      label={label}
    >
      {children}
    </TooltipEntity>
  );
};

/**
 * See https://docs.djangoproject.com/en/4.0/_modules/django/core/validators/#EmailValidator.
 */
const djangoUserRegex =
  /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*$|^"([\001-\010\013\014\016-\037!#-[\]-\177]|\\[\001-\011\013\014\016-\177])*"$)/i;
const djangoDomainRegex =
  /((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+)(?:[A-Z0-9-]{2,63}(?<!-))$/i;

export const getValidLinkURL = (
  text: string,
  schemes: ReadonlyArray<string>,
) => {
  if (text.includes("@")) {
    const [user, domain] = text.split("@");
    if (djangoUserRegex.test(user) && djangoDomainRegex.test(domain)) {
      return `mailto:${text}`;
    }
  }

  try {
    const url = new URL(text);

    if (schemes.includes(url.protocol)) {
      return text;
    }
  } catch (e) {
    return false;
  }

  return false;
};

interface OnPasteEntityTypeControl extends EntityTypeControl {
  schemes: ReadonlyArray<string>;
}

export const onPasteLink = (
  text: string,
  html: string | null | undefined,
  editorState: EditorState,
  {
    setEditorState,
  }: {
    setEditorState: (state: EditorState) => void;
  },
  entityType: OnPasteEntityTypeControl,
): "handled" | "not-handled" => {
  const url = getValidLinkURL(text, entityType.schemes);

  if (!url) {
    return "not-handled";
  }

  if (new URL(url).hostname === "www.youtube.com") {
    return "not-handled";
  }

  const selection = editorState.getSelection();
  let content = editorState.getCurrentContent();
  content = content.createEntity("LINK", "MUTABLE", { url });
  const entityKey = content.getLastCreatedEntityKey();
  let nextState: EditorState;

  if (selection.isCollapsed()) {
    content = Modifier.insertText(
      content,
      selection,
      text,
      undefined,
      entityKey,
    );
    nextState = EditorState.push(editorState, content, "insert-characters");
  } else {
    nextState = RichUtils.toggleLink(editorState, selection, entityKey);
  }

  setEditorState(nextState);
  return "handled";
};

export default Link;
