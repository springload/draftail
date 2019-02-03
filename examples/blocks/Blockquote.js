// @flow
import React from "react";
import { EditorBlock } from "draft-js";

// import { updateDataOfBlock } from "../../model/";

type Props = {|
  block: ContentBlock,
  blockProps: BlockProps,
|};

class Blockquote extends React.Component<Props> {
  constructor(props) {
    super(props);
    this.updateData = this.updateData.bind(this);
  }

  updateData() {
    const { block, blockProps } = this.props;
    const { setEditorState, getEditorState } = blockProps;
    const data = block.getData();
    const checked = data.has("checked") && data.get("checked") === true;
    const newData = data.set("checked", !checked);
    setEditorState(updateDataOfBlock(getEditorState(), block, newData));
  }

  render() {
    const { block } = this.props;
    const data = block.getData();
    return (
      <div>
        <EditorBlock {...this.props} />
        <span contentEditable={false}>
          <input type="text" />
        </span>
      </div>
    );
  }
}

export default Blockquote;
