import { storiesOf } from "@storybook/react";
import { RawDraftContentState } from "draft-js";
import React from "react";

import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from "../src/index";

const initial = JSON.parse(sessionStorage.getItem("content") || "null");

const onSave = (content: RawDraftContentState | null) => {
  // eslint-disable-next-line no-console
  console.log("saving", content);
  sessionStorage.setItem("content", JSON.stringify(content));
};

storiesOf("Draftail", module).add("Simple", () => (
  <DraftailEditor
    rawContentState={initial || null}
    onSave={onSave}
    blockTypes={[
      { type: BLOCK_TYPE.HEADER_THREE },
      { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
    ]}
    inlineStyles={[{ type: INLINE_STYLE.BOLD }, { type: INLINE_STYLE.ITALIC }]}
  />
));
