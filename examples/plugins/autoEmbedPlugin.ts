import { AtomicBlockUtils, EditorState, CharacterMetadata } from "draft-js";
import { DraftUtils } from "../../lib/index";
import embedly from "../utils/embedly";
import { LINKIFY_REGEX_EXACT } from "./linkifyPlugin";
const TARGET_EMBED_URLS = [
  ".youtube.com",
  "https://twitter.com",
  "www.wnycstudios.org",
  ".npr.org",
];
type PluginFunctions = {
  setEditorState: (arg0: EditorState) => void;
  getEditorState: () => EditorState;
};

const insertEmbedBlock = (editorState, block) => {
  const content = editorState.getCurrentContent();
  const contentWithEntity = content.createEntity(
    // Fixed in https://github.com/facebook/draft-js/commit/6ba124cf663b78c41afd6c361a67bd29724fa617, to be released.
    // $FlowFixMe
    "EMBED",
    "IMMUTABLE",
    {},
  );
  return DraftUtils.removeBlock(
    AtomicBlockUtils.insertAtomicBlock(
      editorState,
      contentWithEntity.getLastCreatedEntityKey(),
      " ",
    ),
    block.getKey(),
  );
};

const replaceEmbedBlock = (editorState, block) => {
  const content = editorState.getCurrentContent();
  const blockMap = content.getBlockMap();
  const contentWithEntity = content.createEntity(
    // Fixed in https://github.com/facebook/draft-js/commit/6ba124cf663b78c41afd6c361a67bd29724fa617, to be released.
    // $FlowFixMe
    "EMBED",
    "IMMUTABLE",
    {},
  );
  const newBlock = block.merge({
    type: "atomic",
    text: "",
    characterList: block
      .getCharacterList()
      .slice(0, 1)
      .map(() =>
        CharacterMetadata.create({
          entity: contentWithEntity.getLastCreatedEntityKey(),
        }),
      ),
  });
  const newContent = content.merge({
    blockMap: blockMap.set(block.getKey(), newBlock),
  });
  const newState = EditorState.set(editorState, {
    currentContent: newContent,
  });
  return {
    newState,
    newBlock,
  };
};

const autoEmbedPlugin = () => ({
  onChange(
    nextState: EditorState,
    { getEditorState, setEditorState }: PluginFunctions,
  ) {
    const editorState = getEditorState();
    const shouldFilterPaste =
      nextState.getCurrentContent() !== editorState.getCurrentContent() &&
      nextState.getLastChangeType() === "insert-fragment";
    let filteredState = nextState;

    if (shouldFilterPaste) {
      const embedBlock = nextState
        .getCurrentContent()
        .getBlockMap()
        .find((b) => {
          const text = b.getText();
          return (
            b.getType() === "unstyled" &&
            text.match(LINKIFY_REGEX_EXACT) &&
            TARGET_EMBED_URLS.some((s) => text.includes(s))
          );
        });

      if (embedBlock) {
        const replaced = replaceEmbedBlock(filteredState, embedBlock);
        filteredState = replaced.newState;
        embedly.get(embedBlock.getText(), (embed) => {
          const newState = getEditorState();
          // const newSpacerBlock = DraftUtils.getSelectedBlock(newState);
          const newBlock = newState
            .getCurrentContent()
            .getBlockForKey(replaced.newBlock.getKey());
          filteredState = DraftUtils.updateBlockEntity(newState, newBlock, {
            url: embed.url,
            title: embed.title,
            authorName: embed.author_name,
            thumbnail: embed.thumbnail_url,
            html: embed.html,
          });
          setEditorState(filteredState);
        });
      }
    }

    return filteredState;
  },

  handlePastedText(
    text: string,
    html: string | null | undefined,
    editorState: EditorState,
    { setEditorState, getEditorState }: PluginFunctions,
  ) {
    const selection = editorState.getSelection();

    if (
      selection.isCollapsed() &&
      text.match(LINKIFY_REGEX_EXACT) &&
      TARGET_EMBED_URLS.some((s) => text.includes(s))
    ) {
      const block = DraftUtils.getSelectedBlock(editorState);
      setEditorState(insertEmbedBlock(editorState, block));
      embedly.get(text, (embed) => {
        const newState = getEditorState();
        const newSpacerBlock = DraftUtils.getSelectedBlock(newState);
        const newBlock = newState
          .getCurrentContent()
          .getBlockBefore(newSpacerBlock.getKey());
        const nextState = DraftUtils.updateBlockEntity(newState, newBlock, {
          url: embed.url,
          title: embed.title,
          authorName: embed.author_name,
          thumbnail: embed.thumbnail_url,
          html: embed.html,
        });
        setEditorState(nextState);
      });
      return "handled";
    }

    return "not-handled";
  },
});

export default autoEmbedPlugin;