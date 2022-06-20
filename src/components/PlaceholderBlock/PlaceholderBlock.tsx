import React from "react";
// @ts-ignore
import DraftEditorBlock from "draft-js/lib/DraftEditorBlock.react";

import { getControlDescription } from "../../api/ui";

import Placeholder from "./Placeholder";

export const findBlockDescription = (
  type: string,
  blockTypes: {
    type?: string;
    label?: string;
    description?: string;
  }[],
) => {
  const blockType = blockTypes.find((t) => t.type === type);
  return blockType ? getControlDescription(blockType) : null;
};

/**
 * A DraftEditorBlock, with additional placeholder text to display in some criteria.
 */
const DraftailPlaceholderBlock = (props: any) => {
  const { blockProps, ...otherProps } = props;
  const { blockTypes, ...otherBlockProps } = blockProps;
  const { block } = otherProps;
  const blockDescription = findBlockDescription(block.getType(), blockTypes);
  return (
    <>
      <Placeholder text={blockDescription} />
      <DraftEditorBlock {...otherProps} blockProps={otherBlockProps} />
    </>
  );
};

export default DraftailPlaceholderBlock;
