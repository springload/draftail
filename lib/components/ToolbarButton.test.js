import React from 'react';
import { shallow } from 'enzyme';
import ToolbarButton from '../components/ToolbarButton';

describe('ToolbarButton', () => {
    it('exists', () => {
        expect(ToolbarButton).toBeDefined();
    });

    it('empty', () => {
        expect(shallow(<ToolbarButton />)).toMatchSnapshot();
    });

    it('#name', () => {
        expect(shallow(<ToolbarButton name="TEST" />)).toMatchSnapshot();
    });

    it('#label', () => {
        expect(shallow(<ToolbarButton label="Test label" />)).toMatchSnapshot();
    });

    it('#icon', () => {
        expect(shallow(<ToolbarButton icon="icon-test" />)).toMatchSnapshot();
    });

    it('#active', () => {
        expect(shallow(<ToolbarButton active={true} />)).toMatchSnapshot();
    });

    it('#onClick', () => {
        const onClick = jest.fn();
        const event = { preventDefault: jest.fn() };
        shallow(<ToolbarButton onClick={onClick} />).simulate(
            'mousedown',
            event,
        );
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(event.preventDefault).toHaveBeenCalledTimes(1);
    });
});
