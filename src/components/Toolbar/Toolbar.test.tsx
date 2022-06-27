import { OrderedSet } from "immutable";
import React from "react";
import { EditorState } from "draft-js";
import { shallow } from "enzyme";

import Toolbar from "./Toolbar";

const mockProps = {
  currentStyles: OrderedSet(),
  currentBlock: "unstyled",
  currentBlockKey: "abcd",
  enableHorizontalRule: false,
  enableLineBreak: false,
  showUndoControl: false,
  showRedoControl: false,
  entityTypes: [],
  blockTypes: [],
  inlineStyles: [],
  commands: false,
  toggleBlockType: () => {},
  toggleInlineStyle: () => {},
  addHR: () => {},
  addBR: () => {},
  onUndoRedo: () => {},
  onRequestSource: () => {},
  onCompleteSource: () => {},
  focus: () => {},
  getEditorState: () => EditorState.createEmpty(),
  onChange: () => {},
  controls: [],
};

describe("Toolbar", () => {
  it("empty", () => {
    expect(shallow(<Toolbar {...mockProps} />)).toMatchSnapshot();
  });

  it("#controls", () => {
    expect(
      shallow(
        <Toolbar
          {...mockProps}
          controls={[{ block: () => <span>Test</span> }]}
        />,
      ),
    ).toMatchSnapshot();
  });
});
