import React from "react";
import { ContentBlock } from "draft-js";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import DraftEditorBlock from "draft-js/lib/DraftEditorBlock.react";

import { getControlDescription } from "../../api/ui";
import { BlockTypeControl } from "../../api/types";

import Placeholder from "./Placeholder";

export const findBlockDescription = (
  type: string,
  blockTypes: BlockTypeControl[],
) => {
  const blockType = blockTypes.find((t) => t.type === type);
  return blockType ? getControlDescription(blockType) : null;
};

interface DraftailPlaceholderBlockProps {
  blockProps: {
    blockTypes: BlockTypeControl[];
  };
  block: ContentBlock;
}

/**
 * A DraftEditorBlock, with additional placeholder text to display in some criteria.
 */
const DraftailPlaceholderBlock = ({
  blockProps,
  ...otherProps
}: DraftailPlaceholderBlockProps) => {
  const { blockTypes, ...otherBlockProps } = blockProps;
  const { block } = otherProps;
  const blockDescription = findBlockDescription(block.getType(), blockTypes);
  return (
    <>
      <Placeholder text={blockDescription} />
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <DraftEditorBlock {...otherProps} blockProps={otherBlockProps} />
    </>
  );
};

export default DraftailPlaceholderBlock;
