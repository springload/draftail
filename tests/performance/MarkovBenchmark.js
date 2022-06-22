import React from "react";
import contentStates from "markov_draftjs";

import { DraftailEditor } from "../../src/index";

import {
  INLINE_CONTROL,
  BLOCK_CONTROL,
  ENTITY_CONTROL,
} from "../../examples/constants/ui";

/**
 * These are the props required to correctly render content of markov_draftjs.
 */
export const benchmarkProps = {
  enableHorizontalRule: true,
  maxListNesting: 1,
  entityTypes: [
    ENTITY_CONTROL.LINK,
    ENTITY_CONTROL.IMAGE,
    ENTITY_CONTROL.DOCUMENT,
  ],
  blockTypes: [
    BLOCK_CONTROL.HEADER_TWO,
    BLOCK_CONTROL.HEADER_THREE,
    BLOCK_CONTROL.HEADER_FOUR,
    BLOCK_CONTROL.UNORDERED_LIST_ITEM,
    BLOCK_CONTROL.ORDERED_LIST_ITEM,
  ],
  inlineStyles: [INLINE_CONTROL.BOLD, INLINE_CONTROL.ITALIC],
};

const MarkovBenchmark = ({ id }: { id: number }) => (
  <DraftailEditor rawContentState={contentStates[id]} {...benchmarkProps} />
);

export default MarkovBenchmark;
