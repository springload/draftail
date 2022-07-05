import React, { Component } from "react";

import { EntityDecoratorProps, Icon, IconProp, Tooltip } from "../../src/index";

interface TooltipEntityProps extends EntityDecoratorProps {
  icon: IconProp;
  label: string;
}

interface TooltipEntityState {
  showTooltipAt: DOMRect | null;
}

class TooltipEntity extends Component<TooltipEntityProps, TooltipEntityState> {
  constructor(props: TooltipEntityProps) {
    super(props);

    this.state = {
      showTooltipAt: null,
    };

    this.openTooltip = this.openTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
  }

  openTooltip(e: React.MouseEvent<HTMLAnchorElement>) {
    const trigger = e.target;

    if (trigger instanceof Element) {
      this.setState({ showTooltipAt: trigger.getBoundingClientRect() });
    }
  }

  closeTooltip() {
    this.setState({ showTooltipAt: null });
  }

  render() {
    const { entityKey, contentState, children, onEdit, onRemove, icon, label } =
      this.props;
    const { showTooltipAt } = this.state;
    const { url } = contentState.getEntity(entityKey).getData();

    // Contrary to what JSX A11Y says, this should be a button but it shouldn't be focusable.
    /* eslint-disable jsx-a11y/interactive-supports-focus, jsx-a11y/anchor-is-valid */
    return (
      <a role="button" onMouseUp={this.openTooltip} className="TooltipEntity">
        <Icon icon={icon} className="TooltipEntity__icon" />
        <span className="TooltipEntity__text">{children}</span>
        <Tooltip
          shouldOpen={Boolean(showTooltipAt)}
          onHide={() => this.setState({ showTooltipAt: null })}
          getTargetPosition={(editorRect) => {
            if (!showTooltipAt) {
              return null;
            }

            return {
              left: showTooltipAt.left - editorRect.left,
              top: 0,
            };
          }}
          content={
            <div className="Draftail-InlineToolbar" role="toolbar">
              <a
                href={url}
                title={url}
                target="_blank"
                rel="noreferrer"
                className="Draftail-ToolbarButton"
              >
                {label}
              </a>

              <button
                type="button"
                className="Draftail-ToolbarButton"
                onClick={onEdit.bind(null, entityKey)}
              >
                Edit
              </button>

              <button
                type="button"
                className="Draftail-ToolbarButton"
                onClick={() => onRemove(entityKey)}
              >
                Remove
              </button>
            </div>
          }
        />
      </a>
    );
  }
}

export default TooltipEntity;
