import PropTypes from 'prop-types';
import React from 'react';

import Icon from '../components/Icon';

const onMouseDown = (onClick, e) => {
    e.preventDefault();

    onClick();
};

const Button = ({ active, label, title, icon, onClick }) => (
    <button
        className={`RichEditor-styleButton${active ? ' RichEditor-activeButton' : ''}`}
        type="button"
        title={title}
        onMouseDown={onMouseDown.bind(null, onClick)}
    >
        {icon ? (
            <Icon name={icon} />
        ) : null}
        {label}
    </button>
);

Button.propTypes = {
    active: PropTypes.bool,
    label: PropTypes.string,
    title: PropTypes.string,
    icon: PropTypes.string,
    onClick: PropTypes.func,
};

Button.defaultProps = {
    active: false,
    label: null,
    title: null,
    icon: null,
    onClick: () => {},
};

export default Button;
