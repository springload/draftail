import React from 'react';

const onMouseDown = (onClick, e) => {
    e.preventDefault();

    onClick();
};

const Button = ({ icon, label, active, onClick }) => (
    <button
        className={`RichEditor-styleButton${active ? ' RichEditor-activeButton' : ''}${icon ? ` icon icon-${icon}` : ''}`}
        onMouseDown={onMouseDown.bind(null, onClick)}
    >
        {label}
    </button>
);

Button.propTypes = {
    label: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func.isRequired,
    icon: React.PropTypes.string,
    active: React.PropTypes.bool,
};

Button.defaultProps = {
    icon: '',
    active: false,
};

export default Button;
