import React, { Component } from "react";

import MediaBlock from "./MediaBlock";
import { DraftUtils, EntityBlockProps } from "../../src/index";

/**
 * Editor block to preview and edit images.
 */
class ImageBlock extends Component<EntityBlockProps> {
  constructor(props: EntityBlockProps) {
    super(props);

    this.changeAlt = this.changeAlt.bind(this);
  }

  changeAlt(e: React.ChangeEvent<HTMLInputElement>) {
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
      // eslint-disable-next-line react/jsx-props-no-spreading
      <MediaBlock {...this.props} src={src} label={alt || ""} isLoading={false}>
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
