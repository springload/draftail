import React, { PureComponent } from "react";
import Icon, { IconProp } from "../Icon";

type Props = {
  name: string | null | undefined;
  active: boolean;
  label: string | null | undefined;
  title: string | null | undefined;
  icon: IconProp | null | undefined;
  onClick: ((arg0: string) => void) | null | undefined;
};

type State = {
  showTooltipOnHover: boolean;
};
/**
 * Displays a basic button, with optional active variant,
 * enriched with a tooltip. The tooltip stops showing on click.
 */
class ToolbarButton extends PureComponent<Props, State> {
  static defaultProps: Props;

  constructor(props: Props) {
    super(props);

    this.state = {
      showTooltipOnHover: true,
    };

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseDown(e: Event) {
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
        aria-label={title || null}
        data-draftail-balloon={title && showTooltipOnHover ? true : null}
        tabIndex={-1}
        onMouseDown={this.onMouseDown}
        onMouseLeave={this.onMouseLeave}
      >
        {typeof icon !== "undefined" && icon !== null ? (
          <Icon icon={icon} />
        ) : null}
        {label ? (
          <span className="Draftail-ToolbarButton__label">{label}</span>
        ) : null}
      </button>
    );
  }
}

ToolbarButton.defaultProps = {
  name: null,
  active: false,
  label: null,
  title: null,
  icon: null,
  onClick: null,
};

export default ToolbarButton;
