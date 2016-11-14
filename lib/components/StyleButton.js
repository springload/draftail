import React from 'react';

// TODO Document, convert to stateless component.
class StyleButton extends React.Component {
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

StyleButton.propTypes = {
    label: React.PropTypes.string.isRequired,
    onToggle: React.PropTypes.func.isRequired,
    style: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string,
    active: React.PropTypes.bool,
};

export default StyleButton;
