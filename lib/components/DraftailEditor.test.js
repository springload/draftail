import React from 'react';
import { shallow, mount } from 'enzyme';
import { Editor } from 'draft-js';
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

    it('focus', () => {
        const wrapper = shallow(<DraftailEditor spellCheck={true} />);

        expect(wrapper.state('hasFocus')).toBe(false);

        wrapper.instance().onFocus();

        expect(wrapper.state('hasFocus')).toBe(true);
        expect(wrapper.find('div').prop('className')).toContain(
            'editor--focus',
        );

        wrapper.instance().onBlur();

        expect(wrapper.state('hasFocus')).toBe(false);
    });

    describe('blockRenderer', () => {
        it('HORIZONTAL_RULE', () => {});

        it('other ATOMIC', () => {});
    });

    describe('dialog', () => {
        describe('onRequestDialog', () => {
            it('empty', () => {
                const wrapper = shallow(<DraftailEditor />);

                wrapper.instance().onRequestDialog('LINK');

                expect(wrapper.state()).toMatchObject({
                    readOnly: true,
                    dialogOptions: undefined,
                    entity: null,
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
                        type: 'LINK',
                        source,
                    },
                    entity: null,
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
                        type: 'LINK',
                        source,
                    },
                    entity: {},
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
