import { storiesOf } from "@storybook/react";
import React, { Component } from "react";
import { composeDecorators } from "draft-js-plugins-editor";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createSideToolbarPlugin from "draft-js-side-toolbar-plugin";
import createEmojiPlugin from "draft-js-emoji-plugin";

import { DraftailEditor } from "../lib";

import { INLINE_CONTROL, ENTITY_CONTROL, BLOCK_CONTROL } from "./constants/ui";

import EditorWrapper from "./components/EditorWrapper";
import singleLinePlugin from "./plugins/singleLinePlugin";
import linkifyPlugin from "./plugins/linkifyPlugin";
import actionBlockPlugin from "./plugins/actionBlockPlugin";
import slashCommandPlugin from "./plugins/slashCommandPlugin";
import sectionBreakPlugin, {
  SectionBreakControl,
} from "./plugins/sectionBreakPlugin";
import autoEmbedPlugin from "./plugins/autoEmbedPlugin";
import createFocusPlugin from "./plugins/draft-js-focus-plugin/index";

const singleLine = singleLinePlugin();
const linkify = linkifyPlugin();
const autoEmbed = autoEmbedPlugin();
const actionBlock = actionBlockPlugin();
const slashCommand = slashCommandPlugin();
const focusPlugin = createFocusPlugin({ focusableBlocks: ["section-break"] });
const sectionBreak = sectionBreakPlugin({
  decorator: composeDecorators(focusPlugin.decorator),
});

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
      rawContentState={{
        blocks: [
          {
            key: "aaa",
            text:
              "Paste a YouTube or Twitter link to automatically create an embed.",
            type: "unstyled",
            depth: 0,
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
          "0": {
            type: "LINK",
            data: {
              url: "https://www.youtube.com/watch?v=Bh37b81GtuY",
            },
          },
          "1": {
            type: "LINK",
            data: {
              url: "https://twitter.com/stownpodcast/status/981226459124641792",
            },
          },
        },
      }}
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
      controls={[SectionBreakControl]}
      plugins={[focusPlugin, sectionBreak]}
    />
  ));

class CustomToolbarStory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inlineToolbarPlugin: createInlineToolbarPlugin(),
      sideToolbarPlugin: createSideToolbarPlugin(),
    };
  }

  render() {
    const { inlineToolbarPlugin, sideToolbarPlugin } = this.state;
    const { InlineToolbar } = inlineToolbarPlugin;
    const { SideToolbar } = sideToolbarPlugin;

    return (
      <div className="custom-toolbar-plugins">
        <DraftailEditor
          id="custom-toolbar-plugins"
          rawContentState={{
            entityMap: {},
            blocks: [
              {
                text:
                  "This editor uses inline and side toolbars from the draft-js-plugins ecosystem",
              },
            ],
          }}
          inlineStyles={[
            INLINE_CONTROL.BOLD,
            INLINE_CONTROL.ITALIC,
            INLINE_CONTROL.UNDERLINE,
            INLINE_CONTROL.CODE,
          ]}
          blockTypes={[
            BLOCK_CONTROL.HEADER_ONE,
            BLOCK_CONTROL.HEADER_TWO,
            BLOCK_CONTROL.BLOCKQUOTE,
            BLOCK_CONTROL.CODE,
            BLOCK_CONTROL.UNORDERED_LIST_ITEM,
            BLOCK_CONTROL.ORDERED_LIST_ITEM,
          ]}
          plugins={[inlineToolbarPlugin, sideToolbarPlugin]}
          topToolbar={null}
          bottomToolbar={(props) => (
            <>
              <SideToolbar {...props} />
              <InlineToolbar {...props} />
            </>
          )}
        />
      </div>
    );
  }
}

storiesOf("Plugins", module).add("Custom toolbars", () => (
  <CustomToolbarStory />
));

// eslint-disable-next-line
class EmojiStory extends Component {
  constructor(props) {
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
        <DraftailEditor
          id="emoji-plugins"
          rawContentState={{
            entityMap: {},
            blocks: [
              {
                text:
                  "We can have all sorts of Emojis here! 🙌 🌿☃️🎉🙈 aaaand maybe a few more there 🐲☀️🗻 Quite fun!",
              },
            ],
          }}
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
            () => (
              <>
                <EmojiSuggestions />
                <EmojiSelect />
              </>
            ),
          ]}
        />
      </div>
    );
  }
}

storiesOf("Plugins", module).add("Emoji", () => <EmojiStory />);
