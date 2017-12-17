import React from 'react';
import { shallow } from 'enzyme';
import { convertFromRaw, EditorState } from 'draft-js';

import EmbedBlock from '../blocks/EmbedBlock';

const contentState = convertFromRaw({
    entityMap: {
        '0': {
            type: 'EMBED',
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
            getType: () => 'EMBED',
            getData: () => ({
                url: 'http://www.example.com/',
                title: 'Test title',
                providerName: 'Test provider',
                authorName: 'Test author',
                thumbnail: 'http://www.example.com/example.png',
            }),
        },
        entityConfig: {
            type: 'EMBED',
        },
        onChange: jest.fn(),
        lockEditor: jest.fn(),
        unlockEditor: jest.fn(),
    },
    contentState,
};

describe('EmbedBlock', () => {
    it('#entityConfig.icon', () => {
        expect(
            shallow(
                <EmbedBlock
                    {...mockProps}
                    entityConfig={{
                        icon: '#icon-embed',
                    }}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('#isActive', () => {
        expect(
            shallow(<EmbedBlock {...mockProps} isActive={true} />),
        ).toMatchSnapshot();
    });
});

describe('EmbedBlock', () => {
    it('basic', () => {
        expect(shallow(<EmbedBlock {...mockProps} />)).toMatchSnapshot();
    });

    it('embed', () => {
        expect(
            shallow(
                <EmbedBlock
                    {...mockProps}
                    blockProps={Object.assign({}, mockProps.blockProps, {
                        entity: {
                            getType: () => 'EMBED',
                        },
                        entityConfig: {
                            type: 'EMBED',
                        },
                    })}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('#blockProps.onChange', () => {
        const onChange = jest.fn();

        const wrapper = shallow(
            <EmbedBlock
                {...mockProps}
                blockProps={Object.assign({}, mockProps.blockProps, {
                    onChange,
                })}
            />,
        );

        wrapper.instance().onSave({
            value: 'test',
        });
        expect(onChange).toHaveBeenCalledTimes(1);
    });
});
