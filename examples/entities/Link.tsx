import React from "react";
import type { Node } from "react";
import { EditorState, ContentState, Modifier, RichUtils } from "draft-js";
import TooltipEntity from "./TooltipEntity";
type Props = {
  entityKey: string;
  contentState: ContentState;
  children: Node;
  onEdit: (arg0: string) => void;
  onRemove: (arg0: string) => void;
  textDirectionality: "LTR" | "RTL";
};
const CUSTOM_ICON_URLS = {
  "://www.youtube.com/": "#icon-media",
  "://one.npr.org/": "#icon-media",
  "://twitter.com/": "#icon-twitter",
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
  textDirectionality,
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
const djangoUserRegex = /(^[-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*$|^"([\001-\010\013\014\016-\037!#-[\]-\177]|\\[\001-\011\013\014\016-\177])*"$)/i;
const djangoDomainRegex = /((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+)(?:[A-Z0-9-]{2,63}(?<!-))$/i;
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
    // eslint-disable-next-line compat/compat
    const url = new URL(text);

    if (schemes.includes(url.protocol)) {
      return text;
    }
  } catch (e) {
    return false;
  }

  return false;
};
export const onPasteLink = (
  text: string,
  html: string | null | undefined,
  editorState: EditorState,
  {
    setEditorState,
  }: {
    setEditorState: (arg0: EditorState) => void;
  },
  entityType: {
    schemes: ReadonlyArray<string>;
  },
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
  content = content.createEntity("LINK", "MUTABLE", {
    url,
  });
  const entityKey = content.getLastCreatedEntityKey();
  let nextState: EditorState;

  if (selection.isCollapsed()) {
    content = Modifier.insertText(content, selection, text, null, entityKey);
    nextState = EditorState.push(editorState, content, "insert-characters");
  } else {
    nextState = RichUtils.toggleLink(editorState, selection, entityKey);
  }

  setEditorState(nextState);
  return "handled";
};
export default Link;