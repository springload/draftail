import React from 'react';
import { shallow } from 'enzyme';
import { EditorState } from 'draft-js';

import Toolbar from '../components/Toolbar';

const mockProps = {
    editorState: EditorState.createEmpty(),
    enableHorizontalRule: false,
    enableLineBreak: false,
    showUndoRedoControls: false,
    entityTypes: [],
    blockTypes: [],
    inlineStyles: [],
    toggleBlockType: () => {},
    toggleInlineStyle: () => {},
    addHR: () => {},
    addBR: () => {},
    onUndoRedo: () => {},
    onRequestDialog: () => {},
};

describe('Toolbar', () => {
    it('empty', () => {
        expect(shallow(<Toolbar {...mockProps} />)).toMatchSnapshot();
    });

    it('#enableHorizontalRule', () => {
        expect(
            shallow(<Toolbar {...mockProps} enableHorizontalRule={true} />),
        ).toMatchSnapshot();
    });

    it('#enableLineBreak', () => {
        expect(
            shallow(<Toolbar {...mockProps} enableLineBreak={true} />),
        ).toMatchSnapshot();
    });

    it('#showUndoRedoControls', () => {
        expect(
            shallow(<Toolbar {...mockProps} showUndoRedoControls={true} />),
        ).toMatchSnapshot();
    });

    it('#entityTypes', () => {
        expect(
            shallow(
                <Toolbar
                    {...mockProps}
                    entityTypes={[
                        { type: 'TEST_1', label: 'Test 1' },
                        { type: 'TEST_2', label: 'Test 2' },
                        { type: 'TEST_3', label: 'Test 3' },
                    ]}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('#blockTypes', () => {
        expect(
            shallow(
                <Toolbar
                    {...mockProps}
                    blockTypes={[
                        { type: 'TEST_1', label: 'Test 1' },
                        { type: 'TEST_2', label: 'Test 2' },
                        { type: 'TEST_3', label: 'Test 3' },
                    ]}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('#inlineStyles', () => {
        expect(
            shallow(
                <Toolbar
                    {...mockProps}
                    inlineStyles={[
                        { type: 'TEST_1', label: 'Test 1' },
                        { type: 'TEST_2', label: 'Test 2' },
                        { type: 'TEST_3', label: 'Test 3' },
                    ]}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('button label default', () => {
        const wrapper = shallow(
            <Toolbar {...mockProps} inlineStyles={[{ type: 'BOLD' }]} />,
        );
        expect(wrapper.find('ToolbarButton').prop('label')).toBe(null);
        expect(wrapper.find('ToolbarButton').prop('icon')).toBe('BOLD');
    });

    it('button label overrides', () => {
        const wrapper = shallow(
            <Toolbar
                {...mockProps}
                inlineStyles={[
                    {
                        type: 'BOLD',
                        label: 'Format as bold',
                        icon: '#icon-very-bold',
                    },
                ]}
            />,
        );
        expect(wrapper.find('ToolbarButton').prop('label')).toBe(
            'Format as bold',
        );
        expect(wrapper.find('ToolbarButton').prop('icon')).toBe(
            '#icon-very-bold',
        );
    });

    it('button titles with shortcut', () => {
        expect(
            shallow(
                <Toolbar
                    {...mockProps}
                    inlineStyles={[{ type: 'BOLD', description: null }]}
                />,
            )
                .find('ToolbarButton')
                .prop('title'),
        ).toBe('Ctrl+B');
    });

    it('button titles with shortcut and description', () => {
        expect(
            shallow(
                <Toolbar
                    {...mockProps}
                    inlineStyles={[{ type: 'BOLD', description: 'Bold' }]}
                />,
            )
                .find('ToolbarButton')
                .prop('title'),
        ).toBe('Bold\nCtrl+B');
    });
});
