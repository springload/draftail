import {
    EditorState,
    convertFromHTML,
    ContentState,
    convertFromRaw,
} from 'draft-js';

import { BLOCK_TYPE, INLINE_STYLE, ENTITY_TYPE } from '../api/constants';
import DraftUtils from '../api/DraftUtils';

import normalize from '../api/normalize';

describe('normalize', () => {
    describe('#filterEditorState', () => {
        beforeEach(() => {
            jest.spyOn(normalize, 'preserveAtomicBlocks');
            jest.spyOn(normalize, 'resetBlockDepth');
            jest.spyOn(normalize, 'resetBlockType');
            jest.spyOn(normalize, 'filterInlineStyle');
            jest.spyOn(normalize, 'resetAtomicBlocks');
            jest.spyOn(normalize, 'filterEntityType');
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it('works', () => {
            const editorState = EditorState.createEmpty();
            expect(
                normalize.filterEditorState(
                    editorState,
                    1,
                    false,
                    [BLOCK_TYPE.HEADER_FIVE],
                    [INLINE_STYLE.BOLD],
                    [ENTITY_TYPE.IMAGE],
                ),
            ).toBeInstanceOf(EditorState);
            expect(normalize.preserveAtomicBlocks).toHaveBeenCalled();
            expect(normalize.resetBlockDepth).toHaveBeenCalled();
            expect(normalize.resetBlockType).toHaveBeenCalled();
            expect(normalize.filterInlineStyle).toHaveBeenCalled();
            expect(normalize.resetAtomicBlocks).toHaveBeenCalled();
            expect(normalize.filterEntityType).toHaveBeenCalled();
        });

        it(ENTITY_TYPE.HORIZONTAL_RULE, () => {
            const editorState = EditorState.createEmpty();
            expect(
                normalize.filterEditorState(editorState, 1, true, [], [], []),
            ).toBeInstanceOf(EditorState);
            expect(normalize.preserveAtomicBlocks).toHaveBeenCalled();
            expect(normalize.resetBlockDepth).toHaveBeenCalled();
            expect(normalize.resetBlockType).toHaveBeenCalled();
            expect(normalize.filterInlineStyle).toHaveBeenCalled();
            expect(normalize.resetAtomicBlocks).toHaveBeenCalled();
            expect(normalize.filterEntityType).toHaveBeenCalledWith(
                expect.any(EditorState),
                [ENTITY_TYPE.HORIZONTAL_RULE],
            );
        });
    });

    describe('#preserveAtomicBlocks', () => {
        it('works', () => {
            const contentState = convertFromRaw({
                entityMap: {
                    '4': {
                        type: 'IMAGE',
                        mutability: 'IMMUTABLE',
                        data: {
                            src: '../static/example-lowres-image.jpg',
                        },
                    },
                    '5': {
                        type: 'EMBED',
                        mutability: 'IMMUTABLE',
                        data: {
                            url: 'http://www.youtube.com/watch?v=y8Kyi0WNg40',
                        },
                    },
                },
                blocks: [
                    {
                        key: 'd3071',
                        text: ' ',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 4,
                            },
                        ],
                        data: {},
                    },
                    {
                        key: 'affm4',
                        text: ' ',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 5,
                            },
                        ],
                        data: {},
                    },
                    {
                        key: 'abbm4',
                        text: ' ',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });

            expect(
                normalize
                    .preserveAtomicBlocks(
                        EditorState.createWithContent(contentState),
                        [ENTITY_TYPE.IMAGE],
                    )
                    .getCurrentContent()
                    .getBlockMap()
                    .map(b => b.getType())
                    .toJS(),
            ).toEqual({
                d3071: 'atomic',
                affm4: 'unstyled',
                abbm4: 'unstyled',
            });
        });

        it('no normalisation = no change', () => {
            const contentState = convertFromRaw({
                entityMap: {
                    '4': {
                        type: 'IMAGE',
                        mutability: 'IMMUTABLE',
                        data: {
                            src: '../static/example-lowres-image.jpg',
                        },
                    },
                },
                blocks: [
                    {
                        key: 'd3071',
                        text: ' ',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 4,
                            },
                        ],
                        data: {},
                    },
                ],
            });

            const editorState = EditorState.createWithContent(contentState);

            expect(normalize.preserveAtomicBlocks(editorState, [])).toBe(
                editorState,
            );
        });
    });

    describe('#resetBlockDepth', () => {
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
            const editorState = normalize.resetBlockDepth(
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

        it('no normalisation = no change', () => {
            const editorState = EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(`<ul><li>Depth 0</li></ul>`),
                ),
            );
            expect(normalize.resetBlockDepth(editorState, 1)).toBe(editorState);
        });
    });

    describe('#resetBlockType', () => {
        it('works', () => {
            const contentState = ContentState.createFromBlockArray(
                convertFromHTML(
                    `<ul><li>UL</li></ul><p>P</p><h1>H1</h1><h2>H2</h2><h3>H3</h3>`,
                ),
            );
            const editorState = normalize.resetBlockType(
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

        it('no normalisation = no change', () => {
            const editorState = EditorState.createWithContent(
                ContentState.createFromBlockArray(
                    convertFromHTML(`<ul><li>UL</li></ul><p>P</p><h2>H2</h2>`),
                ),
            );
            expect(
                normalize.resetBlockType(editorState, [
                    BLOCK_TYPE.UNSTYLED,
                    BLOCK_TYPE.UNORDERED_LIST_ITEM,
                    BLOCK_TYPE.HEADER_TWO,
                ]),
            ).toBe(editorState);
        });
    });

    describe('#filterInlineStyle', () => {
        it('works', () => {
            const contentState = ContentState.createFromBlockArray(
                convertFromHTML(
                    `<p><strong>s</strong><em>e</em><strong><em>b</em></strong></p>
                    <p><strong>s</strong><em>e</em><strong><em>b</em></strong></p>
                    <p><strong>s</strong></p>`,
                ),
            );
            const editorState = normalize.filterInlineStyle(
                EditorState.createWithContent(contentState),
                [INLINE_STYLE.BOLD],
            );
            const blocks = DraftUtils.getAllBlocks(editorState);
            expect(
                blocks
                    .map(b => b.getCharacterList().map(c => c.getStyle()))
                    .toJS(),
            ).toEqual([
                [['BOLD'], [], ['BOLD']],
                [['BOLD'], [], ['BOLD']],
                [['BOLD']],
            ]);
        });
    });

    describe('#resetAtomicBlocks', () => {
        it('works', () => {
            const contentState = convertFromRaw({
                entityMap: {
                    '4': {
                        type: 'IMAGE',
                        mutability: 'IMMUTABLE',
                        data: {
                            src: '../static/example-lowres-image.jpg',
                        },
                    },
                    '5': {
                        type: 'EMBED',
                        mutability: 'IMMUTABLE',
                        data: {
                            url: 'http://www.youtube.com/watch?v=y8Kyi0WNg40',
                        },
                    },
                },
                blocks: [
                    {
                        key: 'd3071',
                        text: ' ',
                        type: 'atomic',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 4,
                            },
                        ],
                        data: {},
                    },
                    {
                        key: 'affm4',
                        text: ' ',
                        type: 'atomic',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 5,
                            },
                        ],
                        data: {},
                    },
                    {
                        key: 'abbm4',
                        text: ' ',
                        type: 'atomic',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
            });

            expect(
                normalize
                    .resetAtomicBlocks(
                        EditorState.createWithContent(contentState),
                        [ENTITY_TYPE.EMBED],
                    )
                    .getCurrentContent()
                    .getBlockMap()
                    .map(b => b.getType())
                    .toJS(),
            ).toEqual({
                d3071: 'unstyled',
                affm4: 'atomic',
                abbm4: 'atomic',
            });
        });

        it('normalises block text', () => {
            const contentState = convertFromRaw({
                entityMap: {
                    '4': {
                        type: 'IMAGE',
                        mutability: 'IMMUTABLE',
                        data: {
                            src: '../static/example-lowres-image.jpg',
                        },
                    },
                },
                blocks: [
                    {
                        key: '3d071',
                        text: '📷',
                        type: 'atomic',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 4,
                            },
                        ],
                        data: {},
                    },
                ],
            });

            expect(
                normalize
                    .resetAtomicBlocks(
                        EditorState.createWithContent(contentState),
                        [ENTITY_TYPE.IMAGE],
                    )
                    .getCurrentContent()
                    .getFirstBlock()
                    .toJS(),
            ).toMatchObject({
                text: ' ',
            });
        });

        describe(ENTITY_TYPE.HORIZONTAL_RULE, () => {
            it('disabled', () => {
                const contentState = convertFromRaw({
                    entityMap: {
                        '3': {
                            type: 'HORIZONTAL_RULE',
                            mutability: 'IMMUTABLE',
                            data: {},
                        },
                    },
                    blocks: [
                        {
                            key: 'epoas',
                            text: ' ',
                            type: 'atomic',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [
                                {
                                    offset: 0,
                                    length: 1,
                                    key: 3,
                                },
                            ],
                            data: {},
                        },
                    ],
                });

                expect(
                    normalize
                        .resetAtomicBlocks(
                            EditorState.createWithContent(contentState),
                            [],
                        )
                        .getCurrentContent()
                        .getFirstBlock()
                        .getType(),
                ).toBe('unstyled');
            });

            it('enabled', () => {
                const contentState = convertFromRaw({
                    entityMap: {
                        '3': {
                            type: 'HORIZONTAL_RULE',
                            mutability: 'IMMUTABLE',
                            data: {},
                        },
                    },
                    blocks: [
                        {
                            key: 'epoas',
                            text: ' ',
                            type: 'atomic',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [
                                {
                                    offset: 0,
                                    length: 1,
                                    key: 3,
                                },
                            ],
                            data: {},
                        },
                    ],
                });

                expect(
                    normalize
                        .resetAtomicBlocks(
                            EditorState.createWithContent(contentState),
                            [ENTITY_TYPE.HORIZONTAL_RULE],
                        )
                        .getCurrentContent()
                        .getFirstBlock()
                        .getType(),
                ).toBe('atomic');
            });
        });
    });

    describe('#filterEntityType', () => {
        it('works', () => {
            const contentState = convertFromRaw({
                entityMap: {
                    '4': {
                        type: 'IMAGE',
                        mutability: 'IMMUTABLE',
                        data: {
                            src: '../static/example-lowres-image.jpg',
                        },
                    },
                    '5': {
                        type: 'EMBED',
                        mutability: 'IMMUTABLE',
                        data: {
                            url: 'http://www.youtube.com/watch?v=y8Kyi0WNg40',
                        },
                    },
                },
                blocks: [
                    {
                        key: '3d071',
                        text: ' ',
                        type: 'atomic',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 4,
                            },
                        ],
                        data: {},
                    },
                    {
                        key: 'affm4',
                        text: ' ',
                        type: 'atomic',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 0,
                                length: 1,
                                key: 5,
                            },
                        ],
                        data: {},
                    },
                ],
            });

            expect(
                normalize
                    .filterEntityType(
                        EditorState.createWithContent(contentState),
                        [ENTITY_TYPE.EMBED],
                    )
                    .getCurrentContent()
                    .getBlockMap()
                    .map(b => {
                        const entityKey = b.getEntityAt(0);
                        return entityKey
                            ? contentState.getEntity(entityKey).getType()
                            : entityKey;
                    })
                    .toJS(),
            ).toEqual({
                '3d071': null,
                affm4: 'EMBED',
            });
        });

        it('works inline', () => {
            const contentState = convertFromRaw({
                entityMap: {
                    '0': {
                        type: 'LINK',
                        mutability: 'MUTABLE',
                        data: {
                            url: 'www.example.com',
                        },
                    },
                    '1': {
                        type: 'DOCUMENT',
                        mutability: 'MUTABLE',
                        data: {
                            url: 'doc.pdf',
                        },
                    },
                },
                blocks: [
                    {
                        key: '6i47q',
                        text: 'NA link doc',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [
                            {
                                offset: 3,
                                length: 4,
                                key: 0,
                            },
                            {
                                offset: 8,
                                length: 3,
                                key: 1,
                            },
                        ],
                        data: {},
                    },
                ],
            });

            expect(
                normalize
                    .filterEntityType(
                        EditorState.createWithContent(contentState),
                        [ENTITY_TYPE.LINK],
                    )
                    .getCurrentContent()
                    .getFirstBlock()
                    .getCharacterList()
                    .map(c => c.getEntity())
                    .map(e => {
                        return e ? contentState.getEntity(e).getType() : null;
                    })
                    .toJS(),
            ).toEqual([
                null,
                null,
                null,
                'LINK',
                'LINK',
                'LINK',
                'LINK',
                null,
                null,
                null,
                null,
            ]);
        });

        describe(ENTITY_TYPE.HORIZONTAL_RULE, () => {
            it('disabled', () => {
                const contentState = convertFromRaw({
                    entityMap: {
                        '3': {
                            type: 'HORIZONTAL_RULE',
                            mutability: 'IMMUTABLE',
                            data: {},
                        },
                    },
                    blocks: [
                        {
                            key: 'epoas',
                            text: ' ',
                            type: 'atomic',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [
                                {
                                    offset: 0,
                                    length: 1,
                                    key: 3,
                                },
                            ],
                            data: {},
                        },
                    ],
                });

                expect(
                    normalize
                        .filterEntityType(
                            EditorState.createWithContent(contentState),
                            [],
                        )
                        .getCurrentContent()
                        .getFirstBlock()
                        .getEntityAt(0),
                ).toBe(null);
            });

            it('enabled', () => {
                const contentState = convertFromRaw({
                    entityMap: {
                        '3': {
                            type: 'HORIZONTAL_RULE',
                            mutability: 'IMMUTABLE',
                            data: {},
                        },
                    },
                    blocks: [
                        {
                            key: 'epoas',
                            text: ' ',
                            type: 'atomic',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [
                                {
                                    offset: 0,
                                    length: 1,
                                    key: 3,
                                },
                            ],
                            data: {},
                        },
                    ],
                });

                expect(
                    normalize
                        .filterEntityType(
                            EditorState.createWithContent(contentState),
                            [ENTITY_TYPE.HORIZONTAL_RULE],
                        )
                        .getCurrentContent()
                        .getFirstBlock()
                        .getEntityAt(0),
                ).not.toBe(null);
            });
        });
    });
});
