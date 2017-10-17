import {
    RichUtils,
    EditorState,
    convertFromHTML,
    ContentState,
    SelectionState,
    convertFromRaw,
} from 'draft-js';

import { BLOCK_TYPE, INLINE_STYLE } from '../api/constants';

import DraftUtils from '../api/DraftUtils';

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

    describe('#normaliseBlockType', () => {
        it('exists', () => {
            expect(DraftUtils.normaliseBlockType).toBeDefined();
        });

        it('works', () => {
            const contentState = ContentState.createFromBlockArray(
                convertFromHTML(
                    `<ul><li>UL</li></ul><p>P</p><h1>H1</h1><h2>H2</h2><h3>H3</h3>`,
                ),
            );
            const editorState = DraftUtils.normaliseBlockType(
                EditorState.createWithContent(contentState),
                [BLOCK_TYPE.UNORDERED_LIST_ITEM, BLOCK_TYPE.HEADER_TWO],
            );
            const blocks = DraftUtils.getAllBlocks(editorState);
            expect(blocks.map(block => block.getType()).toJS()).toEqual([
                'unordered-list-item',
                'unstyled',
                'unstyled',
                'header-two',
                'unstyled',
            ]);
        });
    });

    describe('#normaliseInlineStyle', () => {
        it('exists', () => {
            expect(DraftUtils.normaliseInlineStyle).toBeDefined();
        });

        it('works', () => {
            const contentState = ContentState.createFromBlockArray(
                convertFromHTML(
                    `<p><strong>s</strong><em>e</em><strong><em>b</em></strong></p>
                    <p><strong>s</strong><em>e</em><strong><em>b</em></strong></p>`,
                ),
            );
            const editorState = DraftUtils.normaliseInlineStyle(
                EditorState.createWithContent(contentState),
                [INLINE_STYLE.BOLD],
            );
            const blocks = DraftUtils.getAllBlocks(editorState);
            expect(
                blocks
                    .map(b => b.getCharacterList().map(c => c.getStyle()))
                    .toJS(),
            ).toEqual([[['BOLD'], [], ['BOLD']], [['BOLD'], [], ['BOLD']]]);
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
});
