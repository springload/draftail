// @flow
import React, { Component } from "react";
import type { ContentBlock } from "draft-js";

import MediaBlock from "./MediaBlock";
import type { BlockProps } from "./MediaBlock";
// $FlowFixMe
import { DraftUtils } from "../../lib/index";

type Props = {|
  block: ContentBlock,
  blockProps: BlockProps,
|};

/**
 * Editor block to preview and edit images.
 */
class ImageBlock extends Component<Props> {
  constructor(props: Props) {
    super(props);

    this.changeAlt = this.changeAlt.bind(this);
  }

  /* :: changeAlt: (e: Event) => void; */
  changeAlt(e: Event) {
    const { block, blockProps } = this.props;
    const { editorState, onChange } = blockProps;

    if (e.currentTarget instanceof HTMLInputElement) {
      const data = {
        alt: e.currentTarget.value,
      };

      onChange(DraftUtils.updateBlockEntity(editorState, block, data));
    }
  }

  render() {
    const { blockProps } = this.props;
    const { entity, onEditEntity, onRemoveEntity } = blockProps;
    const { src, alt } = entity.getData();

    return (
      <MediaBlock {...this.props} src={src} label={alt || ""}>
        <label className="ImageBlock__field">
          <p>Alt text</p>
          <input type="text" value={alt || ""} onChange={this.changeAlt} />
        </label>
        <button
          type="button"
          className="Tooltip__button"
          onClick={onEditEntity}
        >
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
  }
}

export default ImageBlock;
