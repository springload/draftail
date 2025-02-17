import { storiesOf } from "@storybook/react";
import React, { Component, useState } from "react";

import { BlockToolbar, InlineToolbar, MetaToolbar } from "../src";

import {
  INLINE_CONTROL,
  BLOCK_CONTROL,
  ENTITY_CONTROL,
  TINY_TEXT_BLOCK,
  REDACTED_STYLE,
} from "./constants/ui";

import EditorWrapper from "./components/EditorWrapper";
import CharCount from "./components/CharCount";

storiesOf("Tests", module)
  // Add a decorator rendering story as a component for hooks support.
  .addDecorator((Story) => <Story />)
  .add("Unmount", () => {
    class UnmountTest extends Component<
      Record<string, never>,
      { count: number }
    > {
      constructor(props: Record<string, never>) {
        super(props);

        this.state = {
          count: 0,
        };

        this.onSave = this.onSave.bind(this);
      }

      onSave() {
        this.setState(({ count }) => ({ count: count + 1 }));
      }

      render() {
        const { count } = this.state;
        return (
          <>
            <EditorWrapper
              id="unmount"
              onSave={this.onSave}
              stateSaveInterval={1000}
            />
            {`Saves: ${count}`}
          </>
        );
      }
    }

    class UnmountWrapper extends Component<
      Record<string, never>,
      { isMounted: boolean }
    > {
      constructor(props: Record<string, never>) {
        super(props);

        this.state = {
          isMounted: true,
        };

        this.toggleMount = this.toggleMount.bind(this);
      }

      toggleMount() {
        this.setState(({ isMounted }) => ({ isMounted: !isMounted }));
      }

      render() {
        const { isMounted } = this.state;
        return (
          <>
            <button type="button" onClick={this.toggleMount}>
              {isMounted ? "Unmount" : "Mount"}
            </button>
            {isMounted ? <UnmountTest /> : null}
          </>
        );
      }
    }

    return <UnmountWrapper />;
  })
  .add("Copy-paste", () => (
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
        <textarea rows={5} placeholder="A plain-HTML textarea 😄" />
      </label>
      <label className="example">
        <h3>Input</h3>
        <input type="text" placeholder="A plain-HTML input 😄" />
      </label>
    </div>
  ))
  .add("Disable editing", () => {
    const [readOnly, setReadOnly] = useState(false);
    return (
      <>
        <EditorWrapper
          id="disable-editing"
          ariaDescribedBy="disable-editing-editor"
          readOnly={readOnly}
          entityTypes={[ENTITY_CONTROL.LINK]}
        />
        <button type="button" onClick={setReadOnly.bind(null, !readOnly)}>
          Toggle editing
        </button>
      </>
    );
  })
  .add("Integration", () => (
    <main>
      <p id="integration-editor">Integration tests</p>
      <EditorWrapper
        id="integration"
        ariaDescribedBy="integration-editor"
        placeholder="Write here…"
        // Makes it easier to write automated tests retrieving the content.
        stateSaveInterval={50}
        enableHorizontalRule
        enableLineBreak
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
        controls={[
          {
            meta: CharCount,
          },
        ]}
        topToolbar={(props) => (
          <>
            <InlineToolbar defaultToolbar="sticky" {...props} />
            <BlockToolbar {...props} />
          </>
        )}
        bottomToolbar={MetaToolbar}
      />
    </main>
  ));
