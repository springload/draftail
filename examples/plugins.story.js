import { storiesOf } from "@storybook/react";
import React from "react";

import { INLINE_STYLE } from "../lib";

import EditorWrapper from "./components/EditorWrapper";
import singleLinePlugin from "./plugins/singleLinePlugin";

const singleLine = singleLinePlugin();

storiesOf("Plugins", module).add("Single-line", () => (
  <EditorWrapper
    id="single-line"
    inlineStyles={[{ type: INLINE_STYLE.BOLD }, { type: INLINE_STYLE.ITALIC }]}
    enableLineBreak
    plugins={[singleLine]}
  />
));
