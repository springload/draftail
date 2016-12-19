import { List, Repeat } from 'immutable';
import {
    CharacterMetadata,
    ContentBlock,
} from 'draft-js';

import config, { MAX_LIST_NESTING, STATE_SAVE_INTERVAL } from '../api/config';

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
});
