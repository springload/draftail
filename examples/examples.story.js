import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import createHashtagPlugin from "draft-js-hashtag-plugin";
import {
  createEditorStateFromRaw,
  serialiseEditorStateToRaw,
} from "draftjs-conductor";

import {
  INLINE_CONTROL,
  BLOCK_CONTROL,
  ENTITY_CONTROL,
  BR_ICON,
  UNDO_ICON,
  REDO_ICON,
  TINY_TEXT_BLOCK,
  REDACTED_STYLE,
} from "./constants/ui";

import linkifyPlugin from "./plugins/linkifyPlugin";
import autoEmbedPlugin from "./plugins/autoEmbedPlugin";

import EditorWrapper from "./components/EditorWrapper";
import PrismDecorator from "./components/PrismDecorator";
import ReadingTime from "./components/ReadingTime";
import customContentState from "./constants/customContentState";
import allContentState from "./constants/allContentState";
import ColorPicker, { getColorInlineStyles } from "./components/ColorPicker";

const hashtagPlugin = createHashtagPlugin();
const linkify = linkifyPlugin();
const autoEmbed = autoEmbedPlugin();

storiesOf("Examples", module)
  // Add a decorator rendering story as a component for hooks support.
  .addDecorator((Story) => <Story />)
  .add("Wagtail features", () => (
    <main>
      <p id="wagtail-editor">
        This editor demonstrates rich text features available in Wagtail.
      </p>
      <EditorWrapper
        id="wagtail"
        ariaDescribedBy="wagtail-editor"
        placeholder="Write here…"
        // Makes it easier to write automated tests retrieving the content.
        stateSaveInterval={50}
        enableHorizontalRule
        enableLineBreak
        showUndoControl
        showRedoControl
        stripPastedStyles={false}
        maxListNesting={6}
        spellCheck
        entityTypes={[
          ENTITY_CONTROL.IMAGE,
          ENTITY_CONTROL.EMBED,
          ENTITY_CONTROL.LINK,
          ENTITY_CONTROL.DOCUMENT,
        ]}
        blockTypes={[
          BLOCK_CONTROL.HEADER_TWO,
          BLOCK_CONTROL.HEADER_THREE,
          BLOCK_CONTROL.HEADER_FOUR,
          BLOCK_CONTROL.HEADER_FIVE,
          BLOCK_CONTROL.UNORDERED_LIST_ITEM,
          BLOCK_CONTROL.ORDERED_LIST_ITEM,
        ]}
        inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
      />
    </main>
  ))
  .add("Custom formats", () => {
    const [editorState, setEditorState] = useState(
      createEditorStateFromRaw(customContentState),
    );
    const [colorStyles, setColorStyles] = useState(
      getColorInlineStyles(customContentState),
    );
    const onChange = (state) => {
      const raw = serialiseEditorStateToRaw(state);
      setColorStyles(raw ? getColorInlineStyles(raw) : []);
      setEditorState(state);
    };

    return (
      <EditorWrapper
        id="custom"
        ariaDescribedBy="custom-editor"
        editorState={editorState}
        onChange={onChange}
        stripPastedStyles={false}
        spellCheck
        blockTypes={[
          BLOCK_CONTROL.HEADER_TWO,
          BLOCK_CONTROL.CODE,
          TINY_TEXT_BLOCK,
        ]}
        inlineStyles={[
          Object.assign(
            {
              style: {
                fontWeight: "bold",
                textShadow: "1px 1px 1px black",
              },
            },
            INLINE_CONTROL.BOLD,
          ),
          REDACTED_STYLE,
          ...colorStyles.map((s) => ({
            type: s,
            style: {
              color: s.replace("COLOR_", "#"),
            },
          })),
        ]}
        entityTypes={[ENTITY_CONTROL.EMBED, ENTITY_CONTROL.DOCUMENT]}
        decorators={[new PrismDecorator({ defaultLanguage: "css" })]}
        controls={[ReadingTime, ColorPicker]}
        plugins={[hashtagPlugin]}
      />
    );
  })
  .add("All built-in formats", () => (
    <EditorWrapper
      id="all"
      ariaDescribedBy="all-editor"
      rawContentState={allContentState}
      stripPastedStyles={false}
      enableHorizontalRule={{
        description: "Horizontal rule",
      }}
      enableLineBreak={{
        description: "Soft line break",
        icon: BR_ICON,
      }}
      showUndoControl={{
        description: "Undo last change",
        icon: UNDO_ICON,
      }}
      showRedoControl={{
        description: "Redo last change",
        icon: REDO_ICON,
      }}
      maxListNesting={6}
      blockTypes={Object.values(BLOCK_CONTROL)}
      inlineStyles={Object.values(INLINE_CONTROL)}
      entityTypes={[ENTITY_CONTROL.IMAGE, ENTITY_CONTROL.LINK]}
    />
  ))
  .add("Content awareness", () => (
    <EditorWrapper
      id="content-awareness"
      stripPastedStyles={false}
      rawContentState={{
        entityMap: {},
        blocks: [
          {
            key: "aaa",
            text: "Paste YouTube or Twitter links! Instantly create links on text, and insert embed blocks",
          },
        ],
      }}
      inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
      blockTypes={[
        BLOCK_CONTROL.HEADER_TWO,
        BLOCK_CONTROL.UNORDERED_LIST_ITEM,
        BLOCK_CONTROL.BLOCKQUOTE,
      ]}
      entityTypes={[ENTITY_CONTROL.LINK, ENTITY_CONTROL.EMBED]}
      enableHorizontalRule
      plugins={[autoEmbed, linkify]}
    />
  ));
