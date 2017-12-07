import DraftailEditor, {
    DraftUtils,
    BLOCK_TYPE,
    ENTITY_TYPE,
    INLINE_STYLE,
    Icon,
    Portal,
} from './index';

describe('draftail', () => {
    it('#DraftailEditor', () => expect(DraftailEditor).toBeDefined());

    it('#DraftUtils', () => expect(DraftUtils).toBeDefined());

    it('#BLOCK_TYPE', () => expect(BLOCK_TYPE).toBeDefined());

    it('#ENTITY_TYPE', () => expect(ENTITY_TYPE).toBeDefined());

    it('#INLINE_STYLE', () => expect(INLINE_STYLE).toBeDefined());

    it('#Icon', () => expect(Icon).toBeDefined());

    it('#Portal', () => expect(Portal).toBeDefined());
});
