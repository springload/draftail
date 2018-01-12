import { List, Repeat } from 'immutable';
import {
    RichUtils,
    EditorState,
    convertFromHTML,
    ContentState,
    convertFromRaw,
    CharacterMetadata,
    ContentBlock,
    SelectionState,
} from 'draft-js';

import DraftUtils from '../api/DraftUtils';

describe('DraftUtils', () => {
    describe('#getSelectedBlock', () => {
        it('works', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);

            expect(DraftUtils.getSelectedBlock(editorState).getText()).toBe(
                'test',
            );
        });
    });

    describe('#getSelectionEntity', () => {
        it('no entity', () => {
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

            expect(
                DraftUtils.getSelectionEntity(editorState),
            ).not.toBeDefined();
        });

        it('collapsed within', () => {
            let content = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            let editorState = EditorState.createWithContent(content);
            content = content.createEntity('LINK', 'MUTABLE', {
                url: 'www.testing.com',
            });
            const entityKey = content.getLastCreatedEntityKey();
            editorState = RichUtils.toggleLink(
                editorState,
                editorState.getSelection().merge({
                    anchorOffset: 2,
                    focusOffset: 2,
                }),
                entityKey,
            );

            expect(
                DraftUtils.getSelectionEntity(editorState),
            ).not.toBeDefined();
        });

        it('full entity', () => {
            let content = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            let editorState = EditorState.createWithContent(content);
            content = content.createEntity('LINK', 'MUTABLE', {
                url: 'www.testing.com',
            });
            const entityKey = content.getLastCreatedEntityKey();
            editorState = RichUtils.toggleLink(
                editorState,
                editorState.getSelection().merge({
                    anchorOffset: 0,
                    focusOffset: 2,
                }),
                entityKey,
            );

            expect(DraftUtils.getSelectionEntity(editorState)).toBe(entityKey);
        });

        it('two entities', () => {
            let content = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            let editorState = EditorState.createWithContent(content);
            content = content.createEntity('LINK', 'MUTABLE', {
                url: 'www.testing.com',
            });
            editorState = RichUtils.toggleLink(
                editorState,
                editorState.getSelection().merge({
                    anchorOffset: 0,
                    focusOffset: 2,
                }),
                content.getLastCreatedEntityKey(),
            );
            content = content.createEntity('LINK', 'MUTABLE', {
                url: 'www.example.com',
            });
            editorState = RichUtils.toggleLink(
                editorState,
                editorState.getSelection().merge({
                    anchorOffset: 2,
                    focusOffset: 4,
                }),
                content.getLastCreatedEntityKey(),
            );
            editorState = EditorState.forceSelection(
                editorState,
                editorState.getSelection().merge({
                    anchorOffset: 0,
                    focusOffset: 4,
                }),
            );

            expect(
                DraftUtils.getSelectionEntity(editorState),
            ).not.toBeDefined();
        });
    });

    describe('#getEntitySelection', () => {
        it('works', () => {
            const contentBlocks = convertFromHTML('<h1>aaaaaaaaaa</h1>');
            const contentState = ContentState.createFromBlockArray(
                contentBlocks,
            );
            let editorState = EditorState.createWithContent(contentState);
            const updatedSelection = editorState.getSelection().merge({
                anchorOffset: 0,
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
            const entitySelection = DraftUtils.getEntitySelection(
                editorState,
                entityKey,
            );
            expect(entitySelection.toJS()).toMatchObject({
                anchorOffset: 0,
                focusOffset: 5,
            });
        });
    });

    describe('#hasCurrentInlineStyle', () => {
        it('finds match', () => {
            const editorState = EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p><strong>aaaaaaaaaa</strong></p>'),
                ),
            );
            expect(DraftUtils.hasCurrentInlineStyle(editorState, 'BOLD')).toBe(
                true,
            );
        });

        it('ignores non-match', () => {
            const editorState = EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML('<p><strong>aaaaaaaaaa</strong></p>'),
                ),
            );
            expect(
                DraftUtils.hasCurrentInlineStyle(editorState, 'ITALIC'),
            ).toBe(false);
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

    describe('#createEntity', () => {
        it('works', () => {
            const editorState = DraftUtils.createEntity(
                EditorState.createWithContent(
                    ContentState.createFromBlockArray(
                        convertFromHTML(`<h1>Test</h1>`),
                    ),
                ),
                'LINK',
                {},
                'test link',
            );
            const contentState = editorState.getCurrentContent();

            expect(
                contentState
                    .getEntity(contentState.getLastCreatedEntityKey())
                    .toJS(),
            ).toMatchObject({
                data: {},
                mutability: 'IMMUTABLE',
                type: 'LINK',
            });
        });

        it('replaces selected text', () => {
            let contentState = ContentState.createFromBlockArray(
                convertFromHTML(`<h1>Test</h1>`),
            );

            let editorState = EditorState.forceSelection(
                EditorState.createWithContent(contentState),
                new SelectionState({
                    anchorOffset: 0,
                    anchorKey: contentState.getFirstBlock().getKey(),
                    focusOffset: 4,
                    focusKey: contentState.getFirstBlock().getKey(),
                    isBackward: false,
                    hasFocus: true,
                }),
            );

            editorState = DraftUtils.createEntity(
                editorState,
                'LINK',
                {},
                'test link',
            );

            contentState = editorState.getCurrentContent();

            expect(
                contentState
                    .getEntity(contentState.getLastCreatedEntityKey())
                    .toJS(),
            ).toMatchObject({
                data: {},
                mutability: 'IMMUTABLE',
                type: 'LINK',
            });
        });
    });

    describe('#updateBlockEntity', () => {
        it('works', () => {
            const content = convertFromRaw({
                entityMap: {
                    '1': {
                        type: 'IMAGE',
                        mutability: 'IMMUTABLE',
                        data: {
                            src: 'example.png',
                        },
                    },
                },
                blocks: [
                    {
                        key: 'b0ei9',
                        text: ' ',
                        type: 'atomic',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [{ offset: 0, length: 1, key: 1 }],
                        data: {},
                    },
                ],
            });
            const editorState = DraftUtils.updateBlockEntity(
                EditorState.createWithContent(content),
                content.getFirstBlock(),
                {
                    alt: 'Test',
                },
            );

            expect(
                editorState
                    .getCurrentContent()
                    .getEntity(content.getFirstBlock().getEntityAt(0))
                    .getData(),
            ).toMatchObject({
                src: 'example.png',
                alt: 'Test',
            });
        });
    });

    describe('#addHorizontalRuleRemovingSelection', () => {
        it('works', () => {
            const editorState = DraftUtils.addHorizontalRuleRemovingSelection(
                EditorState.createWithContent(
                    ContentState.createFromBlockArray(
                        convertFromHTML(`<h1>Test</h1>`),
                    ),
                ),
            );
            const currentContent = editorState.getCurrentContent();
            const lastBlock = currentContent.getLastBlock();

            expect(lastBlock.getType()).toBe('unstyled');
            expect(
                currentContent.getBlockBefore(lastBlock.getKey()).getType(),
            ).toBe('atomic');

            const lastEntity = currentContent.getEntity(
                currentContent.getLastCreatedEntityKey(),
            );
            expect(lastEntity.getType()).toBe('HORIZONTAL_RULE');
        });
    });

    describe('#resetBlockWithType', () => {
        it('works', () => {
            const editorState = DraftUtils.resetBlockWithType(
                EditorState.createWithContent(
                    ContentState.createFromBlockArray(
                        convertFromHTML(`<h1>Test</h1>`),
                    ),
                ),
                'header-two',
            );

            expect(
                editorState
                    .getCurrentContent()
                    .getFirstBlock()
                    .getType(),
            ).toBe('header-two');
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

    describe('#getEntityTypeStrategy', () => {
        it('works', () => {
            const strategy = DraftUtils.getEntityTypeStrategy('LINK');
            const editorState = EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(
                        `<h1><a href="http://example.com/">Test</a></h1>`,
                    ),
                ),
            );
            const currentContent = editorState.getCurrentContent();
            const callback = jest.fn();
            strategy(currentContent.getFirstBlock(), callback, currentContent);
            expect(callback).toHaveBeenCalled();
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

    describe('#insertNewUnstyledBlock', () => {
        it('works', () => {
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

            expect(
                DraftUtils.insertNewUnstyledBlock(editorState)
                    .getCurrentContent()
                    .getLastBlock()
                    .getType(),
            ).toBe('unstyled');
        });
    });

    describe('#addLineBreakRemovingSelection', () => {
        it('works', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);

            expect(
                DraftUtils.addLineBreakRemovingSelection(editorState)
                    .getCurrentContent()
                    .getFirstBlock()
                    .getText(),
            ).toBe('\ntest');
        });
    });

    describe('#handleHardNewline', () => {
        beforeEach(() => {
            jest.spyOn(DraftUtils, 'insertNewUnstyledBlock');
            jest.spyOn(RichUtils, 'tryToRemoveBlockStyle');
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('non-collapsed selection', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                    {
                        key: 'a0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            let editorState = EditorState.createWithContent(contentState);
            const selection = editorState.getSelection().merge({
                anchorKey: 'b0ei9',
                focusKey: 'a0ei9',
                anchorOffset: 0,
                focusOffset: 4,
            });
            editorState = EditorState.forceSelection(editorState, selection);
            expect(DraftUtils.handleHardNewline(editorState)).toBe(false);
        });

        it('unstyled block', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);
            expect(DraftUtils.handleHardNewline(editorState)).toBe(false);
        });

        it('non-unstyled block', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-one',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);
            expect(DraftUtils.handleHardNewline(editorState)).toBe(false);
        });

        it('non-unstyled block end of block', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            let editorState = EditorState.createWithContent(contentState);
            const selection = editorState.getSelection().merge({
                anchorOffset: 4,
                focusOffset: 4,
            });
            editorState = EditorState.forceSelection(editorState, selection);
            DraftUtils.handleHardNewline(editorState);

            expect(DraftUtils.insertNewUnstyledBlock).toHaveBeenCalled();
        });

        it('non-empty list block', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'unordered-list-item',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);
            expect(DraftUtils.handleHardNewline(editorState)).toBe(false);
        });

        it('empty list block non-nested', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: '',
                        type: 'unordered-list-item',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);
            DraftUtils.handleHardNewline(editorState);

            expect(RichUtils.tryToRemoveBlockStyle).toHaveBeenCalled();
        });

        it('empty list block nested', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: '',
                        type: 'unordered-list-item',
                        depth: 1,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);
            expect(
                DraftUtils.handleHardNewline(editorState)
                    .getCurrentContent()
                    .getFirstBlock()
                    .getDepth(),
            ).toBe(0);
        });
    });

    describe('#handleNewLine', () => {
        beforeEach(() => {
            jest.spyOn(DraftUtils, 'handleHardNewline');
            jest.spyOn(DraftUtils, 'addLineBreakRemovingSelection');
            jest.spyOn(RichUtils, 'insertSoftNewline');
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('hard newline', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);
            DraftUtils.handleNewLine(editorState, {
                which: 13,
                getModifierState: () => false,
            });

            expect(DraftUtils.handleHardNewline).toHaveBeenCalled();
            expect(RichUtils.insertSoftNewline).not.toHaveBeenCalled();
        });

        it('soft newline', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                    {
                        key: 'a0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            let editorState = EditorState.createWithContent(contentState);
            const selection = editorState.getSelection().merge({
                anchorKey: 'b0ei9',
                focusKey: 'a0ei9',
                anchorOffset: 0,
                focusOffset: 4,
            });
            editorState = EditorState.forceSelection(editorState, selection);
            DraftUtils.handleNewLine(editorState, {
                which: 13,
                getModifierState: () => true,
            });

            expect(DraftUtils.handleHardNewline).not.toHaveBeenCalled();
            expect(RichUtils.insertSoftNewline).not.toHaveBeenCalled();
            expect(DraftUtils.addLineBreakRemovingSelection).toHaveBeenCalled();
        });

        it('soft newline collapsed', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'header-two',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);
            DraftUtils.handleNewLine(editorState, {
                which: 13,
                getModifierState: () => true,
            });

            expect(DraftUtils.handleHardNewline).not.toHaveBeenCalled();
            expect(RichUtils.insertSoftNewline).toHaveBeenCalled();
        });

        it('hard newline in code-block', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: 'test',
                        type: 'code-block',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);
            expect(
                DraftUtils.handleNewLine(editorState, {
                    which: 13,
                    getModifierState: () => false,
                }),
            ).toBe(false);
        });

        it('hard newline in empty code-block', () => {
            const contentState = convertFromRaw({
                entityMap: {},
                blocks: [
                    {
                        key: 'b0ei9',
                        text: '',
                        type: 'code-block',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });
            const editorState = EditorState.createWithContent(contentState);
            expect(
                DraftUtils.handleNewLine(editorState, {
                    which: 13,
                    getModifierState: () => false,
                })
                    .getCurrentContent()
                    .getFirstBlock()
                    .getType(),
            ).toBe('unstyled');
        });
    });
});
