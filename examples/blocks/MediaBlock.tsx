import React, { Component } from "react";
import type { Node } from "react";
import { EditorState } from "draft-js";
import type { EntityInstance } from "draft-js";
import { Icon } from "../../lib";
import Tooltip from "../components/Tooltip";
import type { Rect } from "../components/Tooltip";
import Portal from "../components/Portal";
// Constraints the maximum size of the tooltip.
const OPTIONS_MAX_WIDTH = 300;
const OPTIONS_SPACING = 70;
const TOOLTIP_MAX_WIDTH = OPTIONS_MAX_WIDTH + OPTIONS_SPACING;
export type BlockProps = {
  /** The editorState is available for arbitrary content manipulation. */
  editorState: EditorState;

  /** Current entity to manage. */
  entity: EntityInstance;

  /** Current entityKey to manage. */
  entityKey: string;

  /** Whole entityType configuration, as provided to the editor. */
  entityType: {
    description: string;
    icon: string | string[] | Node;
  };

  /** Optionally set the overriding text directionality for this editor. */
  textDirectionality: "LTR" | "RTL" | null;

  /** Make the whole editor read-only, except for the block. */
  lockEditor: () => void;

  /** Make the editor editable again. */
  unlockEditor: () => void;

  /** Shorthand to edit entity data. */
  onEditEntity: (entityKey: string) => void;

  /** Shorthand to remove an entity, and the related block. */
  onRemoveEntity: (entityKey: string, blockKey: string) => void;

  /** Update the editorState with arbitrary changes. */
  onChange: (arg0: EditorState) => void;
};
type Props = {
  blockProps: BlockProps;
  src: string;
  label: string;
  isLoading: boolean;
  children: Node;
};
type State = {
  tooltip:
    | {
        target: Rect;
        containerWidth: number;
      }
    | null
    | undefined;
};
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
    this.setState({
      tooltip: null,
    });
  }

  /* :: renderTooltip: () => ?Node; */
  renderTooltip() {
    const { children, blockProps } = this.props;
    const { textDirectionality } = blockProps;
    const { tooltip } = this.state;

    if (!tooltip) {
      return null;
    }

    const maxWidth = tooltip.containerWidth - tooltip.target.width;
    const direction = maxWidth >= TOOLTIP_MAX_WIDTH ? "start" : "top-start";
    return (
      <Portal
        onClose={this.closeTooltip}
        closeOnClick
        closeOnType
        closeOnResize
      >
        <Tooltip
          target={tooltip.target}
          direction={direction}
          textDirectionality={textDirectionality}
        >
          <div
            style={{
              maxWidth: OPTIONS_MAX_WIDTH,
            }}
          >
            {children}
          </div>
        </Tooltip>
      </Portal>
    );
  }

  render() {
    const { blockProps, src, label, isLoading } = this.props;
    const { entityType } = blockProps;
    return (
      <button
        type="button"
        tabIndex={-1}
        className={`MediaBlock${isLoading ? " MediaBlock--loading" : ""}`}
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