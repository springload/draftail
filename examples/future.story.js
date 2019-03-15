import { storiesOf } from "@storybook/react";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import { composeDecorators } from "draft-js-plugins-editor";
import createInlineToolbarPlugin from "draft-js-inline-toolbar-plugin";
import createSideToolbarPlugin from "draft-js-side-toolbar-plugin";
import createEmojiPlugin from "draft-js-emoji-plugin";
import { StreamField, streamFieldReducer } from "react-streamfield";
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
import createFocusPlugin from "./plugins/draft-js-focus-plugin/index";

const store = createStore(streamFieldReducer, applyMiddleware(thunk));

const singleLine = singleLinePlugin();
const linkify = linkifyPlugin();
const actionBlock = actionBlockPlugin();
const slashCommand = slashCommandPlugin();
const focusPlugin = createFocusPlugin({ focusableBlocks: ["section-break"] });
const sectionBreak = sectionBreakPlugin({
  decorator: composeDecorators(focusPlugin.decorator),
});

storiesOf("Future", module)
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
  .add("Single-line", () => (
    <EditorWrapper
      id="single-line"
      inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
      entityTypes={[ENTITY_CONTROL.LINK]}
      enableLineBreak
      plugins={[singleLine, linkify]}
    />
  ))
  .add("Markdown shortcuts", () => (
    <EditorWrapper
      id="single-line"
      inlineStyles={[
        INLINE_CONTROL.BOLD,
        INLINE_CONTROL.ITALIC,
        INLINE_CONTROL.STRIKETHROUGH,
        INLINE_CONTROL.CODE,
      ]}
      blockTypes={[
        BLOCK_CONTROL.HEADER_THREE,
        BLOCK_CONTROL.HEADER_FOUR,
        BLOCK_CONTROL.UNORDERED_LIST_ITEM,
        BLOCK_CONTROL.ORDERED_LIST_ITEM,
      ]}
      enableHorizontalRule
    />
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
                  "Cool, we can have all sorts of Emojis here. 🙌 🌿☃️🎉🙈 aaaand maybe a few more here 🐲☀️🗻 Quite fun!",
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

storiesOf("Future", module).add("Emoji", () => <EmojiStory />);

storiesOf("Future", module)
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

// eslint-disable-next-line
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

window.initDemoEditor = (id) => {
  const field = document.querySelector(`[id="${id}"]`);
  field.name = id;

  const editorWrapper = document.createElement("div");
  editorWrapper.className = "Draftail-Editor__wrapper";
  editorWrapper.setAttribute("data-draftail-editor-wrapper", true);

  field.parentNode.appendChild(editorWrapper);

  const editor = (
    <DraftailEditor
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
  );

  ReactDOM.render(editor, editorWrapper);
};

storiesOf("Future", module).add("Custom toolbars", () => (
  <CustomToolbarStory />
));

storiesOf("Future", module)
  .addDecorator((story) => <Provider store={store}>{story()}</Provider>)
  .add("With StreamField", () => {
    const props = {
      required: true,
      blockDefinitions: [
        {
          key: "title",
          layout: "SIMPLE",
          icon: '<i class="fas fa-heading fa-fw"></i>',
          className: "full title",
          html: '<input type="text" name="field-__ID__" />',
        },
        {
          key: "text",
          icon: '<i class="fas fa-align-justify fa-fw"></i>',
          className: "full",
          html: '<textarea name="field-__ID__"></textarea>',
        },
        {
          key: "static",
          layout: "SIMPLE",
          isStatic: true,
          html: "Some static block",
        },
        {
          key: "rich-text",
          layout: "SIMPLE",
          dangerouslyRunInnerScripts: true,
          html: `<div><input type="hidden" name="field-__ID__" id="field-__ID__" /><script>window.initDemoEditor('field-__ID__');</script></div>`,
        },
      ],
      value: [
        { type: "title", value: "Wagtail is awesome!" },
        { type: "text", value: "And it’s always getting better 😃" },
        { type: "static" },
      ],
    };
    return <StreamField {...props} id="stream" />;
  });
