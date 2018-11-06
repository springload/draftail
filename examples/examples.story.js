import { storiesOf } from "@storybook/react";
import React from "react";

import {
  INLINE_CONTROL,
  BLOCK_CONTROL,
  ENTITY_CONTROL,
  BR_ICON,
  TINY_TEXT_BLOCK,
  REDACTED_STYLE,
} from "./constants/ui";

import EditorWrapper from "./components/EditorWrapper";
import PrismDecorator from "./components/PrismDecorator";
import ReadingTime from "./components/ReadingTime";
import customContentState from "./constants/customContentState";
import allContentState from "./constants/allContentState";

storiesOf("Examples", module)
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
  .add("Custom formats", () => (
    <EditorWrapper
      id="custom"
      ariaDescribedBy="custom-editor"
      rawContentState={customContentState}
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
      ]}
      entityTypes={[ENTITY_CONTROL.EMBED, ENTITY_CONTROL.DOCUMENT]}
      decorators={[new PrismDecorator({ defaultLanguage: "css" })]}
      controls={[ReadingTime]}
    />
  ))
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
      }}
      showRedoControl={{
        description: "Redo last change",
      }}
      maxListNesting={6}
      blockTypes={Object.values(BLOCK_CONTROL)}
      inlineStyles={Object.values(INLINE_CONTROL)}
      entityTypes={[ENTITY_CONTROL.IMAGE, ENTITY_CONTROL.LINK]}
    />
  ))
  .add("Test", () => (
    <div>
      <h2>Test editor</h2>
      <div className="example">
        <h3 id="test:1-editor">Keep everything</h3>
        <EditorWrapper
          id="test:1"
          ariaDescribedBy="test:1-editor"
          enableHorizontalRule
          enableLineBreak
          stripPastedStyles={false}
          entityTypes={[
            ENTITY_CONTROL.IMAGE,
            ENTITY_CONTROL.EMBED,
            ENTITY_CONTROL.LINK,
          ]}
          blockTypes={[
            BLOCK_CONTROL.HEADER_TWO,
            BLOCK_CONTROL.HEADER_THREE,
            BLOCK_CONTROL.HEADER_FOUR,
            BLOCK_CONTROL.HEADER_FIVE,
            BLOCK_CONTROL.BLOCKQUOTE,
            BLOCK_CONTROL.UNORDERED_LIST_ITEM,
            BLOCK_CONTROL.ORDERED_LIST_ITEM,
            TINY_TEXT_BLOCK,
          ]}
          inlineStyles={[
            INLINE_CONTROL.BOLD,
            INLINE_CONTROL.ITALIC,
            REDACTED_STYLE,
          ]}
        />
      </div>
      <div className="example">
        <h3 id="test:2-editor">Keep everything, with less enabled formats</h3>
        <EditorWrapper
          id="test:2"
          ariaDescribedBy="test:2-editor"
          enableHorizontalRule
          enableLineBreak
          stripPastedStyles={false}
          entityTypes={[ENTITY_CONTROL.IMAGE, ENTITY_CONTROL.LINK]}
          blockTypes={[
            BLOCK_CONTROL.HEADER_FOUR,
            BLOCK_CONTROL.UNORDERED_LIST_ITEM,
          ]}
          inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
        />
      </div>
      <div className="example">
        <h3 id="test:3-editor">Keep basic styles</h3>
        <EditorWrapper
          id="test:3"
          ariaDescribedBy="test:3-editor"
          stripPastedStyles={false}
          inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
        />
      </div>
      <div className="example">
        <h3 id="test:4-editor">Strip all formatting on paste</h3>
        <EditorWrapper
          id="test:4"
          ariaDescribedBy="test:4-editor"
          enableHorizontalRule
          enableLineBreak
          stripPastedStyles
          entityTypes={[ENTITY_CONTROL.IMAGE, ENTITY_CONTROL.LINK]}
          blockTypes={[
            BLOCK_CONTROL.HEADER_FOUR,
            BLOCK_CONTROL.UNORDERED_LIST_ITEM,
          ]}
          inlineStyles={[INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC]}
        />
      </div>
      <label className="example">
        <h3>Textarea</h3>
        <textarea rows="5" placeholder="A plain-HTML textarea 😄" />
      </label>
      <label className="example">
        <h3>Input</h3>
        <input type="text" placeholder="A plain-HTML input 😄" />
      </label>
    </div>
  ));
