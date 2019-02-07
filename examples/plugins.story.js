import { storiesOf } from "@storybook/react";
import React from "react";

import { INLINE_CONTROL, ENTITY_CONTROL, BLOCK_CONTROL } from "./constants/ui";

import EditorWrapper from "./components/EditorWrapper";
import singleLinePlugin from "./plugins/singleLinePlugin";
import linkifyPlugin from "./plugins/linkifyPlugin";
import actionBlockPlugin from "./plugins/actionBlockPlugin";
import slashCommandPlugin from "./plugins/slashCommandPlugin";

const singleLine = singleLinePlugin();
const linkify = linkifyPlugin();
const actionBlock = actionBlockPlugin();
const slashCommand = slashCommandPlugin();

storiesOf("Plugins", module)
  .add("Single-line", () => (
    <EditorWrapper
      id="single-line"
      inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
      entityTypes={[ENTITY_CONTROL.LINK]}
      enableLineBreak
      plugins={[singleLine]}
    />
  ))
  .add("Linkify", () => (
    <EditorWrapper
      id="linkify"
      rawContentState={{
        entityMap: {},
        blocks: [
          {
            key: "aaa",
            text: "Paste a URL onto the text to directly create a link!",
          },
        ],
      }}
      inlineStyles={[INLINE_CONTROL.BOLD]}
      blockTypes={[BLOCK_CONTROL.UNORDERED_LIST_ITEM]}
      entityTypes={[ENTITY_CONTROL.LINK]}
      plugins={[linkify]}
    />
  ))
  .add("Actions", () => (
    <EditorWrapper
      id="actions"
      rawContentState={{
        entityMap: {},
        blocks: [
          {
            key: "aaa",
            text:
              "This editor supports action lists. Start one with - [] at the start of a line.",
            inlineStyleRanges: [
              {
                offset: 50,
                length: 4,
                style: "CODE",
              },
            ],
          },
        ],
      }}
      inlineStyles={[INLINE_CONTROL.CODE]}
      blockTypes={[
        BLOCK_CONTROL.UNORDERED_LIST_ITEM,
        {
          type: "action-list-item",
          label: "✔",
          description: "Action list",
        },
      ]}
      entityTypes={[ENTITY_CONTROL.LINK]}
      plugins={[linkify, actionBlock]}
    />
  ))
  .add("Slash (/) commands", () => (
    <EditorWrapper
      id="slash-commands"
      rawContentState={{
        entityMap: {},
        blocks: [
          {
            key: "aaa",
            text:
              "This editor supports two commands: /hr, and /embed <url>. Then press Enter.",
            inlineStyleRanges: [
              {
                offset: 35,
                length: 3,
                style: "CODE",
              },
              {
                offset: 44,
                length: 12,
                style: "CODE",
              },
              {
                offset: 69,
                length: 5,
                style: "KEYBOARD",
              },
            ],
          },
        ],
      }}
      enableHorizontalRule
      inlineStyles={[INLINE_CONTROL.CODE, INLINE_CONTROL.KEYBOARD]}
      blockTypes={[BLOCK_CONTROL.UNORDERED_LIST_ITEM]}
      entityTypes={[ENTITY_CONTROL.LINK, ENTITY_CONTROL.EMBED]}
      plugins={[slashCommand]}
    />
  ));
