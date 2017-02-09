import {
    BLOCK_TYPE,
    ENTITY_TYPE,
    INLINE_STYLE,
    BR_TYPE,
    KEY_CODES,
    KEYBOARD_SHORTCUTS,
    NBSP,
    HANDLED,
    NOT_HANDLED,
} from '../api/constants';

describe('constants', () => {
    describe('#BLOCK_TYPE', () => {
        it('exists', () => {
            expect(BLOCK_TYPE).toBeDefined();
        });
    });

    describe('#ENTITY_TYPE', () => {
        it('exists', () => {
            expect(ENTITY_TYPE).toBeDefined();
        });
    });

    describe('#INLINE_STYLE', () => {
        it('exists', () => {
            expect(INLINE_STYLE).toBeDefined();
        });
    });

    describe('#BR_TYPE', () => {
        it('exists', () => {
            expect(BR_TYPE).toBeDefined();
        });
    });

    describe('#KEY_CODES', () => {
        it('exists', () => {
            expect(KEY_CODES).toBeDefined();
        });
    });

    describe('#KEYBOARD_SHORTCUTS', () => {
        it('exists', () => {
            expect(KEYBOARD_SHORTCUTS).toBeDefined();
        });
    });

    describe('#NBSP', () => {
        it('exists', () => {
            expect(NBSP).toBeDefined();
        });
    });

    describe('#HANDLED', () => {
        it('exists', () => {
            expect(HANDLED).toBeDefined();
        });
    });

    describe('#NOT_HANDLED', () => {
        it('exists', () => {
            expect(NOT_HANDLED).toBeDefined();
        });
    });
});
