import React from 'react';
import { shallow } from 'enzyme';
import { ENTITY_TYPE } from '../api/constants';

import MediaBlock from '../blocks/MediaBlock';

const stubProps = {
    block: {},
    blockProps: {
        entity: {
            type: 'TEST',
        },
        entityConfig: {},
    },
};

describe('MediaBlock', () => {
    it('exists', () => {
        expect(MediaBlock).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<MediaBlock {...stubProps} />)).toMatchSnapshot();
    });

    it('image', () => {
        expect(shallow((
            <MediaBlock
                {...stubProps}
                blockProps={{ entity: { type: ENTITY_TYPE.IMAGE }, entityConfig: {} }}
            />
        ))).toMatchSnapshot();
    });

    it('embed', () => {
        expect(shallow((
            <MediaBlock
                {...stubProps}
                blockProps={{ entity: { type: ENTITY_TYPE.EMBED }, entityConfig: {} }}
            />
        ))).toMatchSnapshot();
    });

    it('#active', () => {
        expect(shallow(<MediaBlock {...stubProps} />).setState({
            active: true,
        })).toMatchSnapshot();
    });


    it('#blockProps.unlockEditor', () => {
        const unlockEditor = jest.fn();
        shallow((
            <MediaBlock
                {...stubProps}
                blockProps={Object.assign({ unlockEditor: unlockEditor }, stubProps.blockProps)}
            />
        )).instance().closeBlock();
        expect(unlockEditor.mock.calls.length).toBe(1);
    });
});
