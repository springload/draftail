import React from 'react';

const Button = ({ icon, label, active, onClick }) => (
    <a
        href="#"
        className={`RichEditor-styleButton${active ? ' RichEditor-activeButton' : ''}${icon ? ` icon icon-${icon}` : ''}`}
        onClick={onClick}
    >
        {label}
    </a>
);

Button.propTypes = {
    label: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string,
    active: React.PropTypes.bool,
};

export default Button;
