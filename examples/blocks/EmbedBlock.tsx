import React from "react";
import type { ContentBlock } from "draft-js";

import MediaBlock from "./MediaBlock";
import type { BlockProps } from "./MediaBlock";

type Props = {
  block: ContentBlock;
  blockProps: BlockProps;
};

/**
 * Editor block to display media and edit content.
 */
const EmbedBlock = (props: Props) => {
  const { blockProps } = props;
  const { entity, onEditEntity, onRemoveEntity } = blockProps;
  const { url, title, thumbnail } = entity.getData();
  const isLoading = !url && !title && !thumbnail;

  return (
    <MediaBlock {...props} src={thumbnail} label={title} isLoading={isLoading}>
      <a
        className="EmbedBlock__link"
        href={url}
        title={url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {title}
      </a>

      <button type="button" className="Tooltip__button" onClick={onEditEntity}>
        Edit
      </button>

      <button
        type="button"
        className="Tooltip__button"
        onClick={onRemoveEntity}
      >
        Remove
      </button>
    </MediaBlock>
  );
};

export default EmbedBlock;
