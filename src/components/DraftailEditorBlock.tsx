import React from "react";
import DraftEditorBlock from "draft-js/lib/DraftEditorBlock.react";

const DraftailEditorBlock = (props: any) => {
  const { blockProps, ...otherProps } = props;
  const { onMouseEnter, blockComponent, ...otherBlockProps } = blockProps;
  const BlockComponent = blockComponent || DraftEditorBlock;
  return (
    <div onMouseEnter={onMouseEnter}>
      <BlockComponent {...otherProps} blockProps={otherBlockProps} />
    </div>
  );
};

export default DraftailEditorBlock;
