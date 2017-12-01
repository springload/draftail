import PropTypes from 'prop-types';
import React from 'react';
import Prism from 'prismjs';

const onCopy = value => {
    const hidden = document.createElement('textarea');
    hidden.value = value;
    document.body.appendChild(hidden);
    hidden.select();
    document.execCommand('copy');
    document.body.removeChild(hidden);
};

const Highlight = ({ value, language }) => (
    <pre className={`language-${language}`} style={{ position: 'relative' }}>
        <button
            onClick={onCopy.bind(null, value)}
            style={{ position: 'absolute', right: '1rem' }}
        >
            Copy
        </button>
        <code
            // eslint-disable-next-line springload/react/no-danger
            dangerouslySetInnerHTML={{
                __html: Prism.highlight(value, Prism.languages[language]),
            }}
        />
    </pre>
);

Highlight.propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.oneOf(Object.keys(Prism.languages)).isRequired,
};

export default Highlight;
