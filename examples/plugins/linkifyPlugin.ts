import { Modifier, RichUtils, EditorState } from "draft-js";

const createEntity = (
  editorState: EditorState,
  entityType: string,
  entityData: {},
  entityText: string,
  entityMutability: "IMMUTABLE" | "MUTABLE" = "IMMUTABLE",
) => {
  const contentState = editorState.getCurrentContent();
  const selection = editorState.getSelection();
  const contentStateWithEntity = contentState.createEntity(
    entityType,
    entityMutability,
    entityData,
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

  let nextContentState;

  if (selection.isCollapsed()) {
    nextContentState = Modifier.insertText(
      contentState,
      selection,
      entityText,
      null,
      entityKey,
    );
  } else {
    nextContentState = Modifier.replaceText(
      contentState,
      selection,
      entityText,
      null,
      entityKey,
    );
  }

  const nextState = EditorState.push(
    editorState,
    nextContentState,
    "insert-fragment",
  );

  return nextState;
};

// https://gist.github.com/dperini/729294
const LINKIFY_PATTERN = // protocol identifier (optional)
  // short syntax // still required
  "(?:(?:(?:https?|ftp):)?\\/\\/)" +
  // user:pass BasicAuth (optional)
  "(?:\\S+(?::\\S*)?@)?" +
  "(?:" +
  // IP address exclusion
  // private & local networks
  "(?!(?:10|127)(?:\\.\\d{1,3}){3})" +
  "(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})" +
  "(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})" +
  // IP address dotted notation octets
  // excludes loopback network 0.0.0.0
  // excludes reserved space >= 224.0.0.0
  // excludes network & broacast addresses
  // (first & last IP address of each class)
  "(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])" +
  "(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}" +
  "(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))" +
  "|" +
  // host & domain names, may end with dot
  // can be replaced by a shortest alternative
  // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
  "(?:" +
  "(?:" +
  "[a-z0-9\\u00a1-\\uffff]" +
  "[a-z0-9\\u00a1-\\uffff_-]{0,62}" +
  ")?" +
  "[a-z0-9\\u00a1-\\uffff]\\." +
  ")+" +
  // TLD identifier name, may end with dot
  "(?:[a-z\\u00a1-\\uffff]{2,}\\.?)" +
  ")" +
  // port number (optional)
  "(?::\\d{2,5})?" +
  // resource path (optional)
  "(?:[/?#]\\S*)?";

export const LINKIFY_REGEX_EXACT = new RegExp(`^${LINKIFY_PATTERN}$`, "ig");

const linkifyPlugin = () => ({
  handlePastedText(
    text: string,
    html: string | null | undefined,
    editorState: EditorState,
    {
      setEditorState,
    }: {
      setEditorState: (arg0: EditorState) => void;
    },
  ) {
    let nextState = editorState;

    if (text.match(LINKIFY_REGEX_EXACT)) {
      const selection = nextState.getSelection();

      if (selection.isCollapsed()) {
        nextState = createEntity(
          nextState,
          "LINK",
          { url: text },
          text,
          "MUTABLE",
        );
      } else {
        const content = nextState.getCurrentContent();
        const contentWithEntity = content.createEntity("LINK", "MUTABLE", {
          url: text,
        });
        const entityKey = contentWithEntity.getLastCreatedEntityKey();
        nextState = RichUtils.toggleLink(nextState, selection, entityKey);
      }

      setEditorState(nextState);
      return "handled";
    }

    return "not-handled";
  },
});

export default linkifyPlugin;
