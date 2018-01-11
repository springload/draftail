import PropTypes from 'prop-types';
import React, { Component } from 'react';

import Icon from '../components/Icon';

/**
 * Displays a basic button, with optional active variant,
 * enriched with a tooltip. The tooltip stops showing on click.
 */
class ToolbarButton extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTooltipOnHover: true,
        };

        this.onMouseDown = this.onMouseDown.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    onMouseDown(e) {
        const { onClick } = this.props;

        e.preventDefault();

        this.setState({
            showTooltipOnHover: false,
        });

        onClick();
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
                    active ? ' Draftail-ToolbarButton--active' : ''
                }`}
                type="button"
                aria-label={title || null}
                data-draftail-balloon={
                    title && showTooltipOnHover ? true : null
                }
                tabIndex={-1}
                onMouseDown={this.onMouseDown}
                onMouseLeave={this.onMouseLeave}
            >
                {icon ? <Icon icon={icon} /> : null}
                {label}
            </button>
        );
    }
}

ToolbarButton.propTypes = {
    name: PropTypes.string,
    active: PropTypes.bool,
    label: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.node,
    ]),
    onClick: PropTypes.func,
};

ToolbarButton.defaultProps = {
    name: null,
    active: false,
    label: null,
    title: null,
    icon: null,
    onClick: () => {},
};

export default ToolbarButton;
