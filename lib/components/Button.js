import React from 'react';

const Button = ({ icon, label, onClick }) => {
    let className = 'RichEditor-styleButton';

    if (icon) {
        className += ` icon icon-${icon}`;
    }

    return (
        <span className={className} onClick={onClick}>
            {label}
        </span>
    );
};

Button.propTypes = {
    label: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string,
};

export default Button;
