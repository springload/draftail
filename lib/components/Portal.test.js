import React from 'react';
import { shallow } from 'enzyme';
import Portal from '../components/Portal';

describe('Portal', () => {
    it('exists', () => {
        expect(Portal).toBeDefined();
    });

    it('empty', () => {
        expect(shallow(<Portal />)).toMatchSnapshot();
    });

    it('#children', () => {
        expect(shallow((
            <Portal>
                Test!
            </Portal>
        ))).toMatchSnapshot();
    });
});
