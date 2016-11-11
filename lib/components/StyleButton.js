import React, { Component, PropTypes } from 'react';

// TODO Document, convert to stateless component.
class StyleButton extends Component {
    constructor() {
        super();
        this.onToggle = (e) => {
            e.preventDefault();
            this.props.onToggle(this.props.style);
        };
    }

    render() {
        const { active, icon, label } = this.props;

        let className = 'RichEditor-styleButton';

        if (active) {
            className += ' RichEditor-activeButton';
        }

        if (icon) {
            className += ` icon icon-${icon}`;
        }

        return (
            <span className={className} aria-pressed={active} onMouseDown={this.onToggle}>
                {label}
            </span>
        );
    }
}

export default StyleButton;
