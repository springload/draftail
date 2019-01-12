// @flow
import React, { Component } from "react";
import type { Node } from "react";
import { EditorState } from "draft-js";
import type { EntityInstance } from "draft-js";

// $FlowFixMe
import { Icon } from "../../lib";

import Tooltip from "../components/Tooltip";
import type { Rect } from "../components/Tooltip";
import Portal from "../components/Portal";

// Constraints the maximum size of the tooltip.
const OPTIONS_MAX_WIDTH = 300;
const OPTIONS_SPACING = 70;
const TOOLTIP_MAX_WIDTH = OPTIONS_MAX_WIDTH + OPTIONS_SPACING;

export type BlockProps = {|
  entity: EntityInstance,
  entityType: {
    description: string,
    icon: string | string[] | Node,
  },
  editorState: EditorState,
  onChange: (EditorState) => void,
  onEditEntity: () => void,
  onRemoveEntity: () => void,
|};

type Props = {
  blockProps: BlockProps,
  src: string,
  label: string,
  children: Node,
};

type State = {|
  tooltip: ?{|
    target: Rect,
    containerWidth: number,
  |},
|};

/**
 * Editor block to preview and edit images.
 */
class MediaBlock extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tooltip: null,
    };

    this.openTooltip = this.openTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
    this.renderTooltip = this.renderTooltip.bind(this);
  }

  /* :: openTooltip: (e: Event) => void; */
  openTooltip(e: Event) {
    const trigger = e.target;

    if (
      trigger instanceof Element &&
      trigger.parentNode instanceof HTMLElement
    ) {
      const containerWidth = trigger.parentNode.offsetWidth;

      this.setState({
        tooltip: {
          target: trigger.getBoundingClientRect(),
          containerWidth,
        },
      });
    }
  }

  /* :: closeTooltip: () => void; */
  closeTooltip() {
    this.setState({ tooltip: null });
  }

  /* :: renderTooltip: () => ?Node; */
  renderTooltip() {
    const { children } = this.props;
    const { tooltip } = this.state;

    if (!tooltip) {
      return null;
    }

    const maxWidth = tooltip.containerWidth - tooltip.target.width;
    const direction = maxWidth >= TOOLTIP_MAX_WIDTH ? "left" : "top-left";

    return (
      <Portal
        onClose={this.closeTooltip}
        closeOnClick
        closeOnType
        closeOnResize
      >
        <Tooltip target={tooltip.target} direction={direction}>
          <div style={{ maxWidth: OPTIONS_MAX_WIDTH }}>{children}</div>
        </Tooltip>
      </Portal>
    );
  }

  render() {
    const { blockProps, src, label } = this.props;
    const { entityType } = blockProps;

    return (
      <button
        type="button"
        tabIndex={-1}
        className="MediaBlock"
        aria-label={`${entityType.description}${label ? ": " : ""}${label}`}
        onMouseUp={this.openTooltip}
      >
        <span className="MediaBlock__icon-wrapper" aria-hidden>
          <Icon icon={entityType.icon} className="MediaBlock__icon" />
        </span>

        <img className="MediaBlock__img" src={src} alt="" width="256" />

        {this.renderTooltip()}
      </button>
    );
  }
}

export default MediaBlock;
