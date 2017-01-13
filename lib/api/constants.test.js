import { BLOCK_TYPE, ENTITY_TYPE, INLINE_STYLE, KEY_CODES } from '../api/constants';

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

    describe('#KEY_CODES', () => {
        it('exists', () => {
            expect(KEY_CODES).toBeDefined();
        });
    });
});
