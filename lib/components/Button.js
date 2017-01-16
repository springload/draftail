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
    label: React.PropTypes.string,
    onClick: React.PropTypes.func,
    icon: React.PropTypes.string,
    active: React.PropTypes.bool,
};

Button.defaultProps = {
    label: null,
    onClick: () => {},
    icon: null,
    active: false,
};

export default Button;
