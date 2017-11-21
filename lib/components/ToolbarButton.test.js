import React from 'react';
import { shallow } from 'enzyme';
import ToolbarButton from '../components/ToolbarButton';

describe('ToolbarButton', () => {
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
        expect();
    });

    it('stops showing tooltip on click', () => {
        const wrapper = shallow(<ToolbarButton />);
        expect(wrapper.state('showTooltipOnHover')).toBe(true);
        const afterClick = wrapper.simulate('mousedown', {
            preventDefault: jest.fn(),
        });
        expect(afterClick.state('showTooltipOnHover')).toBe(false);
        const afterMouseLeave = afterClick.simulate('mouseleave', null);
        expect(afterMouseLeave.state('showTooltipOnHover')).toBe(true);
    });
});
