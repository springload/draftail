import { EditorState, AtomicBlockUtils } from "draft-js";
import { DraftUtils } from "../../src/index";
import embedly from "../utils/embedly";

import { LINKIFY_REGEX_EXACT } from "./linkifyPlugin";

type PluginFns = {
  setEditorState: (state: EditorState) => void;
};

const slashCommandPlugin = () => ({
  handleReturn(
    e: React.KeyboardEvent,
    editorState: EditorState,
    { setEditorState }: PluginFns,
  ) {
    const selection = editorState.getSelection();
    const block = DraftUtils.getSelectedBlock(editorState);
    const text = block.getText();

    if (
      !selection.isCollapsed() ||
      !selection.getStartOffset() === text.length
    ) {
      return "not-handled";
    }

    if (text === "/hr") {
      const nextState = DraftUtils.removeBlock(
        DraftUtils.addHorizontalRuleRemovingSelection(editorState),
        block.getKey(),
      );

      setEditorState(nextState);
      return "handled";
    }

    if (
      text.startsWith("/embed ") &&
      text.replace("/embed ", "").match(LINKIFY_REGEX_EXACT)
    ) {
      const url = text.replace("/embed ", "");

      embedly.get(url, (embed) => {
        const content = editorState.getCurrentContent();
        const contentWithEntity = content.createEntity(
          // Fixed in https://github.com/facebook/draft-js/commit/6ba124cf663b78c41afd6c361a67bd29724fa617, to be released.
          "EMBED",
          "IMMUTABLE",
          {
            url: embed.url,
            title: embed.title,
            authorName: embed.author_name,
            thumbnail: embed.thumbnail_url,
          },
        );
        const nextState = DraftUtils.removeBlock(
          AtomicBlockUtils.insertAtomicBlock(
            editorState,
            contentWithEntity.getLastCreatedEntityKey(),
            " ",
          ),
          block.getKey(),
        );

        setEditorState(nextState);
      });

      return "handled";
    }

    return "not-handled";
  },
});

export default slashCommandPlugin;
