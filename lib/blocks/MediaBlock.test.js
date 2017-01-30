import React from 'react';
import { shallow } from 'enzyme';
import { ENTITY_TYPE } from '../api/constants';

import MediaBlock from '../blocks/MediaBlock';

const mockProps = {
    block: {},
    blockProps: {
        entity: {
            type: 'TEST',
        },
        entityConfig: {},
    },
    contentState: {},
};

describe('MediaBlock', () => {
    it('exists', () => {
        expect(MediaBlock).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<MediaBlock {...mockProps} />)).toMatchSnapshot();
    });

    it('image', () => {
        expect(shallow((
            <MediaBlock
                {...mockProps}
                blockProps={{ entity: { type: ENTITY_TYPE.IMAGE }, entityConfig: {} }}
            />
        ))).toMatchSnapshot();
    });

    it('embed', () => {
        expect(shallow((
            <MediaBlock
                {...mockProps}
                blockProps={{ entity: { type: ENTITY_TYPE.EMBED }, entityConfig: {} }}
            />
        ))).toMatchSnapshot();
    });

    it('#isActive', () => {
        expect(shallow(<MediaBlock {...mockProps} />).setState({
            isActive: true,
        })).toMatchSnapshot();
    });


    it('#blockProps.unlockEditor', () => {
        const unlockEditor = jest.fn();
        shallow((
            <MediaBlock
                {...mockProps}
                blockProps={Object.assign({ unlockEditor: unlockEditor }, mockProps.blockProps)}
            />
        )).instance().closeBlock();
        expect(unlockEditor).toHaveBeenCalledTimes(1);
    });

    it('#blockProps.lockEditor', () => {
        const lockEditor = jest.fn();
        shallow((
            <MediaBlock
                {...mockProps}
                blockProps={Object.assign({ lockEditor: lockEditor }, mockProps.blockProps)}
            />
        )).instance().onClick();
        expect(lockEditor).toHaveBeenCalledTimes(1);
    });
});
