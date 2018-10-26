import { storiesOf } from "@storybook/react";
import React from "react";

import { DraftailEditor, BLOCK_TYPE, INLINE_STYLE } from "../lib";

const initial = JSON.parse(sessionStorage.getItem("draftail:content"));

const onSave = (content) => {
  // eslint-disable-next-line no-console
  console.log("saving", content);
  sessionStorage.setItem("draftail:content", JSON.stringify(content));
};

storiesOf("Draftail", module).add("Simple", () => (
  <DraftailEditor
    rawContentState={initial || null}
    onSave={onSave}
    ariaDescribedBy="simple-editor"
    blockTypes={[
      { type: BLOCK_TYPE.HEADER_THREE },
      { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
    ]}
    inlineStyles={[{ type: INLINE_STYLE.BOLD }, { type: INLINE_STYLE.ITALIC }]}
  />
));
