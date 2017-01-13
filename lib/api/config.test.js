import { List, Repeat } from 'immutable';
import {
    CharacterMetadata,
    ContentBlock,
} from 'draft-js';

import config, { MAX_LIST_NESTING, STATE_SAVE_INTERVAL } from '../api/config';
import { KEY_CODES } from '../api/constants';

describe('config', () => {
    describe('#MAX_LIST_NESTING', () => {
        it('exists', () => {
            expect(MAX_LIST_NESTING).toBeDefined();
        });
    });

    describe('#STATE_SAVE_INTERVAL', () => {
        it('exists', () => {
            expect(STATE_SAVE_INTERVAL).toBeDefined();
        });
    });

    describe('#getBlockRenderMap', () => {
        it('exists', () => {
            expect(config.getBlockRenderMap).toBeDefined();
        });

        it('has custom block with element', () => {
            expect(config.getBlockRenderMap([
                { style: 'TEST', element: 'div' },
            ]).get('TEST')).toEqual({ element: 'div' });
        });

        it('no custom block without element', () => {
            expect(config.getBlockRenderMap([
                { style: 'TEST' },
            ]).get('TEST')).not.toBeDefined();
        });
    });

    describe('#getBlockStyleFn', () => {
        it('exists', () => {
            expect(config.getBlockStyleFn).toBeDefined();
        });

        it('returns function', () => {
            expect(config.getBlockStyleFn()).toBeInstanceOf(Function);
        });

        it('has custom block with className', () => {
            expect(config.getBlockStyleFn([
                { style: 'TEST', className: 'test-item' },
            ])(new ContentBlock({
                key: 'test1234',
                type: 'TEST',
                text: 'This is test text',
                characterList: List(Repeat(CharacterMetadata.create({ entity: 'test1234' }), 'This is test text'.length)),
            }))).toEqual('test-item');
        });

        it('no custom block without className', () => {
            expect(config.getBlockStyleFn([
                { style: 'TEST' },
            ])(new ContentBlock({
                key: 'test1234',
                type: 'TEST',
                text: 'This is test text',
                characterList: List(Repeat(CharacterMetadata.create({ entity: 'test1234' }), 'This is test text'.length)),
            }))).not.toBeDefined();
        });
    });

    describe('#getKeyBindingFn', () => {
        it('exists', () => {
            expect(config.getKeyBindingFn).toBeDefined();
        });

        it('returns function', () => {
            expect(config.getKeyBindingFn()).toBeInstanceOf(Function);
        });

        it('has strict keyboard shortcut matching', () => {
            expect(config.getKeyBindingFn([], [{ style: 'BOLD' }])({
                keyCode: KEY_CODES.B,
                metaKey: false,
                altKey: false,
                shiftKey: true,
                ctrlKey: true,
            })).toBeNull();
        });

        it('has overlapping shortcuts', () => {
            expect(config.getKeyBindingFn([{ style: 'header-five' }], [{ style: 'STRIKETHROUGH' }])({
                keyCode: KEY_CODES[5],
                metaKey: false,
                altKey: true,
                shiftKey: true,
                ctrlKey: false,
            })).toBe('STRIKETHROUGH');

            expect(config.getKeyBindingFn([{ style: 'header-five' }], [{ style: 'STRIKETHROUGH' }])({
                keyCode: KEY_CODES[5],
                metaKey: false,
                altKey: true,
                shiftKey: false,
                ctrlKey: true,
            })).toBe('header-five');
        });

        describe('styles', () => {
            it('disables default style key bindings', () => {
                expect(config.getKeyBindingFn([], [])({
                    keyCode: KEY_CODES.B,
                    metaKey: false,
                    altKey: false,
                    shiftKey: false,
                    ctrlKey: true,
                })).toBeNull();
            });

            it('enables style key bindings when required', () => {
                expect(config.getKeyBindingFn([], [{ style: 'BOLD' }])({
                    keyCode: KEY_CODES.B,
                    metaKey: false,
                    altKey: false,
                    shiftKey: false,
                    ctrlKey: true,
                })).toBe('BOLD');
            });
        });

        describe('blocks', () => {
            it('has no default heading block key binding', () => {
                expect(config.getKeyBindingFn([], [])({
                    keyCode: KEY_CODES[1],
                    metaKey: false,
                    altKey: true,
                    shiftKey: false,
                    ctrlKey: true,
                })).toBeNull();
            });

            it('enables heading block key binding when required', () => {
                expect(config.getKeyBindingFn([{ style: 'header-one' }], [])({
                    keyCode: KEY_CODES[1],
                    metaKey: false,
                    altKey: true,
                    shiftKey: false,
                    ctrlKey: true,
                })).toBe('header-one');
            });

            it('has default unstyled block key binding', () => {
                expect(config.getKeyBindingFn([], [])({
                    keyCode: KEY_CODES[0],
                    metaKey: false,
                    altKey: true,
                    shiftKey: false,
                    ctrlKey: true,
                })).toBe('unstyled');
            });
        });
    });
});
