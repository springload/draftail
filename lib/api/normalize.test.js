import { EditorState, convertFromHTML, ContentState } from 'draft-js';

import { BLOCK_TYPE, INLINE_STYLE } from '../api/constants';
import DraftUtils from '../api/DraftUtils';

import normalize from '../api/normalize';

describe('normalize', () => {
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
            const editorState = normalize.normaliseBlockDepth(
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
        it('works', () => {
            const contentState = ContentState.createFromBlockArray(
                convertFromHTML(
                    `<ul><li>UL</li></ul><p>P</p><h1>H1</h1><h2>H2</h2><h3>H3</h3>`,
                ),
            );
            const editorState = normalize.normaliseBlockType(
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
        it('works', () => {
            const contentState = ContentState.createFromBlockArray(
                convertFromHTML(
                    `<p><strong>s</strong><em>e</em><strong><em>b</em></strong></p>
                    <p><strong>s</strong><em>e</em><strong><em>b</em></strong></p>
                    <p><strong>s</strong></p>`,
                ),
            );
            const editorState = normalize.normaliseInlineStyle(
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
});
