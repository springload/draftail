import { OrderedSet } from 'immutable';
import React from 'react';
import { shallow, mount } from 'enzyme';
import {
    Editor,
    convertFromRaw,
    EditorState,
    SelectionState,
    ContentBlock,
    RichUtils,
} from 'draft-js';

import behavior from '../api/behavior';
import DraftUtils from '../api/DraftUtils';
import DividerBlock from '../blocks/DividerBlock';
import DraftailEditor from '../components/DraftailEditor';
import { ENTITY_TYPE } from '../api/constants';

jest.mock('draft-js/lib/generateRandomKey', () => () => 'a');

const shallowNoLifecycle = elt =>
    shallow(elt, { disableLifecycleMethods: true });

describe('DraftailEditor', () => {
    it('empty', () => {
        expect(shallowNoLifecycle(<DraftailEditor />)).toMatchSnapshot();
    });

    it('editorRef', () => {
        expect(mount(<DraftailEditor />).instance().editorRef).toBeDefined();
    });

    it('#readOnly', () => {
        expect(
            shallowNoLifecycle(<DraftailEditor />)
                .setState({
                    readOnly: true,
                })
                .hasClass('Draftail-Editor--readonly'),
        ).toBeTruthy();
    });

    describe('#placeholder', () => {
        it('visible', () => {
            expect(
                shallowNoLifecycle(<DraftailEditor placeholder="Write here…" />)
                    .find(Editor)
                    .prop('placeholder'),
            ).toEqual('Write here…');
        });

        it('hidden', () => {
            expect(
                shallowNoLifecycle(
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
            ).toContain('Draftail-Editor--hide-placeholder');
        });
    });

    it('#spellCheck', () => {
        expect(
            shallowNoLifecycle(<DraftailEditor spellCheck={true} />)
                .find(Editor)
                .prop('spellCheck'),
        ).toEqual(true);
    });

    it('#textAlignment', () => {
        expect(
            shallowNoLifecycle(<DraftailEditor textAlignment="left" />)
                .find(Editor)
                .prop('textAlignment'),
        ).toEqual('left');
    });

    it('#textDirectionality', () => {
        expect(
            shallowNoLifecycle(<DraftailEditor textDirectionality="RTL" />)
                .find(Editor)
                .prop('textDirectionality'),
        ).toEqual('RTL');
    });

    it('#autoCapitalize', () => {
        expect(
            shallowNoLifecycle(<DraftailEditor autoCapitalize="characters" />)
                .find(Editor)
                .prop('autoCapitalize'),
        ).toEqual('characters');
    });

    it('#autoComplete', () => {
        expect(
            shallowNoLifecycle(<DraftailEditor autoComplete="given-name" />)
                .find(Editor)
                .prop('autoComplete'),
        ).toEqual('given-name');
    });

    it('#autoCorrect', () => {
        expect(
            shallowNoLifecycle(<DraftailEditor autoCorrect="on" />)
                .find(Editor)
                .prop('autoCorrect'),
        ).toEqual('on');
    });

    it('#ariaDescribedBy', () => {
        expect(
            shallowNoLifecycle(<DraftailEditor ariaDescribedBy="test" />)
                .find(Editor)
                .prop('ariaDescribedBy'),
        ).toEqual('test');
    });

    it('#maxListNesting', () => {
        expect(
            shallowNoLifecycle(<DraftailEditor maxListNesting={6} />),
        ).toMatchSnapshot();
    });

    it('#onSave', () => {
        const onSave = jest.fn();
        const wrapper = shallowNoLifecycle(<DraftailEditor onSave={onSave} />);

        wrapper.instance().saveState();

        expect(onSave).toHaveBeenCalled();

        shallowNoLifecycle(<DraftailEditor />)
            .instance()
            .saveState();
    });

    it('readOnly', () => {
        const onSave = jest.fn();
        const wrapper = shallowNoLifecycle(<DraftailEditor onSave={onSave} />);

        wrapper.instance().toggleEditor(true);
        expect(wrapper.state('readOnly')).toBe(true);
        wrapper.instance().toggleEditor(false);
        expect(wrapper.state('readOnly')).toBe(false);
    });

    it('componentWillUnmount', () => {
        const wrapper = mount(<DraftailEditor />);
        const copySource = wrapper.instance().copySource;
        jest.spyOn(copySource, 'unregister');
        expect(copySource).not.toBeNull();
        wrapper.unmount();
        expect(copySource.unregister).toHaveBeenCalled();
    });

    describe('onChange', () => {
        beforeEach(() => {
            jest.spyOn(behavior, 'filterPaste').mockImplementation(
                (opt, editorState) => editorState,
            );
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('no filter when typing', () => {
            const wrapper = shallowNoLifecycle(
                <DraftailEditor stripPastedStyles={false} />,
            );

            const contentState = convertFromRaw({
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
            });

            const editorState = EditorState.push(
                EditorState.createEmpty(),
                contentState,
                'insert-characters',
            );

            wrapper.instance().onChange(editorState);

            expect(behavior.filterPaste).not.toHaveBeenCalled();
        });

        it('filter on paste', () => {
            const wrapper = shallowNoLifecycle(
                <DraftailEditor stripPastedStyles={false} />,
            );

            const contentState = convertFromRaw({
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
            });

            const editorState = EditorState.push(
                EditorState.createEmpty(),
                contentState,
                'insert-fragment',
            );

            wrapper.instance().onChange(editorState);

            expect(behavior.filterPaste).toHaveBeenCalled();
        });
    });

    it('getEditorState', () => {
        const wrapper = shallowNoLifecycle(<DraftailEditor />);

        expect(wrapper.instance().getEditorState()).toBeInstanceOf(EditorState);
    });

    describe('handleReturn', () => {
        it('default', () => {
            jest.spyOn(DraftUtils, 'handleNewLine').mockImplementation(
                editorState => editorState,
            );
            const wrapper = shallowNoLifecycle(<DraftailEditor />);

            expect(
                wrapper.instance().handleReturn({
                    keyCode: 13,
                }),
            ).toBe(true);

            DraftUtils.handleNewLine.mockRestore();
        });
        it('enabled br', () => {
            const wrapper = shallowNoLifecycle(
                <DraftailEditor enableLineBreak />,
            );

            expect(
                wrapper.instance().handleReturn({
                    keyCode: 13,
                }),
            ).toBe(false);
        });
        it('alt + enter on text', () => {
            const wrapper = shallowNoLifecycle(<DraftailEditor />);

            expect(
                wrapper.instance().handleReturn({
                    altKey: true,
                }),
            ).toBe(true);
        });
        it('alt + enter on entity without url', () => {
            const wrapper = shallowNoLifecycle(
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
            const wrapper = shallowNoLifecycle(
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
        const wrapper = shallowNoLifecycle(<DraftailEditor />);

        expect(wrapper.state('hasFocus')).toBe(false);

        wrapper.instance().onFocus();

        expect(wrapper.state('hasFocus')).toBe(true);

        wrapper.instance().onBlur();

        expect(wrapper.state('hasFocus')).toBe(false);
    });

    it('onTab', () => {
        jest.spyOn(RichUtils, 'onTab');

        expect(
            shallowNoLifecycle(<DraftailEditor />)
                .instance()
                .onTab(),
        ).toBe(true);

        expect(RichUtils.onTab).toHaveBeenCalled();

        RichUtils.onTab.mockRestore();
    });

    describe('handleKeyCommand', () => {
        it('draftjs internal, handled', () => {
            RichUtils.handleKeyCommand = jest.fn(editorState => editorState);

            expect(
                shallowNoLifecycle(<DraftailEditor />)
                    .instance()
                    .handleKeyCommand('backspace'),
            ).toBe(true);

            RichUtils.handleKeyCommand.mockRestore();
        });

        it('draftjs internal, not handled', () => {
            RichUtils.handleKeyCommand = jest.fn(() => false);

            expect(
                shallowNoLifecycle(<DraftailEditor />)
                    .instance()
                    .handleKeyCommand('backspace'),
            ).toBe(false);

            RichUtils.handleKeyCommand.mockRestore();
        });

        it('entity type', () => {
            expect(
                shallowNoLifecycle(<DraftailEditor />)
                    .instance()
                    .handleKeyCommand('LINK'),
            ).toBe(true);
        });

        it('block type', () => {
            expect(
                shallowNoLifecycle(<DraftailEditor />)
                    .instance()
                    .handleKeyCommand('header-one'),
            ).toBe(true);
        });

        it('inline style', () => {
            expect(
                shallowNoLifecycle(<DraftailEditor />)
                    .instance()
                    .handleKeyCommand('BOLD'),
            ).toBe(true);
        });

        describe('delete', () => {
            it('handled', () => {
                jest.spyOn(DraftUtils, 'handleDeleteAtomic').mockImplementation(
                    e => e,
                );

                expect(
                    shallowNoLifecycle(<DraftailEditor />)
                        .instance()
                        .handleKeyCommand('delete'),
                ).toBe(true);
                expect(DraftUtils.handleDeleteAtomic).toHaveBeenCalled();

                DraftUtils.handleDeleteAtomic.mockRestore();
            });

            it('not handled', () => {
                jest.spyOn(DraftUtils, 'handleDeleteAtomic');

                expect(
                    shallowNoLifecycle(<DraftailEditor />)
                        .instance()
                        .handleKeyCommand('delete'),
                ).toBe(false);
                expect(DraftUtils.handleDeleteAtomic).toHaveBeenCalled();

                DraftUtils.handleDeleteAtomic.mockRestore();
            });
        });
    });

    describe('handleBeforeInput', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallowNoLifecycle(
                <DraftailEditor enableHorizontalRule />,
            );

            jest.spyOn(DraftUtils, 'resetBlockWithType');
            jest.spyOn(DraftUtils, 'getSelectedBlock').mockImplementation(
                () => new ContentBlock(),
            );
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
            const selection = new SelectionState();
            selection.isCollapsed = () => false;
            wrapper.setState({
                editorState: Object.assign(wrapper.state('editorState'), {
                    getSelection: () => selection,
                    getCurrentInlineStyle: () => new OrderedSet(),
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
        });

        it('enter text', () => {
            expect(wrapper.instance().handleBeforeInput('a')).toBe(
                'not-handled',
            );
        });

        it('change block type', () => {
            behavior.handleBeforeInputBlockType = jest.fn(() => 'header-one');
            expect(wrapper.instance().handleBeforeInput(' ')).toBe('handled');
            expect(wrapper.instance().onChange).toHaveBeenCalled();
            expect(DraftUtils.resetBlockWithType).toHaveBeenCalled();
        });

        it('enter hr', () => {
            wrapper.instance().render = () => {};
            behavior.handleBeforeInputHR = jest.fn(() => true);
            DraftUtils.shouldHidePlaceholder = jest.fn(() => true);
            expect(wrapper.instance().handleBeforeInput('-')).toBe('handled');
            expect(wrapper.instance().onChange).toHaveBeenCalled();
            expect(
                DraftUtils.addHorizontalRuleRemovingSelection,
            ).toHaveBeenCalled();
            DraftUtils.shouldHidePlaceholder.mockRestore();
        });
    });

    describe('handlePastedText', () => {
        it('default handling', () => {
            const wrapper = mount(<DraftailEditor stripPastedStyles={false} />);

            expect(
                wrapper
                    .instance()
                    .handlePastedText(
                        'this is plain text paste',
                        'this is plain text paste',
                        wrapper.state('editorState'),
                    ),
            ).toBe(false);
        });

        it('stripPastedStyles', () => {
            const wrapper = mount(<DraftailEditor stripPastedStyles={true} />);

            expect(
                wrapper
                    .instance()
                    .handlePastedText(
                        'bold',
                        '<p><strong>bold</strong></p>',
                        wrapper.state('editorState'),
                    ),
            ).toBe(false);
        });

        it('handled by handleDraftEditorPastedText', () => {
            const wrapper = mount(<DraftailEditor stripPastedStyles={false} />);
            const text = 'hello,\nworld!';
            const content = {
                blocks: [
                    {
                        data: {},
                        depth: 0,
                        entityRanges: [],
                        inlineStyleRanges: [],
                        key: 'a',
                        text: text,
                        type: 'unstyled',
                    },
                ],
                entityMap: {},
            };
            const html = `<div data-draftjs-conductor-fragment='${JSON.stringify(
                content,
            )}'><p>${text}</p></div>`;

            expect(
                wrapper
                    .instance()
                    .handlePastedText(text, html, wrapper.state('editorState')),
            ).toBe(true);
        });
    });

    describe('toggleBlockType', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallowNoLifecycle(<DraftailEditor />);

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
            wrapper = shallowNoLifecycle(<DraftailEditor />);

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

        beforeEach(() => {
            jest.spyOn(DraftUtils, 'getEntitySelection').mockImplementation(
                editorState => editorState.getSelection(),
            );
        });

        afterEach(() => {
            DraftUtils.getEntitySelection.mockRestore();
        });

        it('works', () => {
            const wrapper = shallowNoLifecycle(
                <DraftailEditor
                    rawContentState={rawContentState}
                    entityTypes={[
                        {
                            type: ENTITY_TYPE.LINK,
                            source: () => {},
                        },
                    ]}
                />,
            );
            jest.spyOn(wrapper.instance(), 'toggleSource');

            wrapper.instance().onEditEntity('1');

            expect(DraftUtils.getEntitySelection).toHaveBeenCalled();
            expect(wrapper.instance().toggleSource).toHaveBeenCalled();
        });

        it('block', () => {
            const wrapper = shallowNoLifecycle(
                <DraftailEditor
                    rawContentState={rawContentState}
                    entityTypes={[
                        {
                            type: ENTITY_TYPE.LINK,
                            source: () => {},
                            block: () => {},
                        },
                    ]}
                />,
            );
            jest.spyOn(wrapper.instance(), 'toggleSource');

            wrapper.instance().onEditEntity('1');

            expect(DraftUtils.getEntitySelection).not.toHaveBeenCalled();
            expect(wrapper.instance().toggleSource).toHaveBeenCalled();
        });
    });

    describe('onRemoveEntity', () => {
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

        beforeEach(() => {
            EditorState.push = jest.fn(e => e);
            RichUtils.toggleLink = jest.fn();
            DraftUtils.getEntitySelection = jest.fn();
            DraftUtils.removeBlockEntity = jest.fn();
        });

        afterEach(() => {
            RichUtils.toggleLink.mockRestore();
            DraftUtils.getEntitySelection.mockRestore();
        });

        it('works', () => {
            const wrapper = shallowNoLifecycle(
                <DraftailEditor
                    rawContentState={rawContentState}
                    entityTypes={[
                        {
                            type: ENTITY_TYPE.LINK,
                            source: () => {},
                        },
                    ]}
                />,
            );

            wrapper.instance().onChange = jest.fn();
            wrapper.instance().onRemoveEntity('1', 'b3kdk');

            expect(RichUtils.toggleLink).toHaveBeenCalled();
            expect(EditorState.push).not.toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });

        it('block', () => {
            const wrapper = shallowNoLifecycle(
                <DraftailEditor
                    rawContentState={rawContentState}
                    entityTypes={[
                        {
                            type: ENTITY_TYPE.LINK,
                            source: () => {},
                            block: () => {},
                        },
                    ]}
                />,
            );

            wrapper.instance().onChange = jest.fn();
            wrapper.instance().onRemoveEntity('1');

            expect(RichUtils.toggleLink).not.toHaveBeenCalled();
            expect(DraftUtils.removeBlockEntity).toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });
    });

    describe('addHR', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallowNoLifecycle(<DraftailEditor />);

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
            wrapper = shallowNoLifecycle(<DraftailEditor />);

            jest.spyOn(DraftUtils, 'addLineBreak');
            jest.spyOn(wrapper.instance(), 'onChange');
        });

        afterEach(() => {
            DraftUtils.addLineBreak.mockRestore();
        });

        it('works', () => {
            wrapper.instance().addBR();

            expect(DraftUtils.addLineBreak).toHaveBeenCalled();
            expect(wrapper.instance().onChange).toHaveBeenCalled();
        });
    });

    describe('onUndoRedo', () => {
        let wrapper;

        beforeEach(() => {
            jest.spyOn(EditorState, 'undo');
            jest.spyOn(EditorState, 'redo');

            wrapper = shallowNoLifecycle(<DraftailEditor />);
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
            const rawContentState = {
                entityMap: {},
                blocks: [
                    {
                        text: ' ',
                        type: 'unstyled',
                    },
                ],
            };
            expect(
                shallowNoLifecycle(
                    <DraftailEditor rawContentState={rawContentState} />,
                )
                    .instance()
                    .blockRenderer(
                        convertFromRaw(rawContentState).getFirstBlock(),
                    ),
            ).toBe(null);
        });

        it('atomic', () => {
            const rawContentState = {
                entityMap: {
                    '0': {
                        type: 'IMAGE',
                    },
                },
                blocks: [
                    {
                        text: ' ',
                        type: 'atomic',
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 0,
                            },
                        ],
                    },
                ],
            };
            const wrapper = shallowNoLifecycle(
                <DraftailEditor
                    rawContentState={rawContentState}
                    entityTypes={[
                        {
                            type: 'IMAGE',
                            source: () => {},
                            decorator: () => {},
                            block: () => {},
                        },
                    ]}
                />,
            );

            const contentState = convertFromRaw(rawContentState);

            expect(
                wrapper.instance().blockRenderer(contentState.getFirstBlock()),
            ).toMatchObject({
                props: {
                    entityType: { type: 'IMAGE' },
                },
            });
        });

        it('HORIZONTAL_RULE', () => {
            const rawContentState = {
                entityMap: {
                    '0': {
                        type: 'HORIZONTAL_RULE',
                    },
                },
                blocks: [
                    {
                        text: ' ',
                        type: 'atomic',
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 0,
                            },
                        ],
                    },
                ],
            };
            const wrapper = shallowNoLifecycle(
                <DraftailEditor rawContentState={rawContentState} />,
            );

            const contentState = convertFromRaw(rawContentState);

            expect(
                wrapper.instance().blockRenderer(contentState.getFirstBlock()),
            ).toMatchObject({
                component: DividerBlock,
            });
        });

        it('atomic missing entity', () => {
            const rawContentState = {
                entityMap: {},
                blocks: [
                    {
                        text: ' ',
                        type: 'atomic',
                    },
                ],
            };
            const wrapper = shallowNoLifecycle(
                <DraftailEditor rawContentState={rawContentState} />,
            );

            const contentState = convertFromRaw(rawContentState);

            expect(
                wrapper.instance().blockRenderer(contentState.getFirstBlock()),
            ).toEqual({
                editable: false,
            });
        });
    });

    describe('source', () => {
        describe('onRequestSource', () => {
            it('empty', () => {
                const wrapper = shallowNoLifecycle(<DraftailEditor />);

                wrapper.instance().onRequestSource('LINK');

                expect(wrapper.state()).toMatchObject({
                    readOnly: true,
                    sourceOptions: {
                        entityType: undefined,
                    },
                });
            });

            it('with sourceOptions', () => {
                const source = () => <blockquote />;
                const wrapper = shallowNoLifecycle(
                    <DraftailEditor entityTypes={[{ type: 'LINK', source }]} />,
                );

                wrapper.instance().onRequestSource('LINK');

                expect(wrapper.state()).toMatchObject({
                    readOnly: true,
                    sourceOptions: {
                        entityType: {
                            type: 'LINK',
                            source,
                        },
                    },
                });
            });

            it('with entity', () => {
                const source = () => <blockquote />;
                const wrapper = shallowNoLifecycle(
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

                wrapper.instance().onRequestSource('LINK');

                expect(wrapper.state()).toMatchObject({
                    readOnly: true,
                    sourceOptions: {
                        entityType: {
                            type: 'LINK',
                            source,
                        },
                    },
                });
            });
        });

        describe('onCompleteSource', () => {
            beforeEach(() => {
                jest.useFakeTimers();
            });

            it('empty', () => {
                const wrapper = mount(<DraftailEditor />);

                wrapper.instance().onCompleteSource(null);

                expect(wrapper.state('sourceOptions')).toBe(null);
                jest.runOnlyPendingTimers();
                expect(wrapper.state('readOnly')).toBe(false);

                const focus = jest.fn();
                wrapper.instance().editorRef.focus = focus;
                jest.runOnlyPendingTimers();
                expect(focus).toHaveBeenCalled();
            });

            it('works', () => {
                const wrapper = shallowNoLifecycle(<DraftailEditor />);

                wrapper
                    .instance()
                    .onCompleteSource(wrapper.state('editorState'));

                expect(wrapper.state('hasFocus')).toBe(false);
            });
        });
    });

    describe('onCloseSource', () => {
        it('works', () => {
            const wrapper = shallowNoLifecycle(<DraftailEditor />);

            wrapper.instance().toggleSource();
            wrapper.instance().onCloseSource();

            expect(wrapper.state('sourceOptions')).toBe(null);
            expect(wrapper.state('readOnly')).toBe(false);
        });
    });

    describe('#focus', () => {
        it('works', () => {
            const wrapper = mount(<DraftailEditor />);
            const focus = jest.fn();
            wrapper.instance().editorRef.focus = focus;

            wrapper.instance().focus();

            expect(focus).toHaveBeenCalled();
        });
    });
});
