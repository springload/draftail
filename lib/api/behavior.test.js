import { List, Repeat } from 'immutable';
import { CharacterMetadata, ContentBlock } from 'draft-js';

import behavior from '../api/behavior';
import { BLOCK_TYPE, INLINE_STYLE, KEY_CODES, CUSTOM_STYLE_MAP } from '../api/constants';

describe('behavior', () => {
    describe('#getBlockRenderMap', () => {
        it('exists', () => {
            expect(behavior.getBlockRenderMap).toBeDefined();
        });

        it('has custom block with element', () => {
            expect(
                behavior
                    .getBlockRenderMap([{ type: 'TEST', element: 'div' }])
                    .get('TEST'),
            ).toEqual({ element: 'div' });
        });

        it('no custom block without element', () => {
            expect(
                behavior.getBlockRenderMap([{ type: 'TEST' }]).get('TEST'),
            ).not.toBeDefined();
        });

        describe('code block element', () => {
            it('default is "code"', () => {
                expect(
                    behavior
                        .getBlockRenderMap([{ type: BLOCK_TYPE.CODE }])
                        .get(BLOCK_TYPE.CODE).element,
                ).toEqual('code');
            });

            it('can be overriden', () => {
                expect(
                    behavior
                        .getBlockRenderMap([
                            { type: BLOCK_TYPE.CODE, element: 'span' },
                        ])
                        .get(BLOCK_TYPE.CODE).element,
                ).toEqual('span');
            });
        });
    });

    describe('#getBlockStyleFn', () => {
        it('exists', () => {
            expect(behavior.getBlockStyleFn).toBeDefined();
        });

        it('returns function', () => {
            expect(behavior.getBlockStyleFn()).toBeInstanceOf(Function);
        });

        it('has custom block with className', () => {
            expect(
                behavior.getBlockStyleFn([
                    { type: 'TEST', className: 'test-item' },
                ])(
                    new ContentBlock({
                        key: 'test1234',
                        type: 'TEST',
                        text: 'This is test text',
                        characterList: List(
                            Repeat(
                                CharacterMetadata.create({
                                    entittypey: 'test1234',
                                }),
                                'This is test text'.length,
                            ),
                        ),
                    }),
                ),
            ).toEqual('test-item');
        });

        it('no custom block without className', () => {
            expect(
                behavior.getBlockStyleFn([{ type: 'TEST' }])(
                    new ContentBlock({
                        key: 'test1234',
                        type: 'TEST',
                        text: 'This is test text',
                        characterList: List(
                            Repeat(
                                CharacterMetadata.create({
                                    entittypey: 'test1234',
                                }),
                                'This is test text'.length,
                            ),
                        ),
                    }),
                ),
            ).not.toBeDefined();
        });
    });

    describe('#getKeyBindingFn', () => {
        it('exists', () => {
            expect(behavior.getKeyBindingFn).toBeDefined();
        });

        it('returns function', () => {
            expect(behavior.getKeyBindingFn()).toBeInstanceOf(Function);
        });

        it('has strict keyboard shortcut matching', () => {
            expect(
                behavior.getKeyBindingFn([], [{ type: 'BOLD' }], [])({
                    keyCode: KEY_CODES.B,
                    metaKey: false,
                    altKey: false,
                    shiftKey: true,
                    ctrlKey: true,
                }),
            ).toBeNull();
        });

        it('has overlapping shortcuts', () => {
            expect(
                behavior.getKeyBindingFn(
                    [{ type: 'header-five' }],
                    [{ type: 'STRIKETHROUGH' }],
                    [],
                )({
                    keyCode: KEY_CODES[5],
                    metaKey: false,
                    altKey: true,
                    shiftKey: true,
                    ctrlKey: false,
                }),
            ).toBe('STRIKETHROUGH');

            expect(
                behavior.getKeyBindingFn(
                    [{ type: 'header-five' }],
                    [{ type: 'STRIKETHROUGH' }],
                    [],
                )({
                    keyCode: KEY_CODES[5],
                    metaKey: false,
                    altKey: true,
                    shiftKey: false,
                    ctrlKey: true,
                }),
            ).toBe('header-five');
        });

        describe('styles', () => {
            it('disables default style key bindings', () => {
                expect(
                    behavior.getKeyBindingFn([], [], [])({
                        keyCode: KEY_CODES.B,
                        metaKey: false,
                        altKey: false,
                        shiftKey: false,
                        ctrlKey: true,
                    }),
                ).toBeNull();
            });

            it('enables style key bindings when required', () => {
                expect(
                    behavior.getKeyBindingFn([], [{ type: 'BOLD' }], [])({
                        keyCode: KEY_CODES.B,
                        metaKey: false,
                        altKey: false,
                        shiftKey: false,
                        ctrlKey: true,
                    }),
                ).toBe('BOLD');
            });
        });

        describe('blocks', () => {
            it('has no default heading block key binding', () => {
                expect(
                    behavior.getKeyBindingFn([], [], [])({
                        keyCode: KEY_CODES[1],
                        metaKey: false,
                        altKey: true,
                        shiftKey: false,
                        ctrlKey: true,
                    }),
                ).toBeNull();
            });

            it('enables heading block key binding when required', () => {
                expect(
                    behavior.getKeyBindingFn([{ type: 'header-one' }], [], [])({
                        keyCode: KEY_CODES[1],
                        metaKey: false,
                        altKey: true,
                        shiftKey: false,
                        ctrlKey: true,
                    }),
                ).toBe('header-one');
            });

            it('has default unstyled block key binding', () => {
                expect(
                    behavior.getKeyBindingFn([], [], [])({
                        keyCode: KEY_CODES[0],
                        metaKey: false,
                        altKey: true,
                        shiftKey: false,
                        ctrlKey: true,
                    }),
                ).toBe('unstyled');
            });
        });

        describe('entities', () => {
            it('has no default link entity key binding', () => {
                expect(
                    behavior.getKeyBindingFn([], [], [])({
                        keyCode: KEY_CODES.K,
                        metaKey: false,
                        altKey: false,
                        shiftKey: false,
                        ctrlKey: true,
                    }),
                ).toBeNull();
            });

            it('enables link entity key binding when required', () => {
                expect(
                    behavior.getKeyBindingFn([], [], [{ type: 'LINK' }])({
                        keyCode: KEY_CODES.K,
                        metaKey: false,
                        altKey: false,
                        shiftKey: false,
                        ctrlKey: true,
                    }),
                ).toBe('LINK');
            });
        });
    });

    describe('#getKeyboardShortcut', () => {
        it('exists', () => {
            expect(behavior.getKeyboardShortcut).toBeDefined();
        });

        it('header five shortcut', () => {
            expect(behavior.getKeyboardShortcut(BLOCK_TYPE.HEADER_FIVE)).toBe(
                'ctrl + alt + 5',
            );
        });
    });

    describe('#getBeforeInputBlockType', () => {
        it('exists', () => {
            expect(behavior.getBeforeInputBlockType).toBeDefined();
        });

        it('returns false without block types', () => {
            expect(behavior.getBeforeInputBlockType('')).toBe(false);
        });

        it('does not convert without the right types', () => {
            expect(
                behavior.getBeforeInputBlockType('* ', [
                    { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
                ]),
            ).toBe(false);
        });

        it('converts "* "', () => {
            expect(
                behavior.getBeforeInputBlockType('* ', [
                    { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                ]),
            ).toBe('unordered-list-item');
        });

        it('converts "- "', () => {
            expect(
                behavior.getBeforeInputBlockType('- ', [
                    { type: BLOCK_TYPE.UNORDERED_LIST_ITEM },
                ]),
            ).toBe('unordered-list-item');
        });

        it('converts "1. "', () => {
            expect(
                behavior.getBeforeInputBlockType('1. ', [
                    { type: BLOCK_TYPE.ORDERED_LIST_ITEM },
                ]),
            ).toBe('ordered-list-item');
        });
    });

    describe('#getCustomStyleMap', () => {
        it('exists', () => {
            expect(behavior.getCustomStyleMap).toBeDefined();
        });

        it('existing styles, default styling', () => {
            expect(
                behavior.getCustomStyleMap([
                    { label: 'Bold', type: INLINE_STYLE.BOLD },
                    { label: 'Mark', type: INLINE_STYLE.MARK },
                ]),
            ).toEqual({
                [INLINE_STYLE.BOLD]: CUSTOM_STYLE_MAP[INLINE_STYLE.BOLD],
                [INLINE_STYLE.MARK]: CUSTOM_STYLE_MAP[INLINE_STYLE.MARK],
            });
        });

        it('existing styles, custom styling', () => {
            expect(
                behavior.getCustomStyleMap(
                    [
                        {
                            label: 'Bold',
                            type: INLINE_STYLE.BOLD,
                            style: {
                                color: 'yellow',
                            },
                        },
                    ],
                ),
            ).toEqual({
                [INLINE_STYLE.BOLD]: {
                    color: 'yellow',
                },
            });
        });

        it('custom styles, custom styling', () => {
            expect(
                behavior.getCustomStyleMap(
                    [
                        { label: 'Red', type: 'RED', style: { color: 'red' } },
                    ],
                ),
            ).toEqual({
                RED: {
                    color: 'red',
                },
            });
        });

        it('custom styles, undefined styling', () => {
            expect(
                behavior.getCustomStyleMap(
                    [
                        { label: 'Red', type: 'RED' },
                    ],
                ),
            ).toEqual({
                RED: {},
            });
        });
    });
});
