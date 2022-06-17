import React, { PureComponent } from "react";
import { IconProp } from "../../api/types";
import Icon from "../Icon";

type Props = {
  name?: string;
  active?: boolean;
  label?: string;
  title?: string;
  icon?: IconProp | null;
  onClick?: ((name: string) => void) | null;
};

type State = {
  showTooltipOnHover: boolean;
};
/**
 * Displays a basic button, with optional active variant,
 * enriched with a tooltip. The tooltip stops showing on click.
 */
class ToolbarButton extends PureComponent<Props, State> {
  constructor(props: Props) {
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
        aria-label={title}
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
