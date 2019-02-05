import { storiesOf } from "@storybook/react";
import React from "react";

import { INLINE_CONTROL, ENTITY_CONTROL, BLOCK_CONTROL } from "./constants/ui";

import EditorWrapper from "./components/EditorWrapper";
import singleLinePlugin from "./plugins/singleLinePlugin";
import linkifyPlugin from "./plugins/linkifyPlugin";

const singleLine = singleLinePlugin();
const linkify = linkifyPlugin();

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
      inlineStyles={[INLINE_CONTROL.BOLD]}
      blockTypes={[BLOCK_CONTROL.UNORDERED_LIST_ITEM]}
      entityTypes={[ENTITY_CONTROL.LINK]}
      plugins={[linkify]}
    />
  ));
