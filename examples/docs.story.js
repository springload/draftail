import { storiesOf } from "@storybook/react";
import React from "react";

import {
  INLINE_CONTROL,
  BLOCK_CONTROL,
  ENTITY_CONTROL,
  REDACTED_STYLE,
} from "./constants/ui";

import EditorWrapper from "./components/EditorWrapper";
import { INLINE_STYLE } from "../lib";

storiesOf("Docs", module)
  .add("Built-in formats", () => (
    <EditorWrapper
      id="docs-built-in-formats"
      stripPastedStyles={false}
      enableHorizontalRule
      enableLineBreak
      showUndoControl
      showRedoControl
      maxListNesting={6}
      blockTypes={Object.values(BLOCK_CONTROL)}
      inlineStyles={Object.values(INLINE_CONTROL)}
    />
  ))
  .add("Inline styles", () => (
    <EditorWrapper
      id="docs-inline-styles"
      rawContentState={{
        blocks: [
          {
            text: "This is redacted, and this is very bold.",
            inlineStyleRanges: [
              {
                offset: 8,
                length: 8,
                style: "REDACTED",
              },
              {
                offset: 30,
                length: 9,
                style: "BOLD",
              },
            ],
          },
        ],
        entityMap: {},
      }}
      stripPastedStyles={false}
      inlineStyles={[
        REDACTED_STYLE,
        {
          label: "Bold",
          type: INLINE_STYLE.BOLD,
          style: {
            fontWeight: "bold",
            textShadow: "1px 1px 1px black",
          },
        },
      ]}
    />
  ))
  .add("Blocks", () => (
    <EditorWrapper
      id="docs-blocks"
      rawContentState={{
        blocks: [
          {
            text: "This is blockquote",
            type: "blockquote",
          },
          {
            text: "This is tiny text",
            type: "tiny-text",
          },
        ],
        entityMap: {},
      }}
      stripPastedStyles={false}
      blockTypes={[
        BLOCK_CONTROL.BLOCKQUOTE,
        {
          type: "tiny-text",
          label: "Tiny",
        },
      ]}
    />
  ))
  .add("Entities", () => (
    <EditorWrapper
      id="docs-entities"
      rawContentState={{
        blocks: [
          {
            text: "Here's an image, and a link:",
            entityRanges: [
              {
                offset: 23,
                length: 4,
                key: 0,
              },
            ],
          },
          {
            text: " ",
            type: "atomic",
            entityRanges: [
              {
                offset: 0,
                length: 1,
                key: 1,
              },
            ],
          },
          {
            text: "",
          },
        ],
        entityMap: {
          "0": {
            type: "LINK",
            data: {
              url: "https://www.example.com/",
            },
          },
          "1": {
            type: "IMAGE",
            data: {
              src: "/static/example-lowres-image.jpg",
              alt: "",
            },
          },
        },
      }}
      stripPastedStyles={false}
      entityTypes={[ENTITY_CONTROL.LINK, ENTITY_CONTROL.IMAGE]}
    />
  ));
