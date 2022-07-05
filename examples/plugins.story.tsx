import { storiesOf } from "@storybook/react";
import React, { Component } from "react";
import { RawDraftContentState } from "draft-js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { composeDecorators } from "draft-js-plugins-editor";
import createEmojiPlugin from "draft-js-emoji-plugin";

import { INLINE_CONTROL, ENTITY_CONTROL, BLOCK_CONTROL } from "./constants/ui";

import EditorWrapper from "./components/EditorWrapper";
import linkifyPlugin from "./plugins/linkifyPlugin";
import actionBlockPlugin from "./plugins/actionBlockPlugin";
import sectionBreakPlugin, {
  SectionBreakControl,
} from "./plugins/sectionBreakPlugin";
import autoEmbedPlugin from "./plugins/autoEmbedPlugin";
import createFocusPlugin from "./plugins/draft-js-focus-plugin/index";

const linkify = linkifyPlugin();
const autoEmbed = autoEmbedPlugin();
const actionBlock = actionBlockPlugin();
const focusPlugin = createFocusPlugin({ focusableBlocks: ["section-break"] });
const sectionBreak = sectionBreakPlugin({
  decorator: composeDecorators(focusPlugin.decorator),
});

storiesOf("Plugins", module)
  .add("Linkify", () => (
    <EditorWrapper
      id="linkify"
      rawContentState={
        {
          entityMap: {},
          blocks: [
            {
              key: "aaa",
              text: "Paste a URL onto the text to directly create a link!",
            },
          ],
        } as RawDraftContentState
      }
      stripPastedStyles={false}
      inlineStyles={[INLINE_CONTROL.BOLD]}
      blockTypes={[BLOCK_CONTROL.UNORDERED_LIST_ITEM]}
      entityTypes={[ENTITY_CONTROL.LINK]}
      plugins={[linkify]}
    />
  ))
  .add("Auto-embed", () => (
    <EditorWrapper
      id="auto-embed"
      rawContentState={
        {
          blocks: [
            {
              key: "aaa",
              text: "Paste a YouTube or Twitter link to automatically create an embed.",
              type: "unstyled",
              depth: 0,
              inlineStyleRanges: [],
              entityRanges: [
                {
                  offset: 8,
                  length: 7,
                  key: 0,
                },
                {
                  offset: 19,
                  length: 7,
                  key: 1,
                },
              ],
            },
          ],
          entityMap: {
            0: {
              type: "LINK",
              mutability: "MUTABLE",
              data: {
                url: "https://www.youtube.com/watch?v=Bh37b81GtuY",
              },
            },
            1: {
              type: "LINK",
              mutability: "MUTABLE",
              data: {
                url: "https://twitter.com/stownpodcast/status/981226459124641792",
              },
            },
          },
        } as RawDraftContentState
      }
      stripPastedStyles={false}
      inlineStyles={[INLINE_CONTROL.BOLD]}
      blockTypes={[BLOCK_CONTROL.UNORDERED_LIST_ITEM]}
      entityTypes={[ENTITY_CONTROL.LINK, ENTITY_CONTROL.EMBED]}
      plugins={[autoEmbed, linkify]}
    />
  ))
  .add("Actions", () => (
    <EditorWrapper
      id="actions"
      rawContentState={
        {
          entityMap: {},
          blocks: [
            {
              key: "aaa",
              text: "This editor supports action lists. Start one with - [] at the start of a line.",
              inlineStyleRanges: [
                {
                  offset: 50,
                  length: 4,
                  style: "CODE",
                },
              ],
            },
          ],
        } as RawDraftContentState
      }
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
  .add("Section break", () => (
    <EditorWrapper
      id="section-break"
      inlineStyles={[INLINE_CONTROL.BOLD]}
      blockTypes={[
        BLOCK_CONTROL.UNORDERED_LIST_ITEM,
        {
          type: "section-break",
        },
      ]}
      controls={[
        {
          block: SectionBreakControl,
        },
      ]}
      plugins={[focusPlugin, sectionBreak]}
    />
  ));

class EmojiStory extends Component<
  Record<string, never>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  { emojiPlugin: any }
> {
  constructor(props: Record<string, never>) {
    super(props);

    const emojiPlugin = createEmojiPlugin();

    this.state = {
      emojiPlugin,
    };
  }

  render() {
    const { emojiPlugin } = this.state;
    const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

    return (
      <div className="emoji-plugins">
        <EditorWrapper
          id="emoji-plugins"
          rawContentState={
            {
              entityMap: {},
              blocks: [
                {
                  text: "We can have all sorts of Emojis here! 🙌 🌿☃️🎉🙈 aaaand maybe a few more there 🐲☀️🗻 Quite fun!",
                },
              ],
            } as RawDraftContentState
          }
          inlineStyles={[
            INLINE_CONTROL.BOLD,
            INLINE_CONTROL.ITALIC,
            INLINE_CONTROL.CODE,
          ]}
          blockTypes={[
            BLOCK_CONTROL.HEADER_ONE,
            BLOCK_CONTROL.HEADER_TWO,
            BLOCK_CONTROL.BLOCKQUOTE,
            BLOCK_CONTROL.UNORDERED_LIST_ITEM,
          ]}
          plugins={[emojiPlugin]}
          controls={[
            {
              type: "emoji",
              // eslint-disable-next-line react/no-unstable-nested-components
              block: () => (
                <>
                  <EmojiSuggestions />
                  <EmojiSelect />
                </>
              ),
            },
          ]}
        />
      </div>
    );
  }
}

storiesOf("Plugins", module).add("Emoji", () => <EmojiStory />);
