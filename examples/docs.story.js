import { storiesOf } from "@storybook/react";
import React from "react";
import { injectIntl } from "react-intl";

import { INLINE_STYLE } from "../lib";

import {
  INLINE_CONTROL,
  BLOCK_CONTROL,
  ENTITY_CONTROL,
  REDACTED_STYLE,
  BR_ICON,
} from "./constants/ui";

import EditorWrapper from "./components/EditorWrapper";
import PrismDecorator from "./components/PrismDecorator";
import ReadingTime from "./components/ReadingTime";

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
  ))
  .add("Decorators", () => (
    <EditorWrapper
      id="docs-decorators"
      rawContentState={{
        blocks: [
          {
            text: "Sometimes #hashtags are useful.",
          },
          {
            text: "console.log('Hello, World!');",
            type: "code-block",
          },
        ],
        entityMap: {},
      }}
      stripPastedStyles={false}
      blockTypes={[BLOCK_CONTROL.CODE]}
      decorators={[
        {
          strategy: (block, callback) => {
            const text = block.getText();
            let matches;
            // eslint-disable-next-line no-cond-assign
            while ((matches = /#[\w]+/g.exec(text)) !== null) {
              callback(matches.index, matches.index + matches[0].length);
            }
          },
          // eslint-disable-next-line @thibaudcolas/cookbook/react/prop-types
          component: ({ children }) => (
            <span style={{ color: "#007d7e" }}>{children}</span>
          ),
        },
        new PrismDecorator({ defaultLanguage: "javascript" }),
      ]}
    />
  ))
  .add("Controls", () => (
    <EditorWrapper
      id="docs-controls"
      rawContentState={{
        blocks: [
          {
            text: "Sometimes #hashtags are useful.",
          },
          {
            text: "console.log('Hello, World!');",
            type: "code-block",
          },
        ],
        entityMap: {},
      }}
      stripPastedStyles={false}
      controls={[ReadingTime]}
    />
  ))
  .add("UI theming", () => (
    <div className="docs-ui-theming">
      <EditorWrapper
        id="docs-ui-theming"
        rawContentState={{
          blocks: [
            {
              text: "Focus mode editor!",
              type: "blockquote",
            },
          ],
          entityMap: {},
        }}
        stripPastedStyles={false}
        blockTypes={[
          BLOCK_CONTROL.BLOCKQUOTE,
          BLOCK_CONTROL.UNORDERED_LIST_ITEM,
        ]}
      />
    </div>
  ))
  .add("Icons", () => (
    <EditorWrapper
      id="docs-icons"
      rawContentState={{
        blocks: [
          {
            text:
              "Icons can recycle Unicode characters, use SVG, or custom implementations.",
          },
        ],
        entityMap: {},
      }}
      enableLineBreak={{ icon: BR_ICON }}
      stripPastedStyles={false}
      inlineStyles={[
        INLINE_CONTROL.BOLD,
        INLINE_CONTROL.KEYBOARD,
        REDACTED_STYLE,
      ]}
      entityTypes={[ENTITY_CONTROL.EMBED]}
    />
  ))
  .add("i18n", () => {
    const WithIntl = injectIntl(({ intl }) => (
      <EditorWrapper
        id="docs-i18n"
        rawContentState={{
          blocks: [
            {
              text:
                "All of the text displayed in the Draftail UI is translateable",
            },
          ],
          entityMap: {},
        }}
        enableLineBreak={{
          icon: BR_ICON,
          description: intl.formatMessage({ id: "Line break" }),
        }}
        stripPastedStyles={false}
        inlineStyles={[
          {
            type: INLINE_STYLE.BOLD,
            label: intl.formatMessage({ id: "Bold" }),
          },
          {
            type: INLINE_STYLE.KEYBOARD,
            label: intl.formatMessage({ id: "Shortcut" }),
          },
        ]}
        entityTypes={[
          Object.assign({}, ENTITY_CONTROL.LINK, {
            description: intl.formatMessage({ id: "Link" }),
          }),
        ]}
      />
    ));

    return <WithIntl />;
  });
