// @flow

declare module "@tippyjs/react" {
  declare type DefaultProps = {
    visible?: boolean,
    getReferenceClientRect?: () => ?ClientRect,
    maxWidth?: string,
    interactive?: boolean,
    appendTo?: () => HTMLElement | null,
    content?: React$Node,
  };

  declare type Props = DefaultProps & {};

  declare class Tippy extends React$Component<Props> {}

  declare module.exports: typeof Tippy;
}
