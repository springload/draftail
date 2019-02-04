// @flow
import { ContentBlock, ContentState, EditorState, genKey } from "draft-js";
import { List } from "immutable";

/**
 * Condense an array of content blocks into a single block
 */
export function condenseBlocks(editorState: EditorState) {
  const blocks = editorState.getCurrentContent().getBlocksAsArray();

  if (blocks.length < 2) {
    return editorState;
  }

  let text = List();
  let characterList = List();

  // Gather all the text/characterList and concat them
  blocks.forEach((block) => {
    // Atomic blocks should be ignored (stripped)
    if (block.getType() !== "atomic") {
      text = text.push(block.getText());
      characterList = characterList.concat(block.getCharacterList());
    }
  });

  const contentBlock = new ContentBlock({
    key: genKey(),
    text: text.join(""),
    type: "unstyled",
    characterList,
    depth: 0,
  });

  // Update the editor state with the compressed version.
  const newContentState = ContentState.createFromBlockArray([contentBlock]);
  // Create the new state as an undoable action.
  const nextState = EditorState.push(
    editorState,
    newContentState,
    "remove-range",
  );
  // Move the selection to the end.
  return EditorState.moveFocusToEnd(nextState);
}

/**
 * Single Line Plugin
 */
const singleLinePlugin = () => {
  return {
    onChange(editorState: EditorState) {
      return condenseBlocks(editorState);
    },

    /**
     * Stop new lines being inserted by always handling the return
     */
    handleReturn() {
      return "handled";
    },
  };
};

export default singleLinePlugin;
