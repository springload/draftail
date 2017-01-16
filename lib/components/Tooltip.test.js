import React from 'react';
import { shallow } from 'enzyme';
import Tooltip from '../components/Tooltip';

const stubProps = {
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
        expect(shallow(<Tooltip {...stubProps} />)).toMatchSnapshot();
    });

    it('#entityData.url', () => {
        expect(shallow((
            <Tooltip
                {...stubProps}
                entityData={{
                    url: 'http://www.example.com/',
                }}
            />
        ))).toMatchSnapshot();
    });

    it('#entityData.label', () => {
        expect(shallow((
            <Tooltip
                {...stubProps}
                entityData={{
                    label: 'Test label',
                }}
            />
        ))).toMatchSnapshot();
    });

    it('#onEdit', () => {
        shallow(<Tooltip {...stubProps} />).find('button').first().simulate('click');
        expect(stubProps.onEdit.mock.calls.length).toBe(1);
    });

    it('#onRemove', () => {
        shallow(<Tooltip {...stubProps} />).find('button').last().simulate('click');
        expect(stubProps.onRemove.mock.calls.length).toBe(1);
    });
});
