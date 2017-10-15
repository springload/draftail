import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor, { INLINE_STYLE } from '../lib';

const mount = document.querySelector('[data-mount-all]');

const rawContentState = null;

const onSave = (contentState) => {
    sessionStorage.setItem('all:contentState', JSON.stringify(contentState));
};

const editor = (
    <DraftailEditor
        rawContentState={rawContentState}
        onSave={onSave}
        stripPastedStyles={false}
        inlineStyles={[
            { label: 'Mark', type: INLINE_STYLE.MARK },
            { label: 'Quotation', type: INLINE_STYLE.QUOTATION },
            { label: 'Small', type: INLINE_STYLE.SMALL },
            { label: 'Sample', type: INLINE_STYLE.SAMPLE },
            { label: 'Insert', type: INLINE_STYLE.INSERT },
            { label: 'Delete', type: INLINE_STYLE.DELETE },
            { label: 'Keyboard', type: INLINE_STYLE.KEYBOARD },
            { label: 'Subscript', type: INLINE_STYLE.SUBSCRIPT },
            { label: 'Superscript', type: INLINE_STYLE.SUPERSCRIPT },
        ]}
    />
);

ReactDOM.render(editor, mount);
