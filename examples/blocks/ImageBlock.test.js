import React from 'react';
import { shallow } from 'enzyme';
import { convertFromRaw, EditorState } from 'draft-js';

import { ENTITY_TYPE } from '../../lib';

import ImageBlock from '../blocks/ImageBlock';

const contentState = convertFromRaw({
    entityMap: {
        '0': {
            type: ENTITY_TYPE.IMAGE,
            mutability: 'IMMUTABLE',
            data: {
                src:
                    'https://springload.github.io/draftail/static/example-lowres-image.jpg',
            },
        },
    },
    blocks: [
        {
            key: 'b3kdk',
            text: ' ',
            type: 'atomic',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
                {
                    offset: 0,
                    length: 1,
                    key: 0,
                },
            ],
            data: {},
        },
    ],
});

const mockProps = {
    block: contentState.getFirstBlock(),
    blockProps: {
        editorState: EditorState.createWithContent(contentState),
        entity: {
            getType: () => ENTITY_TYPE.IMAGE,
            getData: () => ({
                src: 'http://www.example.com/example.png',
                alt: 'Test alt',
            }),
        },
        entityConfig: {
            type: ENTITY_TYPE.IMAGE,
        },
        onChange: jest.fn(),
        lockEditor: jest.fn(),
        unlockEditor: jest.fn(),
    },
    contentState,
};

describe('ImageBlock', () => {
    it('empty', () => {
        expect(
            shallow(
                <ImageBlock
                    {...mockProps}
                    entity={{
                        getData() {
                            return {};
                        },
                    }}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('basic', () => {
        expect(shallow(<ImageBlock {...mockProps} />)).toMatchSnapshot();
    });

    it('#entityConfig.icon', () => {
        expect(
            shallow(
                <ImageBlock
                    {...mockProps}
                    entityConfig={{
                        icon: '#icon-image',
                    }}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('#isActive', () => {
        expect(
            shallow(<ImageBlock {...mockProps} isActive={true} />),
        ).toMatchSnapshot();
    });

    it('empty #isActive', () => {
        expect(
            shallow(
                <ImageBlock
                    {...mockProps}
                    isActive={true}
                    entity={{
                        getData() {
                            return {};
                        },
                    }}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('changeText', () => {
        const wrapper = shallow(<ImageBlock {...mockProps} isActive={true} />);

        wrapper.find('[type="text"]').simulate('change', {
            currentTarget: {
                value: 'new alt',
            },
        });

        expect(mockProps.onSave).toHaveBeenCalledWith(
            expect.objectContaining({ alt: 'new alt' }),
        );
    });
});
