import React from 'react';
import ReactDOM from 'react-dom';

import DraftailEditor from '../lib';

const mount = document.querySelector('[data-mount-basic]');

const options = {
    modelPickerOptions: [],
    imageFormats: [],
    mediaControls: [],
    dialogControls: [],
    sources: [],
    decorators: [],
};

const editor = (
    <DraftailEditor name="basic" value="{}" options={options} />
);

ReactDOM.render(editor, mount);
