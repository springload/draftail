import { OrderedSet } from 'immutable';
import React from 'react';
import { shallow } from 'enzyme';

import Toolbar from '../components/Toolbar';

const mockProps = {
    currentStyles: new OrderedSet(),
    currentBlock: 'unstyled',
    enableHorizontalRule: false,
    enableLineBreak: false,
    showUndoControl: false,
    showRedoControl: false,
    entityTypes: [],
    blockTypes: [],
    inlineStyles: [],
    controls: [],
    toggleBlockType: () => {},
    toggleInlineStyle: () => {},
    addHR: () => {},
    addBR: () => {},
    onUndoRedo: () => {},
    onRequestSource: () => {},
    getEditorState: () => {},
    onChange: () => {},
};

describe('Toolbar', () => {
    it('empty', () => {
        expect(shallow(<Toolbar {...mockProps} />)).toMatchSnapshot();
    });

    it('#controls', () => {
        expect(
            shallow(
                <Toolbar {...mockProps} controls={[() => <span>Test</span>]} />,
            ),
        ).toMatchSnapshot();
    });
});
