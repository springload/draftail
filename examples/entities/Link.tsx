import React from "react";
import {
  convertFromHTML,
  EditorState,
  Modifier,
  RichUtils,
  BlockMapBuilder,
  ContentState,
  CharacterMetadata,
  convertToRaw,
  ContentBlock,
  Editor,
} from "draft-js";

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
// Compared to Django, changed to remove start and end of string checks.
const djangoUser =
  /([-!#$%&'*+/=?^_`{}|~0-9A-Z]+(\.[-!#$%&'*+/=?^_`{}|~0-9A-Z]+)*|"([\001-\010\013\014\016-\037!#-[\]-\177]|\\[\001-\011\013\014\016-\177])*")/i;
// Compared to Django, changed to remove the end-of-domain `-` check that was done with a negative lookbehind `(?<!-)` (unsupported in Safari), and disallow all TLD hyphens instead.
// const djangoDomain = /((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+)(?:[A-Z0-9-]{2,63}(?<!-))$/i;
const djangoDomain =
  /((?:[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?\.)+)(?:[A-Z0-9]{2,63})/i;

const djangoEmail = new RegExp(
  `^${djangoUser.source}@${djangoDomain.source}$`,
  "i",
);

export const getValidLinkURL = (
  text: string,
  schemes: ReadonlyArray<string>,
) => {
  if (djangoEmail.test(text)) {
    return `mailto:${text}`;
  }

  // If there is whitespace, treat text as not a URL.
  // Prevents scenarios like `URL.parse('https://test.t/ http://a.b/')`.
  if (/\s/.test(text)) {
    return false;
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

const urlPattern = /(?:http|ftp)s?:\/\/[^\s]+/;

const linkPatternSource = `(\\s|^)(${urlPattern.source}|${djangoUser.source}@${djangoDomain.source})(\\s|$)`;

export const hasLinkPattern = (text: string) => {
  const pattern = new RegExp(linkPatternSource, "ig");
  return pattern.test(text);
};

interface OnPasteEntityTypeControl extends EntityTypeControl {
  schemes?: ReadonlyArray<string>;
}

const insertSingleLink = (
  editorState: EditorState,
  text: string,
  url: string,
) => {
  const selection = editorState.getSelection();
  let content = editorState.getCurrentContent();
  content = content.createEntity("LINK", "MUTABLE", { url });
  const entityKey = content.getLastCreatedEntityKey();

  // Insert as visible text, with link created on top.
  if (selection.isCollapsed()) {
    content = Modifier.insertText(
      content,
      selection,
      text,
      undefined,
      entityKey,
    );
    return EditorState.push(editorState, content, "insert-characters");
  }

  return RichUtils.toggleLink(editorState, selection, entityKey);
};

const insertLinkedContent = (
  entityType: OnPasteEntityTypeControl,
  editorState: EditorState,
  html: string,
) => {
  const { contentBlocks, entityMap } = convertFromHTML(html || "");
  const blockMap = ContentState.createFromBlockArray(
    contentBlocks,
    entityMap,
  ).getBlockMap();

  const selection = editorState.getSelection();
  let content = editorState.getCurrentContent();

  const blocks = blockMap.map((block) => {
    const blockText = block!.getText();
    const pattern = new RegExp(linkPattern.source, "ig");
    // Get a list of matches, each with start and end position in the block, and match text.
    const matches = Array.from(blockText.matchAll(pattern), (match) => ({
      // Adjust for potential leading whitespace
      start: match.index + match[1].length,
      end: match.index + match[1].length + match[2].length,
      url: getValidLinkURL(match[2], entityType.schemes || []),
      entityKey: "",
    }));
    matches.forEach((match) => {
      if (!match.url) {
        return;
      }

      content = content.createEntity("LINK", "MUTABLE", { url: match.url });
      match.entityKey = content.getLastCreatedEntityKey();
    });

    const chars = block!.getCharacterList().map((char, i) => {
      const offset = i as number;
      // If the char is within a match, apply the entity.
      const match = matches.find(
        ({ url, start, end }) => url && offset >= start && offset < end,
      );
      if (match) {
        console.log(match);
        return CharacterMetadata.applyEntity(
          char as CharacterMetadata,
          match.entityKey,
        );
      }
      return char;
    });

    return block!.set("characterList", chars) as ContentBlock;
  });

  content = Modifier.replaceWithFragment(
    content,
    selection,
    blockMap.merge(blocks),
  );
  return EditorState.push(editorState, content, "insert-characters");
};

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
  const singleURL = getValidLinkURL(text, entityType.schemes || []);

  if (singleURL) {
    // Defer to another paste handler.
    if (new URL(singleURL).hostname === "www.youtube.com") {
      return "not-handled";
    }

    setEditorState(insertSingleLink(editorState, text, singleURL));
    return "handled";
  }

  if (hasLinkPattern(text)) {
    // Prefer the multi-line HTML clipboard data if present.
    setEditorState(insertLinkedContent(entityType, editorState, html || text));
    return "handled";
  }

  return "not-handled";
};

export default Link;
