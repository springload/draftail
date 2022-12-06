import { storiesOf } from "@storybook/react";
import React, { useState } from "react";
import { convertFromHTML, convertToHTML } from "draft-convert";
import {
  EditorState,
  convertToRaw,
  convertFromRaw,
  RawDraftContentState,
  Modifier,
} from "draft-js";

import {
  DraftailEditor,
  InlineToolbar,
  BlockToolbar,
  MetaToolbar,
  INLINE_STYLE,
  ENTITY_TYPE,
  BLOCK_TYPE,
  DraftUtils,
  Toolbar,
  CommandPalette,
  CommandControl,
  ToolbarButton,
  EntitySourceProps,
} from "../src/index";

import {
  INLINE_CONTROL,
  BLOCK_CONTROL,
  ENTITY_CONTROL,
  REDACTED_STYLE,
  BR_ICON,
  SCISSORS_ICON,
} from "./constants/ui";
import indexContentState from "./constants/indexContentState";

import EditorWrapper from "./components/EditorWrapper";
import CharCount from "./components/CharCount";

type Props = {
  pinToolbar: boolean;
  setPinToolbar: (pinToolbar: boolean) => void;
};

class EmojiSource extends React.Component<EntitySourceProps> {
  componentDidMount() {
    const { editorState, onComplete } = this.props;

    const content = editorState.getCurrentContent();
    const selection = editorState.getSelection();

    const newContent = Modifier.replaceText(
      content,
      selection,
      "🙂",
      undefined,
      undefined,
    );
    const nextState = EditorState.push(
      editorState,
      newContent,
      "insert-characters",
    );

    onComplete(nextState);
  }

  render() {
    return null;
  }
}

/**
 * A traditional text style picker.
 */
const ToolbarPinButton = ({ pinToolbar, setPinToolbar }: Props) => (
  <ToolbarButton
    name="PIN_TOOLBAR"
    label={pinToolbar ? "Unpin" : "Pin"}
    onClick={setPinToolbar.bind(null, !pinToolbar)}
    active={false}
  />
);

storiesOf("Prototypes", module)
  // Add a decorator rendering story as a component for hooks support.
  .addDecorator((Story) => <Story />)
  .add("User testing", () => {
    const [pinToolbar, setPinToolbar] = useState<boolean>(false);
    const commands = [
      {
        label: "Formatting",
        type: "blockTypes",
        items: [
          BLOCK_CONTROL.HEADER_TWO,
          BLOCK_CONTROL.BLOCKQUOTE,
          BLOCK_CONTROL.UNORDERED_LIST_ITEM,
        ],
      },
      {
        label: "Content",
        type: "entityTypes",
        items: [
          {
            type: "EMOJI",
            label: "🙂",
            description: "Emoji",
            source: EmojiSource,
            block: ENTITY_CONTROL.LINK.decorator,
          },
          {
            ...ENTITY_CONTROL.LINK,
            block: ENTITY_CONTROL.LINK.decorator,
          },
          ENTITY_CONTROL.IMAGE,
          ENTITY_CONTROL.EMBED,
          {
            type: ENTITY_TYPE.HORIZONTAL_RULE,
          },
        ],
      },
      {
        label: "Actions",
        type: "custom",
        items: [
          {
            type: "split",
            description: "Split",
            icon: SCISSORS_ICON,
            onSelect: ({ editorState }: { editorState: EditorState }) => {
              const block = DraftUtils.getSelectedBlock(editorState);
              return DraftUtils.resetBlockWithType(
                editorState,
                block.getType(),
                "✂",
              );
            },
          },
          {
            type: "reset",
            description: "Reset",
            label: "♻",
            render: ({
              option,
            }: Parameters<NonNullable<CommandControl["render"]>>[0]) => {
              const text = `${option.description} (full reset)`;
              return <div>{text}</div>;
            },
            onSelect: () => EditorState.createEmpty(),
          },
        ],
      },
    ];

    return (
      <div className="container">
        <div className="sidebar" />
        <div className="main-col">
          <div className="header">
            <div className="header__breadcrumb">All about wagtails</div>
            <div className="header__actions">Live</div>
          </div>

          <nav className="tabs">
            <ul className="tabs__container">
              <li className="tab-item">
                <a className="tab-item__link tab-item__link--active" href="#">
                  Content
                </a>
              </li>
              <li className="tab-item">
                <a className="tab-item__link" href="#">
                  Promote
                </a>
              </li>
            </ul>
          </nav>

          <div className="content">
            <form className="content__container">
              <div className="form-item">
                <label className="form-item__label sr-only">Page title</label>
                <input
                  className="form-item__input form-item__input--large"
                  type="text"
                  placeholder="Enter page title*"
                />
                <span className="form-item__help">
                  This is the page title as you’d like it to be seen by the
                  public
                </span>
              </div>

              <div className="form-item">
                <div className="form-item__heading">
                  <i
                    className="form-item__icon fa-solid fa-paragraph"
                    aria-hidden="true"
                  />
                  <label className="form-item__label">Rich text</label>
                </div>
                <input
                  className="form-item__input"
                  type="text"
                  placeholder="Write something or type '/' to insert a block"
                />
                <span className="form-item__help">
                  This is the help text for this field
                </span>
              </div>

              <div className="form-item">
                <div className="form-item__heading">
                  <i
                    className="form-item__icon fa-solid fa-paragraph"
                    aria-hidden="true"
                  />
                  <label className="form-item__label">Rich text</label>
                </div>
                <input
                  className="form-item__input"
                  type="text"
                  placeholder="Write something or type '/' to insert a block"
                />
                <span className="form-item__help">
                  This is the help text for this field
                </span>
              </div>

              <div className="form-item">
                <div className="form-item__heading">
                  <i
                    className="form-item__icon fa-solid fa-paragraph"
                    aria-hidden="true"
                  />
                  <label className="form-item__label">Rich text</label>
                </div>
                <div className="docs-floating-toolbars">
                  <EditorWrapper
                    id="floating-toolbars"
                    rawContentState={indexContentState as RawDraftContentState}
                    stripPastedStyles={false}
                    placeholder="Insert ‘/’ or write here…"
                    enableHorizontalRule
                    enableLineBreak={{
                      icon: BR_ICON,
                    }}
                    entityTypes={[
                      ENTITY_CONTROL.LINK,
                      ENTITY_CONTROL.IMAGE,
                      ENTITY_CONTROL.EMBED,
                      {
                        type: "EMOJI",
                        label: "🙂",
                        description: "🙂 emoji",
                        source: EmojiSource,
                        decorator: ENTITY_CONTROL.LINK.decorator,
                      },
                    ]}
                    blockTypes={[
                      BLOCK_CONTROL.HEADER_TWO,
                      BLOCK_CONTROL.HEADER_THREE,
                      BLOCK_CONTROL.BLOCKQUOTE,
                      BLOCK_CONTROL.CODE,
                      BLOCK_CONTROL.UNORDERED_LIST_ITEM,
                    ]}
                    inlineStyles={[
                      INLINE_CONTROL.BOLD,
                      INLINE_CONTROL.ITALIC,
                      INLINE_CONTROL.KEYBOARD,
                    ]}
                    controls={[
                      {
                        inline: CharCount,
                      },
                      // {
                      //   inline: () => (
                      //     <ToolbarPinButton
                      //       pinToolbar={pinToolbar}
                      //       setPinToolbar={setPinToolbar}
                      //     />
                      //   ),
                      // },
                      {
                        meta: CharCount,
                      },
                    ]}
                    commands={commands}
                    topToolbar={(props) => (
                      <>
                        <BlockToolbar {...props} />
                        {pinToolbar ? <Toolbar {...props} /> : null}
                      </>
                    )}
                    bottomToolbar={(props) => (
                      <>
                        <InlineToolbar {...props} />
                        <MetaToolbar showBlockEntities {...props} />
                      </>
                    )}
                  />
                </div>

                <span className="form-item__help">
                  This is the help text for this field
                </span>
              </div>

              <div className="form-item">
                <div className="form-item__heading">
                  <i
                    className="form-item__icon fa-solid fa-paragraph"
                    aria-hidden="true"
                  />
                  <label className="form-item__label">Rich text</label>
                </div>
                <input
                  className="form-item__input"
                  type="text"
                  placeholder="Write something or type '/' to insert a block"
                />
                <span className="form-item__help">
                  This is the help text for this field
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  });
