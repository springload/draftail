import DraftailEditor, {
    DraftUtils,
    BLOCK_TYPE,
    ENTITY_TYPE,
    INLINE_STYLE,
    Icon,
} from './index';

describe('draftail', () => {
    describe('#DraftailEditor', () => {
        it('exists', () => {
            expect(DraftailEditor).toBeDefined();
        });
    });

    describe('#DraftUtils', () => {
        it('exists', () => {
            expect(DraftUtils).toBeDefined();
        });
    });

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

    describe('#Icon', () => {
        it('exists', () => {
            expect(Icon).toBeDefined();
        });
    });
});
