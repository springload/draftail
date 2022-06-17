import React from "react";

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
  type: string;
}

export interface InlineStyle extends Control {
  type: string;
}

export interface EntityType extends Control {
  type: string;
  decorator?: React.Component<{}>;
}
