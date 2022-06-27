import React, { PureComponent } from "react";
import { IconProp } from "../../api/types";
import Icon from "../Icon";

export interface ToolbarButtonProps {
  name?: string;
  active?: boolean;
  label?: string | null;
  title?: string | null;
  icon?: IconProp | null;
  onClick?: ((name: string) => void) | null;
}

interface ToolbarButtonState {
  showTooltipOnHover: boolean;
}
/**
 * Displays a basic button, with optional active variant,
 * enriched with a tooltip. The tooltip stops showing on click.
 */
class ToolbarButton extends PureComponent<
  ToolbarButtonProps,
  ToolbarButtonState
> {
  constructor(props: ToolbarButtonProps) {
    super(props);

    this.state = {
      showTooltipOnHover: true,
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseDown(e: React.MouseEvent<HTMLButtonElement>) {
    const { name, onClick } = this.props;

    e.preventDefault();

    this.setState({
      showTooltipOnHover: false,
    });

    if (onClick) {
      onClick(name || "");
    }
  }

  onMouseLeave() {
    this.setState({
      showTooltipOnHover: true,
    });
  }

  render() {
    const { name, active, label, title, icon } = this.props;
    const { showTooltipOnHover } = this.state;

    return (
      <button
        name={name}
        className={`Draftail-ToolbarButton${
          active ? " Draftail-ToolbarButton--active" : ""
        }`}
        type="button"
        aria-label={title || undefined}
        data-draftail-balloon={title && showTooltipOnHover ? true : null}
        tabIndex={-1}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.onMouseLeave}
      >
        {icon ? <Icon icon={icon} /> : null}
        {label ? (
          <span className="Draftail-ToolbarButton__label">{label}</span>
        ) : null}
      </button>
    );
  }
}

export default ToolbarButton;
