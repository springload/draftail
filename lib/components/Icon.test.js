import React from 'react';
import { shallow } from 'enzyme';
import Icon from '../components/Icon';

describe('Icon', () => {
    it('exists', () => {
        expect(Icon).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<Icon name="test" />)).toBeDefined();
    });
});
