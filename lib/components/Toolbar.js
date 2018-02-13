import PropTypes from 'prop-types';
import React from 'react';

import ToolbarDefaults from '../components/ToolbarDefaults';
import ToolbarGroup from '../components/ToolbarGroup';

const Toolbar = props => {
    const { controls, getEditorState, onChange } = props;
    return (
        <div className="Draftail-Toolbar" role="toolbar">
            <ToolbarDefaults {...props} />

            <ToolbarGroup>
                {controls.map((Control, i) => (
                    <Control
                        // eslint-disable-next-line springload/react/no-array-index-key
                        key={i}
                        getEditorState={getEditorState}
                        onChange={onChange}
                    />
                ))}
            </ToolbarGroup>
        </div>
    );
};

Toolbar.propTypes = {
    controls: PropTypes.array.isRequired,
    getEditorState: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Toolbar;
