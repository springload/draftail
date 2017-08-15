import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../components/Icon';

const onMouseDown = (onClick, e) => {
    e.preventDefault();

    onClick();
};

const Button = ({ name, active, label, title, icon, onClick }) =>
    <button
        name={name}
        className={`RichEditor-styleButton${active
            ? ' RichEditor-activeButton'
            : ''}`}
        type="button"
        title={title}
        onMouseDown={onMouseDown.bind(null, onClick)}
    >
        {icon ? <Icon name={icon} /> : null}
        {label}
    </button>;

Button.propTypes = {
    name: PropTypes.string,
    active: PropTypes.bool,
    label: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func,
};

Button.defaultProps = {
    name: null,
    active: false,
    label: null,
    title: null,
    icon: null,
    onClick: () => {},
};

export default Button;
