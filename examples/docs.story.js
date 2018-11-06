import { storiesOf } from "@storybook/react";
import React from "react";

import { INLINE_CONTROL, BLOCK_CONTROL } from "./constants/ui";

import EditorWrapper from "./components/EditorWrapper";

storiesOf("Docs", module).add("Built-in formats", () => (
  <EditorWrapper
    id="builtin-formats"
    stripPastedStyles={false}
    enableHorizontalRule
    enableLineBreak
    showUndoControl
    showRedoControl
    maxListNesting={6}
    blockTypes={Object.values(BLOCK_CONTROL)}
    inlineStyles={Object.values(INLINE_CONTROL)}
  />
));
