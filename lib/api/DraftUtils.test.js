import { List, Repeat } from 'immutable';
import {
    RichUtils,
    EditorState,
    convertFromHTML,
    ContentState,
    SelectionState,
    convertFromRaw,
    CharacterMetadata,
    ContentBlock,
} from 'draft-js';

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

    describe('#removeBlock', () => {
        it('works', () => {
            const editorState = DraftUtils.removeBlock(
                EditorState.createWithContent(
                    ContentState.createFromBlockArray([
                        new ContentBlock({
                            key: 'test',
                            type: 'unstyled',
                            text: 'test *',
                            characterList: List(
                                Repeat(
                                    CharacterMetadata.create(),
                                    'test *'.length,
                                ),
                            ),
                        }),
                        new ContentBlock({
                            key: '1234',
                            type: 'unstyled',
                            text: 'test *',
                            characterList: List(
                                Repeat(
                                    CharacterMetadata.create(),
                                    'test *'.length,
                                ),
                            ),
                        }),
                        new ContentBlock({
                            key: '5678',
                            type: 'unstyled',
                            text: 'test *',
                            characterList: List(
                                Repeat(
                                    CharacterMetadata.create(),
                                    'test *'.length,
                                ),
                            ),
                        }),
                    ]),
                ),
                '1234',
            );
            expect(
                Object.keys(
                    editorState
                        .getCurrentContent()
                        .getBlockMap()
                        .map(b => b.getKey())
                        .toJS(),
                ),
            ).toEqual(['5678', 'test']);
        });
    });

    describe('#hasNoSelectionStartEntity', () => {
        it('caret within entity text', () => {
            const editorState = EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(`<h1>Test</h1>`),
                ),
            );
            const contentStateWithEntity = editorState
                .getCurrentContent()
                .createEntity('LINK', 'MUTABLE', { url: 'www.testing.com' });
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newEditorState = RichUtils.toggleLink(
                editorState,
                editorState.getSelection().merge({
                    anchorOffset: 0,
                    focusOffset: 4,
                }),
                entityKey,
            );

            const selection = newEditorState.getSelection().merge({
                anchorOffset: 2,
                focusOffset: 0,
            });
            expect(
                DraftUtils.hasNoSelectionStartEntity(
                    selection,
                    newEditorState.getCurrentContent().getFirstBlock(),
                ),
            ).toBe(false);
        });

        it('caret at the end of the entity text', () => {
            const editorState = EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(`<h1>Test</h1>`),
                ),
            );
            const contentStateWithEntity = editorState
                .getCurrentContent()
                .createEntity('LINK', 'MUTABLE', { url: 'www.testing.com' });
            const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
            const newEditorState = RichUtils.toggleLink(
                editorState,
                editorState.getSelection().merge({
                    anchorOffset: 0,
                    focusOffset: 4,
                }),
                entityKey,
            );

            const selection = newEditorState.getSelection().merge({
                anchorOffset: 4,
                focusOffset: 0,
            });
            expect(
                DraftUtils.hasNoSelectionStartEntity(
                    selection,
                    newEditorState.getCurrentContent().getFirstBlock(),
                ),
            ).toBe(true);
        });
    });

    describe('#insertTextWithoutEntity', () => {
        it('works', () => {
            const editorState = DraftUtils.insertTextWithoutEntity(
                EditorState.createWithContent(
                    ContentState.createFromBlockArray(
                        convertFromHTML(`<h1>Test</h1>`),
                    ),
                ),
                '!',
            );
            const block = editorState.getCurrentContent().getFirstBlock();
            expect(block.getText()).toEqual('!Test');
        });
    });

    describe('#normaliseBlockDepth', () => {
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
});
