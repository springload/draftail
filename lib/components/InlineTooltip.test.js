import React from 'react';
import { shallow } from 'enzyme';
import InlineTooltip from '../components/InlineTooltip';

const mockProps = {
    position: {
        top: 0,
        left: 0,
    },
    entityData: {},
    onEdit: jest.fn(),
    onRemove: jest.fn(),
};

describe('InlineTooltip', () => {
    it('basic', () => {
        expect(shallow(<InlineTooltip {...mockProps} />)).toMatchSnapshot();
    });

    it('#entityData.url', () => {
        expect(
            shallow(
                <InlineTooltip
                    {...mockProps}
                    entityData={{
                        url: 'http://www.example.com/',
                    }}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('#onEdit', () => {
        shallow(<InlineTooltip {...mockProps} />)
            .find('button')
            .first()
            .simulate('click');
        expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
    });

    it('#onRemove', () => {
        shallow(<InlineTooltip {...mockProps} />)
            .find('button')
            .last()
            .simulate('click');
        expect(mockProps.onRemove).toHaveBeenCalledTimes(1);
    });
});
