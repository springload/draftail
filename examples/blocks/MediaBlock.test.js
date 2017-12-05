import React from 'react';
import { shallow } from 'enzyme';
import { convertFromRaw, EditorState } from 'draft-js';

import { ENTITY_TYPE } from '../../lib';

import MediaBlock from '../blocks/MediaBlock';

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

describe('MediaBlock', () => {
    it('basic', () => {
        expect(shallow(<MediaBlock {...mockProps} />)).toMatchSnapshot();
    });

    it('image', () => {
        expect(
            shallow(
                <MediaBlock
                    {...mockProps}
                    blockProps={Object.assign({}, mockProps.blockProps, {
                        entity: {
                            getType: () => ENTITY_TYPE.IMAGE,
                        },
                    })}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('embed', () => {
        expect(
            shallow(
                <MediaBlock
                    {...mockProps}
                    blockProps={Object.assign({}, mockProps.blockProps, {
                        entity: {
                            getType: () => ENTITY_TYPE.EMBED,
                        },
                        entityConfig: {
                            type: ENTITY_TYPE.EMBED,
                        },
                    })}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('#isActive', () => {
        expect(
            shallow(<MediaBlock {...mockProps} />).setState({
                isActive: true,
            }),
        ).toMatchSnapshot();
    });

    it('#blockProps.lockEditor #blockProps.unlockEditor', () => {
        const lockEditor = jest.fn();
        const unlockEditor = jest.fn();

        const wrapper = shallow(
            <MediaBlock
                {...mockProps}
                blockProps={Object.assign({}, mockProps.blockProps, {
                    lockEditor,
                    unlockEditor,
                })}
            />,
        );

        wrapper.instance().onClick();
        expect(lockEditor).toHaveBeenCalledTimes(1);
        wrapper.instance().onClick();
        expect(unlockEditor).toHaveBeenCalledTimes(1);
    });

    it('#blockProps.onChange', () => {
        const onChange = jest.fn();

        const wrapper = shallow(
            <MediaBlock
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
