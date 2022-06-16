import React from "react";
import DraftEditorBlock from "draft-js/lib/DraftEditorBlock.react";

import { DESCRIPTIONS, LABELS } from "../../api/constants";

import Placeholder from "./Placeholder";

export const getBlockDescription = (
  type: string,
  blockTypes: {
    type?: string;
    label?: string;
    description?: string;
  }[],
) => {
  const blockType = blockTypes.find((t) => t.type === type);
  if (blockType) {
    const useDefaultDescription = typeof blockType.description === "undefined";
    const defaultDescription = DESCRIPTIONS[type];
    const description = useDefaultDescription
      ? defaultDescription
      : blockType.description;
    const useDefaultLabel = typeof blockType.label === "undefined";
    const defaultLabel = LABELS[type];
    const label = useDefaultLabel ? defaultLabel : blockType.label;

    return description || label;
  }

  return null;
};

/**
 * A DraftEditorBlock, with additional placeholder text to display in some criteria.
 */
const DraftailPlaceholderBlock = (props: any) => {
  const { blockProps, ...otherProps } = props;
  const { blockTypes, ...otherBlockProps } = blockProps;
  const { block } = otherProps;
  const blockDescription = getBlockDescription(block.getType(), blockTypes);
  return (
    <>
      <Placeholder text={blockDescription} />
      <DraftEditorBlock {...otherProps} blockProps={otherBlockProps} />
    </>
  );
};

export default DraftailPlaceholderBlock;
