import React from 'react';
import { shallow } from 'enzyme';
import { convertFromRaw } from 'draft-js';
import { ENTITY_TYPE } from '../api/constants';

import MediaBlock from '../blocks/MediaBlock';

const contentState = convertFromRaw({
    entityMap: {
        '0': {
            type: 'IMAGE',
            mutability: 'IMMUTABLE',
            data: {
                src:
                    'https://springload.github.io/draftail/assets/example-image.png',
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
        entity: {
            type: 'TEST',
        },
        entityConfig: {},
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
                    blockProps={{
                        entity: { type: ENTITY_TYPE.IMAGE },
                        entityConfig: {},
                    }}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('embed', () => {
        expect(
            shallow(
                <MediaBlock
                    {...mockProps}
                    blockProps={{
                        entity: { type: ENTITY_TYPE.EMBED },
                        entityConfig: {},
                    }}
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

    it('#blockProps.unlockEditor', () => {
        const unlockEditor = jest.fn();
        shallow(
            <MediaBlock
                {...mockProps}
                blockProps={Object.assign(
                    { unlockEditor: unlockEditor },
                    mockProps.blockProps,
                )}
            />,
        )
            .instance()
            .onSave();
        expect(unlockEditor).toHaveBeenCalledTimes(1);
    });

    it('#blockProps.lockEditor', () => {
        const lockEditor = jest.fn();
        shallow(
            <MediaBlock
                {...mockProps}
                blockProps={Object.assign(
                    { lockEditor: lockEditor },
                    mockProps.blockProps,
                )}
            />,
        )
            .instance()
            .onClick();
        expect(lockEditor).toHaveBeenCalledTimes(1);
    });
});
