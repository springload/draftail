import React from 'react';

import Icon from '../components/Icon';

const onMouseDown = (onClick, e) => {
    e.preventDefault();

    onClick();
};

const Button = ({ icon, label, active, onClick }) => (
    <button
        className={`RichEditor-styleButton${active ? ' RichEditor-activeButton' : ''}`}
        type="button"
        onMouseDown={onMouseDown.bind(null, onClick)}
    >
        {icon ? (
            <Icon name={icon} />
        ) : null}
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
