import React from 'react';
import { shallow } from 'enzyme';
import Tooltip from '../components/Tooltip';

const mockProps = {
    position: {
        top: 0,
        left: 0,
    },
    entityData: {},
    onEdit: jest.fn(),
    onRemove: jest.fn(),
};

describe('Tooltip', () => {
    it('exists', () => {
        expect(Tooltip).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<Tooltip {...mockProps} />)).toMatchSnapshot();
    });

    it('#entityData.url', () => {
        expect(shallow((
            <Tooltip
                {...mockProps}
                entityData={{
                    url: 'http://www.example.com/',
                }}
            />
        ))).toMatchSnapshot();
    });

    it('#entityData.label', () => {
        expect(shallow((
            <Tooltip
                {...mockProps}
                entityData={{
                    label: 'Test label',
                }}
            />
        ))).toMatchSnapshot();
    });

    it('#onEdit', () => {
        shallow(<Tooltip {...mockProps} />).find('button').first().simulate('click');
        expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
    });

    it('#onRemove', () => {
        shallow(<Tooltip {...mockProps} />).find('button').last().simulate('click');
        expect(mockProps.onRemove).toHaveBeenCalledTimes(1);
    });
});
