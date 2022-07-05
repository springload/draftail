import React, { Component } from "react";

import { EntityBlockProps, Icon, Tooltip } from "../../src/index";

// Constraints the maximum size of the tooltip.
const OPTIONS_MAX_WIDTH = 300;

export interface MediaBlockProps extends EntityBlockProps {
  src: string;
  label: string;
  isLoading: boolean;
  children: React.ReactNode;
}

export interface MediaBlockState {
  tooltip: {
    target: DOMRect;
    containerWidth: number;
  } | null;
}

/**
 * Editor block to preview and edit images.
 */
class MediaBlock extends Component<MediaBlockProps, MediaBlockState> {
  constructor(props: MediaBlockProps) {
    super(props);

    this.state = {
      tooltip: null,
    };

    this.openTooltip = this.openTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
    this.renderTooltip = this.renderTooltip.bind(this);
  }

  openTooltip(e: React.MouseEvent<HTMLButtonElement>) {
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

  closeTooltip() {
    this.setState({ tooltip: null });
  }

  renderTooltip() {
    const { children } = this.props;
    const { tooltip } = this.state;

    if (!tooltip) {
      return null;
    }

    return (
      <Tooltip
        shouldOpen={Boolean(tooltip)}
        onHide={this.closeTooltip}
        placement="auto"
        getTargetPosition={(editorRect) => {
          if (!tooltip) {
            return null;
          }

          return {
            left: tooltip.target.left - editorRect.left,
            top: 0,
          };
        }}
        content={
          <div
            className="Draftail-InlineToolbar"
            role="toolbar"
            style={{ maxWidth: OPTIONS_MAX_WIDTH }}
          >
            {children}
          </div>
        }
      />
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
