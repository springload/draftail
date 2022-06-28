import React, { Component } from "react";

import { EntityDecoratorProps, Icon, IconProp } from "../../src/index";

import Tooltip, { Rect } from "../components/Tooltip";
import Portal from "../components/Portal";

interface TooltipEntityProps extends EntityDecoratorProps {
  icon: IconProp;
  label: string;
}

interface TooltipEntityState {
  showTooltipAt: Rect | null;
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
    const {
      entityKey,
      contentState,
      children,
      onEdit,
      onRemove,
      textDirectionality,
      icon,
      label,
    } = this.props;
    const { showTooltipAt } = this.state;
    const { url } = contentState.getEntity(entityKey).getData();

    // Contrary to what JSX A11Y says, this should be a button but it shouldn't be focusable.
    /* eslint-disable jsx-a11y/interactive-supports-focus, jsx-a11y/anchor-is-valid */
    return (
      <a role="button" onMouseUp={this.openTooltip} className="TooltipEntity">
        <Icon icon={icon} className="TooltipEntity__icon" />
        <span className="TooltipEntity__text">{children}</span>
        {showTooltipAt && (
          <Portal
            onClose={this.closeTooltip}
            closeOnClick
            closeOnType
            closeOnResize
          >
            <Tooltip
              target={showTooltipAt}
              direction="top"
              textDirectionality={textDirectionality}
            >
              <a
                href={url}
                title={url}
                target="_blank"
                rel="noopener noreferrer"
                className="Tooltip__link"
              >
                {label}
              </a>

              <button
                type="button"
                className="Tooltip__button"
                onClick={onEdit.bind(null, entityKey)}
              >
                Edit
              </button>

              <button
                type="button"
                className="Tooltip__button"
                onClick={() => onRemove(entityKey)}
              >
                Remove
              </button>
            </Tooltip>
          </Portal>
        )}
      </a>
    );
  }
}

export default TooltipEntity;
