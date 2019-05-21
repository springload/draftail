// @flow
import { AtomicBlockUtils, EditorState } from "draft-js";

import { DraftUtils } from "../../lib/index";

import embedly from "../utils/embedly";
import { LINKIFY_REGEX_EXACT } from "./linkifyPlugin";

const TARGET_EMBED_URLS = [
  ".youtube.com",
  "https://twitter.com",
  "www.wnycstudios.org",
  ".npr.org",
];

const autoEmbedPlugin = () => ({
  handlePastedText(
    text: string,
    html: ?string,
    editorState: EditorState,
    {
      setEditorState,
      getEditorState,
    }: {
      setEditorState: (EditorState) => void,
      getEditorState: () => EditorState,
    },
  ) {
    const selection = editorState.getSelection();

    if (
      selection.isCollapsed() &&
      text.match(LINKIFY_REGEX_EXACT) &&
      TARGET_EMBED_URLS.some((s) => text.includes(s))
    ) {
      const block = DraftUtils.getSelectedBlock(editorState);

      const content = editorState.getCurrentContent();
      const contentWithEntity = content.createEntity(
        // Fixed in https://github.com/facebook/draft-js/commit/6ba124cf663b78c41afd6c361a67bd29724fa617, to be released.
        // $FlowFixMe
        "EMBED",
        "IMMUTABLE",
        {},
      );
      let nextState = DraftUtils.removeBlock(
        AtomicBlockUtils.insertAtomicBlock(
          editorState,
          contentWithEntity.getLastCreatedEntityKey(),
          " ",
        ),
        block.getKey(),
      );

      setEditorState(nextState);

      embedly.get(text, (embed) => {
        const newState = getEditorState();
        // const lastBlock = newState.getCurrentContent().getLastBlock();
        const newSpacerBlock = DraftUtils.getSelectedBlock(newState);
        const newBlock = newState
          .getCurrentContent()
          .getBlockBefore(newSpacerBlock.getKey());

        nextState = DraftUtils.updateBlockEntity(newState, newBlock, {
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
