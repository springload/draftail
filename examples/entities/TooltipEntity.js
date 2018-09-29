import PropTypes from "prop-types";
import React, { Component } from "react";

import { Icon } from "../../lib";

import Tooltip from "../components/Tooltip";
import Portal from "../components/Portal";

class TooltipEntity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTooltipAt: null,
    };

    this.openTooltip = this.openTooltip.bind(this);
    this.closeTooltip = this.closeTooltip.bind(this);
  }

  openTooltip(e) {
    const trigger = e.target;
    this.setState({ showTooltipAt: trigger.getBoundingClientRect() });
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
      icon,
      label,
    } = this.props;
    const { showTooltipAt } = this.state;
    const { url } = contentState.getEntity(entityKey).getData();

    // Contrary to what JSX A11Y says, this should be a button but it shouldn't be focusable.
    /* eslint-disable @thibaudcolas/cookbook/jsx-a11y/interactive-supports-focus, @thibaudcolas/cookbook/jsx-a11y/anchor-is-valid */
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
            <Tooltip target={showTooltipAt} direction="top">
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
                onClick={onRemove.bind(null, entityKey)}
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

TooltipEntity.propTypes = {
  // Key of the entity being decorated.
  entityKey: PropTypes.string.isRequired,
  // Full contentState, read-only.
  contentState: PropTypes.object.isRequired,
  // The decorated nodes / entity text.
  children: PropTypes.node.isRequired,
  // Call with the entityKey to trigger the entity source.
  onEdit: PropTypes.func.isRequired,
  // Call with the entityKey to remove the entity.
  onRemove: PropTypes.func.isRequired,
  icon: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.object.isRequired,
  ]).isRequired,
  label: PropTypes.string.isRequired,
};

export default TooltipEntity;
