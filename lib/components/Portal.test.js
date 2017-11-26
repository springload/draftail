import React from 'react';
import { shallow } from 'enzyme';
import Portal from '../components/Portal';

describe('Portal', () => {
    it('empty', () => {
        expect(shallow(<Portal />)).toMatchSnapshot();
    });

    it('#children', () => {
        expect(shallow(<Portal>Test!</Portal>)).toMatchSnapshot();
    });

    it('component lifecycle', () => {
        const wrapper = shallow(<Portal>Test!</Portal>);

        wrapper.instance().componentDidMount();

        expect(document.body.innerHTML).toBe(
            '<div><div data-reactroot="">Test!</div></div>',
        );

        expect(wrapper.instance().portal).toBe(document.body.children[0]);

        wrapper.instance().componentDidMount();

        wrapper.instance().componentWillUnmount();

        expect(document.body.innerHTML).toBe('');
    });
});
