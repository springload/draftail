import React from 'react';
import { shallow } from 'enzyme';
import { EditorState } from 'draft-js';

import Toolbar from '../components/Toolbar';

const mockProps = {
    editorState: EditorState.createEmpty(),
    enableHorizontalRule: false,
    enableLineBreak: false,
    showUndoControl: false,
    showRedoControl: false,
    entityTypes: [],
    blockTypes: [],
    inlineStyles: [],
    toggleBlockType: () => {},
    toggleInlineStyle: () => {},
    addHR: () => {},
    addBR: () => {},
    onUndoRedo: () => {},
    onRequestSource: () => {},
};

describe('Toolbar', () => {
    it('empty', () => {
        expect(shallow(<Toolbar {...mockProps} />)).toMatchSnapshot();
    });

    describe('#enableHorizontalRule', () => {
        it('works', () => {
            expect(
                shallow(<Toolbar {...mockProps} enableHorizontalRule={true} />),
            ).toMatchSnapshot();
        });

        it('control overrides', () => {
            expect(
                shallow(
                    <Toolbar
                        {...mockProps}
                        enableHorizontalRule={{
                            icon: '#icon-hr',
                            label: 'HR',
                            description: 'Horizontal rule',
                        }}
                    />,
                ),
            ).toMatchSnapshot();
        });
    });

    describe('#enableLineBreak', () => {
        it('works', () => {
            expect(
                shallow(<Toolbar {...mockProps} enableLineBreak={true} />),
            ).toMatchSnapshot();
        });

        it('control overrides', () => {
            expect(
                shallow(
                    <Toolbar
                        {...mockProps}
                        enableLineBreak={{
                            icon: '#icon-br',
                            label: 'BR',
                            description: 'Soft line break',
                        }}
                    />,
                ),
            ).toMatchSnapshot();
        });
    });

    describe('#showUndoControl', () => {
        it('works', () => {
            expect(
                shallow(<Toolbar {...mockProps} showUndoControl={true} />),
            ).toMatchSnapshot();
        });

        it('control overrides', () => {
            expect(
                shallow(
                    <Toolbar
                        {...mockProps}
                        showUndoControl={{
                            icon: '#icon-undo',
                            label: 'Undo',
                            description: 'Undo last change',
                        }}
                    />,
                ),
            ).toMatchSnapshot();
        });
    });

    describe('#showRedoControl', () => {
        it('works', () => {
            expect(
                shallow(<Toolbar {...mockProps} showRedoControl={true} />),
            ).toMatchSnapshot();
        });

        it('control overrides', () => {
            expect(
                shallow(
                    <Toolbar
                        {...mockProps}
                        showRedoControl={{
                            icon: '#icon-redo',
                            label: 'Redo',
                            description: 'Redo last change',
                        }}
                    />,
                ),
            ).toMatchSnapshot();
        });
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
        expect(wrapper.find('ToolbarButton').prop('label')).toBe('B');
    });

    it('button label with icon', () => {
        const wrapper = shallow(
            <Toolbar
                {...mockProps}
                inlineStyles={[{ type: 'BOLD', icon: '#icon-bold' }]}
            />,
        );
        expect(wrapper.find('ToolbarButton').prop('label')).toBe(null);
    });

    it('button label overrides', () => {
        const wrapper = shallow(
            <Toolbar
                {...mockProps}
                inlineStyles={[
                    {
                        type: 'BOLD',
                        label: 'Format as bold',
                    },
                ]}
            />,
        );
        expect(wrapper.find('ToolbarButton').prop('label')).toBe(
            'Format as bold',
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
        ).toBe('Ctrl + B');
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
        ).toBe('Bold\nCtrl + B');
    });
});
