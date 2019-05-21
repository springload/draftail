import React from "react";

import { INLINE_STYLE, BLOCK_TYPE, ENTITY_TYPE } from "../../lib";

import DocumentSource from "../sources/DocumentSource";
import LinkSource from "../sources/LinkSource";
import ImageSource from "../sources/ImageSource";
import EmbedSource from "../sources/EmbedSource";

import Link from "../entities/Link";
import Document, { DOCUMENT_ICON } from "../entities/Document";

import EmbedBlock from "../blocks/EmbedBlock";
import ImageBlock from "../blocks/ImageBlock";

import FontIcon from "../components/FontIcon";

export const EMBED_ICON = <FontIcon icon="embed" />;

export const BR_ICON =
  "M.436 633.471l296.897-296.898v241.823h616.586V94.117h109.517v593.796H297.333v242.456z";

export const INLINE_CONTROL = {
  BOLD: { type: INLINE_STYLE.BOLD, icon: "#icon-bold" },
  ITALIC: { type: INLINE_STYLE.ITALIC, icon: "#icon-italic" },
  CODE: { type: INLINE_STYLE.CODE },
  UNDERLINE: { type: INLINE_STYLE.UNDERLINE, icon: "#icon-underline" },
  STRIKETHROUGH: {
    type: INLINE_STYLE.STRIKETHROUGH,
    icon: "#icon-strikethrough",
  },
  MARK: { type: INLINE_STYLE.MARK, icon: "#icon-info" },
  QUOTATION: { type: INLINE_STYLE.QUOTATION, icon: "#icon-quotes-right" },
  SMALL: { type: INLINE_STYLE.SMALL, icon: "#icon-font-size" },
  SAMPLE: { type: INLINE_STYLE.SAMPLE, icon: "#icon-lab" },
  INSERT: { type: INLINE_STYLE.INSERT, label: "+" },
  DELETE: { type: INLINE_STYLE.DELETE, label: "-" },
  KEYBOARD: { type: INLINE_STYLE.KEYBOARD },
  SUPERSCRIPT: { type: INLINE_STYLE.SUPERSCRIPT, icon: "#icon-superscript" },
  SUBSCRIPT: { type: INLINE_STYLE.SUBSCRIPT, icon: "#icon-subscript" },
};

export const BLOCK_CONTROL = {
  UNSTYLED: { type: BLOCK_TYPE.UNSTYLED },
  HEADER_ONE: { type: BLOCK_TYPE.HEADER_ONE },
  HEADER_TWO: { type: BLOCK_TYPE.HEADER_TWO },
  HEADER_THREE: { type: BLOCK_TYPE.HEADER_THREE },
  HEADER_FOUR: { type: BLOCK_TYPE.HEADER_FOUR },
  HEADER_FIVE: { type: BLOCK_TYPE.HEADER_FIVE },
  HEADER_SIX: { type: BLOCK_TYPE.HEADER_SIX },
  UNORDERED_LIST_ITEM: {
    type: BLOCK_TYPE.UNORDERED_LIST_ITEM,
    icon: "#icon-list-ul",
  },
  ORDERED_LIST_ITEM: {
    type: BLOCK_TYPE.ORDERED_LIST_ITEM,
    icon: "#icon-list-ol",
  },
  BLOCKQUOTE: { type: BLOCK_TYPE.BLOCKQUOTE, icon: "#icon-openquote" },
  CODE: { type: BLOCK_TYPE.CODE },
};

export const ENTITY_CONTROL = {
  LINK: {
    type: ENTITY_TYPE.LINK,
    icon: "#icon-link",
    source: LinkSource,
    decorator: Link,
    attributes: ["url"],
    whitelist: {
      href: "^(?![#/])",
    },
  },
  IMAGE: {
    type: ENTITY_TYPE.IMAGE,
    description: "Image",
    icon: "#icon-image",
    source: ImageSource,
    block: ImageBlock,
    attributes: ["src", "alt"],
    whitelist: {
      src: "^(?!(data:|file:))",
    },
  },
  EMBED: {
    type: "EMBED",
    description: "Embed",
    icon: EMBED_ICON,
    source: EmbedSource,
    block: EmbedBlock,
    attributes: ["url", "title", "thumbnail", "html"],
  },

  DOCUMENT: {
    type: "DOCUMENT",
    icon: DOCUMENT_ICON,
    description: "Document",
    source: DocumentSource,
    decorator: Document,
    attributes: ["url"],
  },
};

export const TINY_TEXT_BLOCK = {
  type: "tiny-text",
  label: "Tiny",
  description: "Legal print",
  element: "blockquote",
};

export const REDACTED_STYLE = {
  type: "REDACTED",
  icon:
    "M592 448h-16v-192c0-105.87-86.13-192-192-192h-128c-105.87 0-192 86.13-192 192v192h-16c-26.4 0-48 21.6-48 48v480c0 26.4 21.6 48 48 48h544c26.4 0 48-21.6 48-48v-480c0-26.4-21.6-48-48-48zM192 256c0-35.29 28.71-64 64-64h128c35.29 0 64 28.71 64 64v192h-256v-192z",
  description: "Redacted",
  style: { backgroundColor: "currentcolor" },
};
