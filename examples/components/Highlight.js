import PropTypes from 'prop-types';
import React from 'react';

const onCopy = (value) => {
    const hidden = document.createElement('textarea');
    hidden.value = value;
    document.body.appendChild(hidden);
    hidden.select();
    document.execCommand('copy');
    document.body.removeChild(hidden);
};

const Highlight = ({ value }) => (
    <pre style={{ position: 'relative' }}>
        <button
            type="button"
            onClick={onCopy.bind(null, value)}
            style={{ position: 'absolute', right: '1rem' }}
        >
            Copy
        </button>
        <code>{value}</code>
    </pre>
);

Highlight.propTypes = {
    value: PropTypes.string.isRequired,
};

export default Highlight;
