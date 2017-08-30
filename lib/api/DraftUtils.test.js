import {
    RichUtils,
    EditorState,
    convertFromHTML,
    ContentState,
    SelectionState,
    convertFromRaw,
} from 'draft-js';

import DraftUtils from '../api/DraftUtils';

const constantInlineStyles = {
    STYLE1: 'STYLE1',
    STYLE2: 'STYLE2',
    STYLE3: 'STYLE3',
};

const defaultCustomStyleMap = {
    [constantInlineStyles.STYLE1]: {
        textDecoration: 'underline',
    },
    [constantInlineStyles.STYLE2]: {
        fontWeight: 'normal',
    },
    [constantInlineStyles.STYLE3]: {
        color: 'red',
    },
};

describe('DraftUtils', () => {
    describe('#getSelectionEntity', () => {
        it('exists', () => {
            expect(DraftUtils.getSelectionEntity).toBeDefined();
        });
    });

    describe('#getEntityRange', () => {
        it('exists', () => {
            expect(DraftUtils.getEntityRange).toBeDefined();
        });
    });

    describe('#handleNewLine', () => {
        it('exists', () => {
            expect(DraftUtils.handleNewLine).toBeDefined();
        });
    });

    describe('#addLineBreakRemovingSelection', () => {
        it('exists', () => {
            expect(DraftUtils.addLineBreakRemovingSelection).toBeDefined();
        });
    });

    describe('#getSelectedBlock', () => {
        it('exists', () => {
            expect(DraftUtils.getSelectedBlock).toBeDefined();
        });
    });

    describe('#getAllBlocks', () => {
        it('exists', () => {
            expect(DraftUtils.getAllBlocks).toBeDefined();
        });
    });

    describe('#isSelectedBlockType', () => {
        it('exists', () => {
            expect(DraftUtils.isSelectedBlockType).toBeDefined();
        });

        it('finds correct block type', () => {
            const contentBlocks = convertFromHTML('<h1>aaaaaaaaaa</h1>');
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
            );
            let editorState = EditorState.createWithContent(contentState);
            const updatedSelection = editorState.getSelection().merge({
                anchorOffset: 3,
                focusOffset: 5,
            });
            const contentStateWithEntity = contentState.createEntity(
                'LINK',
                'MUTABLE',
                { url: 'www.testing.com' },
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            editorState = RichUtils.toggleLink(
                editorState,
                updatedSelection,
                entityKey,
            );
            expect(
                DraftUtils.isSelectedBlockType(editorState, 'header-one'),
            ).toBeTruthy();
        });

        it('does not find wrong block type', () => {
            const contentBlocks = convertFromHTML('<h1>aaaaaaaaaa</h1>');
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
            );
            let editorState = EditorState.createWithContent(contentState);
            const updatedSelection = editorState.getSelection().merge({
                anchorOffset: 3,
                focusOffset: 5,
            });
            const contentStateWithEntity = contentState.createEntity(
                'LINK',
                'MUTABLE',
                { url: 'www.testing.com' },
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            editorState = RichUtils.toggleLink(
                editorState,
                updatedSelection,
                entityKey,
            );
            expect(
                DraftUtils.isSelectedBlockType(editorState, 'header-two'),
            ).toBeFalsy();
        });
    });

    describe('#getSelectedEntitySelection', () => {
        it('exists', () => {
            expect(DraftUtils.getSelectedEntitySelection).toBeDefined();
        });

        it('returns selected entity selection', () => {
            const contentBlocks = convertFromHTML('<h1>aaaaaaaaaa</h1>');
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
            );
            let editorState = EditorState.createWithContent(contentState);
            const updatedSelection = editorState.getSelection().merge({
                anchorOffset: 3,
                focusOffset: 5,
            });
            const contentStateWithEntity = contentState.createEntity(
                'LINK',
                'MUTABLE',
                { url: 'www.testing.com' },
            );
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            editorState = RichUtils.toggleLink(
                editorState,
                updatedSelection,
                entityKey,
            );
            expect(
                DraftUtils.getSelectedEntitySelection(editorState),
            ).toBeInstanceOf(SelectionState);
        });
    });

    describe('#normaliseBlockDepth', () => {
        it('exists', () => {
            expect(DraftUtils.normaliseBlockDepth).toBeDefined();
        });

        it('normalises depth to a given number', () => {
            const contentBlocks = convertFromHTML(`<ul>
                    <li>Depth 0</li>
                    <li><ul>
                        <li>Depth 1</li>
                        <li><ul><li>Depth 2</li></ul></li>
                    </ul></li>
                </ul>`);
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
            );
            const editorState = DraftUtils.normaliseBlockDepth(
                EditorState.createWithContent(contentState),
                1,
            );
            const blocks = DraftUtils.getAllBlocks(editorState);
            expect(blocks.map(block => block.getDepth()).toJS()).toEqual([
                0,
                0,
                0,
                1,
                1,
            ]);
        });
    });

    describe('#shouldHidePlaceholder', () => {
        it('is empty', () => {
            expect(
                DraftUtils.shouldHidePlaceholder(EditorState.createEmpty()),
            ).toBeFalsy();
        });

        it('has content', () => {
            const contentBlocks = convertFromHTML('<h1>aaaaaaaaaa</h1>');
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
            );
            const editorState = EditorState.createWithContent(contentState);

            expect(DraftUtils.shouldHidePlaceholder(editorState)).toBeTruthy();
        });

        it('is empty but not unstyled', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: '',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);
            expect(DraftUtils.shouldHidePlaceholder(editorState)).toBeTruthy();
        });
    });

    describe('#parseCustomStyleMap', () => {
        it('exists', () => {
            expect(DraftUtils.parseCustomStyleMap).toBeDefined();
        });

        it('working case - no rewrite', () => {
            const userInlineStyles = [
                { label: 'Style1', type: constantInlineStyles.STYLE1 },
                { label: 'Style2', type: constantInlineStyles.STYLE2 },
                { label: 'Style3', type: constantInlineStyles.STYLE3 },
            ];

            const expected = Object.assign({}, defaultCustomStyleMap);

            expect(
                DraftUtils.parseCustomStyleMap(
                    constantInlineStyles,
                    defaultCustomStyleMap,
                    userInlineStyles,
                ),
            ).toEqual(expected);
        });

        it('working case - rewrite', () => {
            const userInlineStyles = [
                {
                    label: 'Style1',
                    type: constantInlineStyles.STYLE1,
                    style: {
                        color: 'yellow',
                    },
                },
                { label: 'Style2', type: constantInlineStyles.STYLE2 },
                { label: 'Style3', type: constantInlineStyles.STYLE3 },
            ];

            const expected = Object.assign({}, defaultCustomStyleMap);
            expected[constantInlineStyles.STYLE1] = {
                color: 'yellow',
            };

            expect(
                DraftUtils.parseCustomStyleMap(
                    constantInlineStyles,
                    defaultCustomStyleMap,
                    userInlineStyles,
                ),
            ).toEqual(expected);
        });

        it('trying to rewrite unknown value', () => {
            const userInlineStyles = [
                { label: 'Style1', type: constantInlineStyles.STYLE1 },
                { label: 'StyleABC', type: 'STYLEABC', style: { color: 'red' } },
                { label: 'Style3', type: constantInlineStyles.STYLE3 },
            ];

            const expected = Object.assign({}, defaultCustomStyleMap);

            expect(
                DraftUtils.parseCustomStyleMap(
                    constantInlineStyles,
                    defaultCustomStyleMap,
                    userInlineStyles,
                ),
            ).toEqual(expected);
        });
    });
});
