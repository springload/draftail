import { EditorState } from "draft-js";
import React, { CSSProperties } from "react";

export type IconProp = string | string[] | JSX.Element;

export interface Control {
  type?: string;
  // Describes the control in the editor UI, concisely.
  label?: string | null | undefined;
  // Describes the control in the editor UI.
  description?: string;
  // Represents the control in the editor UI.
  icon?: IconProp;
}

export type BoolControl = boolean | Control;

export interface BlockType extends Control {
  /** Unique type shared between block instances. */
  type: string;
  /** DOM element used to display the block within the editor area. */
  element?: string;
}

export interface InlineStyle extends Control {
  /** Unique type shared between inline style instances. */
  type: string;
  /** CSS properties (in JS format) to apply for styling within the editor area. */
  style?: CSSProperties;
}

export interface EntityType extends Control {
  /** Unique type shared between entity instances. */
  type: string;

  /** React component providing the UI to manage entities of this type. */
  source: React.Component<{}>;

  /** React component to display inline entities. */
  decorator?: React.Component<{}>;

  /** React component to display block-level entities. */
  block?: React.Component<{}>;

  /** Custom copy-paste processing checker. */
  onPaste: (
    text: string,
    html: string | null | undefined,
    editorState: EditorState,
    helpers: {
      setEditorState: (state: EditorState) => void;
      getEditorState: () => EditorState;
    },
    entityType: {},
  ) => "handled" | "not-handled";

  /** Array of attributes the entity uses, to preserve when filtering entities on paste.
   * If undefined, all entity data is preserved.
   */
  attributes?: ReadonlyArray<string>;

  /** Attribute - regex mapping, to preserve entities based on their data on paste.
   * For example, { url: '^https:' } will only preserve links that point to HTTPS URLs.
   */
  allowlist?: { [attr: string]: string };

  /** Attribute - regex mapping, to preserve entities based on their data on paste.
   * For example, { url: '^https:' } will only preserve links that point to HTTPS URLs.
   */
  whitelist?: { [attr: string]: string };
}
