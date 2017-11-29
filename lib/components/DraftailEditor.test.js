import React from 'react';
import { shallow, mount } from 'enzyme';
import { Editor, convertFromRaw, EditorState, RichUtils } from 'draft-js';

import behavior from '../api/behavior';
import DraftUtils from '../api/DraftUtils';
import MediaBlock from '../blocks/MediaBlock';
import DividerBlock from '../blocks/DividerBlock';
import DraftailEditor from '../components/DraftailEditor';

describe('DraftailEditor', () => {
    it('empty', () => {
        expect(shallow(<DraftailEditor />)).toBeDefined();
    });

    it('editorRef', () => {
        expect(mount(<DraftailEditor />).instance().editorRef).toBeDefined();
    });

    it('#readOnly', () => {
        expect(
            shallow(<DraftailEditor />)
                .setState({
                    readOnly: true,
                })
                .hasClass('editor--readonly'),
        ).toBeTruthy();
    });

    describe('#placeholder', () => {
        it('visible', () => {
            expect(
                shallow(<DraftailEditor placeholder="Write here…" />)
                    .find(Editor)
                    .prop('placeholder'),
            ).toEqual('Write here…');
        });

        it('hidden', () => {
            expect(
                shallow(
                    <DraftailEditor
                        placeholder="Write here…"
                        rawContentState={{
                            entityMap: {},
                            blocks: [
                                {
                                    key: 'b3kdk',
                                    text: 'test',
                                    type: 'header-two',
                                    depth: 0,
                                    inlineStyleRanges: [],
                                    entityRanges: [],
                                    data: {},
                                },
                            ],
                        }}
                    />,
                )
                    .find('div')
                    .prop('className'),
            ).toContain('editor--hide-placeholder');
        });
    });

    it('#spellCheck', () => {
        expect(
            shallow(<DraftailEditor spellCheck={true} />)
                .find(Editor)
                .prop('spellCheck'),
        ).toEqual(true);
    });

    it('#onSave', () => {
        const onSave = jest.fn();
        const wrapper = shallow(<DraftailEditor onSave={onSave} />);

        wrapper.instance().saveState();

        expect(onSave).toHaveBeenCalled();

        shallow(<DraftailEditor />)
            .instance()
            .saveState();
    });

    it('readOnly', () => {
        const onSave = jest.fn();
        const wrapper = shallow(<DraftailEditor onSave={onSave} />);

        wrapper.instance().toggleEditor(true);
        expect(wrapper.state('readOnly')).toBe(true);
        wrapper.instance().toggleEditor(false);
        expect(wrapper.state('readOnly')).toBe(false);
    });

    describe('handleReturn', () => {
        it('default', () => {
            jest
                .spyOn(DraftUtils, 'handleNewLine')
                .mockImplementation(editorState => editorState);
            const wrapper = shallow(<DraftailEditor />);

            expect(
                wrapper.instance().handleReturn({
                    keyCode: 13,
                }),
            ).toBe(true);

            DraftUtils.handleNewLine.mockRestore();
        });
        it('enabled br', () => {
            const wrapper = shallow(<DraftailEditor enableLineBreak />);

            expect(
                wrapper.instance().handleReturn({
                    keyCode: 13,
                }),
            ).toBe(false);
        });
        it('alt + enter on text', () => {
            const wrapper = shallow(<DraftailEditor />);

            expect(
                wrapper.instance().handleReturn({
                    altKey: true,
                }),
            ).toBe(true);
        });
        it('alt + enter on entity without url', () => {
            const wrapper = shallow(
                <DraftailEditor
                    rawContentState={{
                        entityMap: {
                            '1': {
                                type: 'LINK',
                                mutability: 'IMMUTABLE',
                                data: {
                                    url: 'test',
                                },
                            },
                            '2': {
                                type: 'LINK',
                                mutability: 'IMMUTABLE',
                                data: {},
                            },
                        },
                        blocks: [
                            {
                                key: 'b3kdk',
                                text: 'test',
                                type: 'unstyled',
                                depth: 0,
                                inlineStyleRanges: [],
                                entityRanges: [
                                    {
                                        offset: 0,
                                        length: 4,
                                        key: 2,
                                    },
                                ],
                                data: {},
                            },
                        ],
                    }}
                />,
            );

            expect(
                wrapper.instance().handleReturn({
                    altKey: true,
                }),
            ).toBe(true);
        });

        it('alt + enter on entity', () => {
            jest.spyOn(window, 'open');
            const wrapper = shallow(
                <DraftailEditor
                    rawContentState={{
                        entityMap: {
                            '1': {
                                type: 'LINK',
                                mutability: 'IMMUTABLE',
                                data: {
                                    url: 'test',
                                },
                            },
                        },
                        blocks: [
                            {
                                key: 'b3kdk',
                                text: 'test',
                                type: 'unstyled',
                                depth: 0,
                                inlineStyleRanges: [],
                                entityRanges: [
                                    {
                                        offset: 0,
                                        length: 4,
                                        key: 1,
                                    },
                                ],
                                data: {},
                            },
                        ],
                    }}
                />,
            );

            expect(
                wrapper.instance().handleReturn({
                    altKey: true,
                }),
            ).toBe(true);
            expect(window.open).toHaveBeenCalled();

            window.open.mockRestore();
        });
    });

    it('onFocus, onBlur', () => {
        const wrapper = shallow(<DraftailEditor />);

        expect(wrapper.state('hasFocus')).toBe(false);

        wrapper.instance().onFocus();

        expect(wrapper.state('hasFocus')).toBe(true);

        wrapper.instance().onBlur();

        expect(wrapper.state('hasFocus')).toBe(false);
    });

    it('onTab', () => {
        jest.spyOn(RichUtils, 'onTab');

        expect(
            shallow(<DraftailEditor />)
                .instance()
                .onTab(),
        ).toBe(true);

        expect(RichUtils.onTab).toHaveBeenCalled();

        RichUtils.onTab.mockRestore();
    });

    it('onMouseUp', () => {
        const wrapper = shallow(<DraftailEditor />);
        wrapper.instance().onMouseUp({
            target: {
                closest: () => false,
            },
        });

        expect(wrapper.state('shouldShowTooltip')).toBe(false);
    });

    it('onKeyUp', () => {
        const wrapper = shallow(<DraftailEditor />);
        wrapper.instance().onKeyUp();

        expect(wrapper.state('shouldShowTooltip')).toBe(false);
    });

    describe('handleKeyCommand', () => {
        it('draftjs internal, handled', () => {
            RichUtils.handleKeyCommand = jest.fn(editorState => editorState);

            expect(
                shallow(<DraftailEditor />)
                    .instance()
                    .handleKeyCommand('backspace'),
            ).toBe(true);

            RichUtils.handleKeyCommand.mockRestore();
        });

        it('draftjs internal, not handled', () => {
            RichUtils.handleKeyCommand = jest.fn(() => false);

            expect(
                shallow(<DraftailEditor />)
                    .instance()
                    .handleKeyCommand('backspace'),
            ).toBe(false);

            RichUtils.handleKeyCommand.mockRestore();
        });

        it('entity type', () => {
            expect(
                shallow(<DraftailEditor />)
                    .instance()
                    .handleKeyCommand('LINK'),
            ).toBe(true);
        });

        it('block type', () => {
            expect(
                shallow(<DraftailEditor />)
                    .instance()
                    .handleKeyCommand('header-one'),
            ).toBe(true);
        });

        it('inline style', () => {
            expect(
                shallow(<DraftailEditor />)
                    .instance()
                    .handleKeyCommand('BOLD'),
            ).toBe(true);
        });
    });

    describe('handleBeforeInput', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(<DraftailEditor enableHorizontalRule />);

            jest.spyOn(DraftUtils, 'hasNoSelectionStartEntity');
            jest.spyOn(DraftUtils, 'insertTextWithoutEntity');
            jest.spyOn(DraftUtils, 'resetBlockWithType');
            jest.spyOn(DraftUtils, 'addHorizontalRuleRemovingSelection');
            jest.spyOn(behavior, 'handleBeforeInputBlockType');
            jest.spyOn(behavior, 'handleBeforeInputHR');

            jest.spyOn(wrapper.instance(), 'onChange');
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('non-collapsed selection', () => {
            // Monkey-patching the one method. A bit dirty.
            wrapper.setState({
                editorState: Object.assign(wrapper.state('editorState'), {
                    getSelection: () => ({
                        isCollapsed: () => false,
                    }),
                }),
            });
            expect(wrapper.instance().handleBeforeInput('a')).toBe(
                'not-handled',
            );
            expect(wrapper.instance().onChange).not.toHaveBeenCalled();
        });

        it('no matching processing', () => {
            DraftUtils.hasNoSelectionStartEntity = jest.fn(() => false);
            expect(wrapper.instance().handleBeforeInput('a')).toBe(
                'not-handled',
            );
            expect(wrapper.instance().onChange).not.toHaveBeenCalled();
            expect(DraftUtils.insertTextWithoutEntity).not.toHaveBeenCalled();
        });

        it('enter text', () => {
            expect(wrapper.instance().handleBeforeInput('a')).toBe('handled');
            expect(wrapper.instance().onChange).toHaveBeenCalled();
            expect(DraftUtils.insertTextWithoutEntity).toHaveBeenCalled();
        });

        it('change block type', () => {
            behavior.handleBeforeInputBlockType = jest.fn(() => 'header-one');
            expect(wrapper.instance().handleBeforeInput(' ')).toBe('handled');
            expect(wrapper.instance().onChange).toHaveBeenCalled();
            expect(DraftUtils.resetBlockWithType).toHaveBeenCalled();
        });

        it('enter hr', () => {
            behavior.handleBeforeInputHR = jest.fn(() => true);
            expect(wrapper.instance().handleBeforeInput('-')).toBe('handled');
            expect(wrapper.instance().onChange).toHaveBeenCalled();
            expect(
                DraftUtils.addHorizontalRuleRemovingSelection,
            ).toHaveBeenCalled();
        });
    });

    describe('toggleBlockType', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(<DraftailEditor />);

            jest.spyOn(RichUtils, 'toggleBlockType');
            jest.spyOn(wrapper.instance(), 'onChange');
        });

        afterEach(() => {
            RichUtils.toggleBlockType.mockRestore();
        });

        it('works', () => {
            wrapper.instance().toggleBlockType('header-one');

            expect(RichUtils.toggleBlockType).toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });
    });

    describe('toggleInlineStyle', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(<DraftailEditor />);

            jest.spyOn(RichUtils, 'toggleInlineStyle');
            jest.spyOn(wrapper.instance(), 'onChange');
        });

        afterEach(() => {
            RichUtils.toggleInlineStyle.mockRestore();
        });

        it('works', () => {
            wrapper.instance().toggleInlineStyle('BOLD');

            expect(RichUtils.toggleInlineStyle).toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });
    });

    describe('onEditEntity', () => {
        let wrapper;

        beforeEach(() => {
            const rawContentState = {
                entityMap: {
                    '1': {
                        type: 'LINK',
                        mutability: 'IMMUTABLE',
                        data: {
                            url: 'test',
                        },
                    },
                },
                blocks: [
                    {
                        key: 'b3kdk',
                        text: 'test',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 4,
                                key: 1,
                            },
                        ],
                        data: {},
                    },
                ],
            };
            wrapper = shallow(
                <DraftailEditor rawContentState={rawContentState} />,
            );

            jest
                .spyOn(DraftUtils, 'getEntitySelection')
                .mockImplementation(editorState => editorState.getSelection());
            jest.spyOn(wrapper.instance(), 'toggleDialog');
        });

        afterEach(() => {
            DraftUtils.getEntitySelection.mockRestore();
        });

        it('works', () => {
            wrapper.instance().onEditEntity('1');

            expect(wrapper.instance().toggleDialog).toHaveBeenCalled();
        });
    });

    describe('onRemoveEntity', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(<DraftailEditor />);

            RichUtils.toggleLink = jest.fn();
            DraftUtils.getEntitySelection = jest.fn();
            wrapper.instance().onChange = jest.fn();
        });

        afterEach(() => {
            RichUtils.toggleLink.mockRestore();
            DraftUtils.getEntitySelection.mockRestore();
        });

        it('works', () => {
            wrapper.instance().onRemoveEntity();

            expect(RichUtils.toggleLink).toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });
    });

    describe('addHR', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(<DraftailEditor />);

            jest.spyOn(DraftUtils, 'addHorizontalRuleRemovingSelection');
            jest.spyOn(wrapper.instance(), 'onChange');
        });

        afterEach(() => {
            DraftUtils.addHorizontalRuleRemovingSelection.mockRestore();
        });

        it('works', () => {
            wrapper.instance().addHR();

            expect(
                DraftUtils.addHorizontalRuleRemovingSelection,
            ).toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });
    });

    describe('addBR', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(<DraftailEditor />);

            jest.spyOn(DraftUtils, 'addLineBreakRemovingSelection');
            jest.spyOn(wrapper.instance(), 'onChange');
        });

        afterEach(() => {
            DraftUtils.addLineBreakRemovingSelection.mockRestore();
        });

        it('works', () => {
            wrapper.instance().addBR();

            expect(DraftUtils.addLineBreakRemovingSelection).toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });
    });

    describe('onUndoRedo', () => {
        let wrapper;

        beforeEach(() => {
            jest.spyOn(EditorState, 'undo');
            jest.spyOn(EditorState, 'redo');

            wrapper = shallow(<DraftailEditor />);
            jest.spyOn(wrapper.instance(), 'onChange');
        });

        afterEach(() => {
            EditorState.undo.mockRestore();
            EditorState.redo.mockRestore();
        });

        it('undo', () => {
            wrapper.instance().onUndoRedo('undo');

            expect(EditorState.undo).toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });

        it('redo', () => {
            wrapper.instance().onUndoRedo('redo');

            expect(EditorState.redo).toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });

        it('invalid', () => {
            wrapper.instance().onUndoRedo('invalid');

            expect(EditorState.undo).not.toHaveBeenCalled();
            expect(EditorState.redo).not.toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });
    });

    describe('blockRenderer', () => {
        it('default', () => {
            expect(
                shallow(<DraftailEditor />)
                    .instance()
                    .blockRenderer({
                        getType: () => 'test',
                    }),
            ).toBe(null);
        });

        it('ATOMIC', () => {
            const rawContentState = {
                entityMap: {
                    '0': {
                        type: 'IMAGE',
                        mutability: 'IMMUTABLE',
                        data: {},
                    },
                },
                blocks: [
                    {
                        key: 'b3kdk',
                        text: ' ',
                        type: 'atomic',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 0,
                            },
                        ],
                        data: {},
                    },
                ],
            };
            const wrapper = shallow(
                <DraftailEditor
                    rawContentState={rawContentState}
                    entityTypes={[
                        {
                            type: 'IMAGE',
                            source: () => {},
                            decorator: () => {},
                        },
                    ]}
                />,
            );

            const contentState = convertFromRaw(rawContentState);

            expect(
                wrapper.instance().blockRenderer(contentState.getFirstBlock()),
            ).toMatchObject({
                component: MediaBlock,
                props: {
                    entityConfig: { type: 'IMAGE' },
                },
            });
        });

        it('HORIZONTAL_RULE', () => {
            const rawContentState = {
                entityMap: {
                    '0': {
                        type: 'HORIZONTAL_RULE',
                        mutability: 'IMMUTABLE',
                        data: {},
                    },
                },
                blocks: [
                    {
                        key: 'b3kdk',
                        text: ' ',
                        type: 'atomic',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 0,
                            },
                        ],
                        data: {},
                    },
                ],
            };
            const wrapper = shallow(
                <DraftailEditor rawContentState={rawContentState} />,
            );

            const contentState = convertFromRaw(rawContentState);

            expect(
                wrapper.instance().blockRenderer(contentState.getFirstBlock()),
            ).toMatchObject({
                component: DividerBlock,
            });
        });
    });

    describe('dialog', () => {
        describe('onRequestDialog', () => {
            it('empty', () => {
                const wrapper = shallow(<DraftailEditor />);

                wrapper.instance().onRequestDialog('LINK');

                expect(wrapper.state()).toMatchObject({
                    readOnly: true,
                    dialogOptions: {
                        entityConfig: undefined,
                    },
                });
            });

            it('with dialogOptions', () => {
                const source = () => <blockquote />;
                const wrapper = shallow(
                    <DraftailEditor entityTypes={[{ type: 'LINK', source }]} />,
                );

                wrapper.instance().onRequestDialog('LINK');

                expect(wrapper.state()).toMatchObject({
                    readOnly: true,
                    dialogOptions: {
                        entityConfig: {
                            type: 'LINK',
                            source,
                        },
                    },
                });
            });

            it('with entity', () => {
                const source = () => <blockquote />;
                const wrapper = shallow(
                    <DraftailEditor
                        entityTypes={[{ type: 'LINK', source }]}
                        rawContentState={{
                            entityMap: {
                                '0': {
                                    type: 'LINK',
                                    mutability: 'MUTABLE',
                                    data: {
                                        href: 'example.com',
                                    },
                                },
                            },
                            blocks: [
                                {
                                    key: 'b3kdk',
                                    text: 'test',
                                    type: 'unstyled',
                                    depth: 0,
                                    inlineStyleRanges: [],
                                    entityRanges: [
                                        {
                                            offset: 0,
                                            length: 4,
                                            key: 0,
                                        },
                                    ],
                                    data: {},
                                },
                            ],
                        }}
                    />,
                );

                wrapper.instance().onRequestDialog('LINK');

                expect(wrapper.state()).toMatchObject({
                    readOnly: true,
                    dialogOptions: {
                        entityConfig: {
                            type: 'LINK',
                            source,
                        },
                    },
                });
            });
        });

        describe('onDialogCOmplete', () => {
            beforeEach(() => {
                jest.useFakeTimers();
            });

            it('empty', () => {
                const wrapper = mount(<DraftailEditor />);

                wrapper.instance().onDialogComplete(null);

                expect(wrapper.state('dialogOptions')).toBe(null);
                jest.runOnlyPendingTimers();
                expect(wrapper.state('readOnly')).toBe(false);

                const focus = jest.fn();
                wrapper.instance().editorRef.focus = focus;
                jest.runOnlyPendingTimers();
                expect(focus).toHaveBeenCalled();
            });

            it('works', () => {
                const wrapper = shallow(<DraftailEditor />);

                wrapper
                    .instance()
                    .onDialogComplete(wrapper.state('editorState'));

                expect(wrapper.state('hasFocus')).toBe(false);
            });
        });
    });

    describe('tooltip', () => {
        describe('toggleTooltip', () => {
            it('on', () => {
                const wrapper = shallow(<DraftailEditor />);

                wrapper.instance().toggleTooltip(true);

                expect(wrapper.state('shouldShowTooltip')).toBe(true);
            });

            it('off', () => {
                const wrapper = shallow(<DraftailEditor />);

                wrapper.instance().toggleTooltip(false);

                expect(wrapper.state('shouldShowTooltip')).toBe(false);
            });
        });

        describe('renderTooltip', () => {
            it('works', () => {
                const wrapper = mount(
                    <DraftailEditor
                        rawContentState={{
                            entityMap: {
                                1: {
                                    type: 'LINK',
                                    mutability: 'MUTABLE',
                                    data: {
                                        href: 'example.com',
                                    },
                                },
                            },
                            blocks: [
                                {
                                    key: 'b3kdk',
                                    text: 'test',
                                    type: 'unstyled',
                                    depth: 0,
                                    inlineStyleRanges: [],
                                    entityRanges: [
                                        {
                                            offset: 0,
                                            length: 4,
                                            key: '1',
                                        },
                                    ],
                                    data: {},
                                },
                            ],
                        }}
                    />,
                );

                wrapper.instance().tooltip = {
                    offsetHeight: 0,
                    getBoundingClientRect: () => ({
                        top: 0,
                        left: 0,
                    }),
                    getAttribute: () => '1',
                };

                wrapper.instance().toggleTooltip(true);

                expect(document.body.innerHTML).toMatchSnapshot();
            });
        });
    });
});
