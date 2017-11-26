import { List, Repeat } from 'immutable';
import {
    CharacterMetadata,
    ContentBlock,
    DefaultDraftBlockRenderMap,
} from 'draft-js';

import behavior from '../api/behavior';
import {
    BLOCK_TYPE,
    INLINE_STYLE,
    KEY_CODES,
    CUSTOM_STYLE_MAP,
    ENTITY_TYPE,
} from '../api/constants';

describe('behavior', () => {
    describe('#getBlockRenderMap', () => {
        it('Default without blocks', () => {
            expect(behavior.getBlockRenderMap()).toBe(
                DefaultDraftBlockRenderMap,
            );
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
                                    entity: 'test1234',
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
                                    entity: 'test1234',
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

        it('all shortcuts', () => {
            const blockTypes = Object.values(BLOCK_TYPE).map(type => ({
                type,
            }));
            const inlineStyles = Object.values(INLINE_STYLE).map(type => ({
                type,
            }));
            const entityTypes = Object.values(ENTITY_TYPE).map(type => ({
                type,
            }));
            const keyBindingFn = behavior.getKeyBindingFn(
                blockTypes,
                inlineStyles,
                entityTypes,
            );

            const shiftKey = [
                {
                    keyCode: KEY_CODES.B,
                },
                {
                    keyCode: KEY_CODES.I,
                },
                {
                    keyCode: KEY_CODES.J,
                },
                {
                    keyCode: KEY_CODES.U,
                },
                {
                    keyCode: KEY_CODES.X,
                },
                {
                    keyCode: KEY_CODES.X,
                    ctrlKey: true,
                    output: INLINE_STYLE.STRIKETHROUGH,
                },
                {
                    keyCode: KEY_CODES[7],
                },
                {
                    keyCode: KEY_CODES[7],
                    ctrlKey: true,
                    output: BLOCK_TYPE.ORDERED_LIST_ITEM,
                },
                {
                    keyCode: KEY_CODES[8],
                },
                {
                    keyCode: KEY_CODES[8],
                    ctrlKey: true,
                    output: BLOCK_TYPE.UNORDERED_LIST_ITEM,
                },
                {
                    keyCode: 1337,
                },
            ];

            const noShiftKey = [
                {
                    keyCode: KEY_CODES.K,
                },
                {
                    keyCode: KEY_CODES.B,
                },
                {
                    keyCode: KEY_CODES.I,
                },
                {
                    keyCode: KEY_CODES.I,
                    ctrlKey: true,
                    output: INLINE_STYLE.ITALIC,
                },
                {
                    keyCode: KEY_CODES.J,
                },
                {
                    keyCode: KEY_CODES.J,
                    ctrlKey: true,
                    output: INLINE_STYLE.CODE,
                },
                {
                    keyCode: KEY_CODES.U,
                },
                {
                    keyCode: KEY_CODES.U,
                    ctrlKey: true,
                    output: INLINE_STYLE.UNDERLINE,
                },
                {
                    keyCode: KEY_CODES['.'],
                },
                {
                    keyCode: KEY_CODES['.'],
                    ctrlKey: true,
                    output: INLINE_STYLE.SUPERSCRIPT,
                },
                {
                    keyCode: KEY_CODES[','],
                },
                {
                    keyCode: KEY_CODES[','],
                    ctrlKey: true,
                    output: INLINE_STYLE.SUBSCRIPT,
                },
                {
                    keyCode: KEY_CODES[0],
                },
                {
                    keyCode: KEY_CODES[1],
                    metaKey: true,
                    altKey: true,
                    output: BLOCK_TYPE.HEADER_ONE,
                },
                {
                    keyCode: KEY_CODES[1],
                    metaKey: true,
                },
                {
                    keyCode: KEY_CODES[2],
                    metaKey: true,
                    altKey: true,
                    output: BLOCK_TYPE.HEADER_TWO,
                },
                {
                    keyCode: KEY_CODES[2],
                    metaKey: true,
                },
                {
                    keyCode: KEY_CODES[3],
                    metaKey: true,
                    altKey: true,
                    output: BLOCK_TYPE.HEADER_THREE,
                },
                {
                    keyCode: KEY_CODES[3],
                    metaKey: true,
                },
                {
                    keyCode: KEY_CODES[4],
                    metaKey: true,
                    altKey: true,
                    output: BLOCK_TYPE.HEADER_FOUR,
                },
                {
                    keyCode: KEY_CODES[4],
                    metaKey: true,
                },
                {
                    keyCode: KEY_CODES[5],
                    metaKey: true,
                    altKey: true,
                    output: BLOCK_TYPE.HEADER_FIVE,
                },
                {
                    keyCode: KEY_CODES[5],
                    metaKey: true,
                },
                {
                    keyCode: KEY_CODES[6],
                    metaKey: true,
                    altKey: true,
                    output: BLOCK_TYPE.HEADER_SIX,
                },
                {
                    keyCode: KEY_CODES[6],
                    metaKey: true,
                },
                {
                    keyCode: 1337,
                },
            ];

            const shortcuts = []
                .concat(shiftKey.map(s => Object.assign(s, { shiftKey: true })))
                .concat(noShiftKey);

            shortcuts.forEach(s => {
                expect(
                    keyBindingFn(
                        Object.assign(
                            {
                                metaKey: false,
                                altKey: false,
                                shiftKey: false,
                                ctrlKey: false,
                            },
                            s,
                        ),
                    ),
                ).toBe(typeof s.output !== 'undefined' ? s.output : null);
            });
        });
    });

    describe('#hasKeyboardShortcut', () => {
        it('defined shortcut', () => {
            expect(behavior.hasKeyboardShortcut(BLOCK_TYPE.HEADER_FIVE)).toBe(
                true,
            );
        });

        it('undefined shortcut', () => {
            expect(behavior.hasKeyboardShortcut('AAA')).toBe(false);
        });
    });

    describe('#getKeyboardShortcut', () => {
        it('header five shortcut', () => {
            expect(behavior.getKeyboardShortcut(BLOCK_TYPE.HEADER_FIVE)).toBe(
                'Ctrl+Alt+5',
            );
        });

        it('header five shortcut, macOS', () => {
            expect(
                behavior.getKeyboardShortcut(BLOCK_TYPE.HEADER_FIVE, true),
            ).toBe('⌘+Option+5');
        });

        it('undefined shortcut', () => {
            expect(behavior.getKeyboardShortcut('AAA')).toBe(
                'No keyboard shortcut',
            );
        });
    });

    describe('#handleBeforeInputBlockType', () => {
        it('returns false without block types', () => {
            expect(
                behavior.handleBeforeInputBlockType(
                    '',
                    new ContentBlock({
                        key: 'test1234',
                        type: 'unstyled',
                        text: 'This is test text',
                        characterList: List(
                            Repeat(
                                CharacterMetadata.create({
                                    entity: 'test1234',
                                }),
                                'This is test text'.length,
                            ),
                        ),
                    }),
                ),
            ).toBe(false);
        });

        it('does not convert without the right types', () => {
            expect(
                behavior.handleBeforeInputBlockType(
                    ' ',
                    new ContentBlock({
                        key: 'test1234',
                        type: 'unstyled',
                        text: '*',
                        characterList: List(
                            Repeat(CharacterMetadata.create(), '*'.length),
                        ),
                    }),
                    [{ type: BLOCK_TYPE.ORDERED_LIST_ITEM }],
                ),
            ).toBe(false);
        });

        it('converts regardless of block type', () => {
            expect(
                behavior.handleBeforeInputBlockType(
                    ' ',
                    new ContentBlock({
                        key: 'test1234',
                        type: 'header-one',
                        text: '*',
                        characterList: List(
                            Repeat(CharacterMetadata.create(), '*'.length),
                        ),
                    }),
                    [{ type: BLOCK_TYPE.UNORDERED_LIST_ITEM }],
                ),
            ).toBe('unordered-list-item');
        });

        it('does not convert if the block is longer than the max marker length', () => {
            expect(
                behavior.handleBeforeInputBlockType(
                    ' ',
                    new ContentBlock({
                        key: 'test1234',
                        type: 'unstyled',
                        text: 'test *',
                        characterList: List(
                            Repeat(CharacterMetadata.create(), 'test *'.length),
                        ),
                    }),
                    [{ type: BLOCK_TYPE.UNORDERED_LIST_ITEM }],
                ),
            ).toBe(false);
        });

        it('converts "* "', () => {
            expect(
                behavior.handleBeforeInputBlockType(
                    ' ',
                    new ContentBlock({
                        key: 'test1234',
                        type: 'unstyled',
                        text: '*',
                        characterList: List(
                            Repeat(CharacterMetadata.create(), '*'.length),
                        ),
                    }),
                    [{ type: BLOCK_TYPE.UNORDERED_LIST_ITEM }],
                ),
            ).toBe('unordered-list-item');
        });

        it('converts "- "', () => {
            expect(
                behavior.handleBeforeInputBlockType(
                    ' ',
                    new ContentBlock({
                        key: 'test1234',
                        type: 'unstyled',
                        text: '-',
                        characterList: List(
                            Repeat(CharacterMetadata.create(), '-'.length),
                        ),
                    }),
                    [{ type: BLOCK_TYPE.UNORDERED_LIST_ITEM }],
                ),
            ).toBe('unordered-list-item');
        });

        it('converts "1. "', () => {
            expect(
                behavior.handleBeforeInputBlockType(
                    ' ',
                    new ContentBlock({
                        key: 'test1234',
                        type: 'unstyled',
                        text: '1.',
                        characterList: List(
                            Repeat(CharacterMetadata.create(), '1.'.length),
                        ),
                    }),
                    [{ type: BLOCK_TYPE.ORDERED_LIST_ITEM }],
                ),
            ).toBe('ordered-list-item');
        });
    });

    describe('#handleBeforeInputHR', () => {
        it('does not convert in code block', () => {
            expect(
                behavior.handleBeforeInputHR(
                    ' ',
                    new ContentBlock({
                        key: 'test1234',
                        type: 'header-one',
                        text: '--',
                        characterList: List(
                            Repeat(CharacterMetadata.create(), '--'.length),
                        ),
                    }),
                ),
            ).toBe(false);
        });

        it('does not convert if the block is longer than the max marker length', () => {
            expect(
                behavior.handleBeforeInputHR(
                    ' ',
                    new ContentBlock({
                        key: 'test1234',
                        type: 'unstyled',
                        text: 'test *',
                        characterList: List(
                            Repeat(CharacterMetadata.create(), 'test *'.length),
                        ),
                    }),
                ),
            ).toBe(false);
        });

        it('converts "---"', () => {
            expect(
                behavior.handleBeforeInputHR(
                    '-',
                    new ContentBlock({
                        key: 'test1234',
                        type: 'unstyled',
                        text: '--',
                        characterList: List(
                            Repeat(CharacterMetadata.create(), '--'.length),
                        ),
                    }),
                ),
            ).toBe(true);
        });
    });

    describe('#getCustomStyleMap', () => {
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
                behavior.getCustomStyleMap([
                    {
                        label: 'Bold',
                        type: INLINE_STYLE.BOLD,
                        style: {
                            color: 'yellow',
                        },
                    },
                ]),
            ).toEqual({
                [INLINE_STYLE.BOLD]: {
                    color: 'yellow',
                },
            });
        });

        it('custom styles, custom styling', () => {
            expect(
                behavior.getCustomStyleMap([
                    { label: 'Red', type: 'RED', style: { color: 'red' } },
                ]),
            ).toEqual({
                RED: {
                    color: 'red',
                },
            });
        });

        it('custom styles, undefined styling', () => {
            expect(
                behavior.getCustomStyleMap([{ label: 'Red', type: 'RED' }]),
            ).toEqual({
                RED: {},
            });
        });
    });
});
