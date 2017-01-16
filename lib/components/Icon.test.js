import React from 'react';
import { shallow } from 'enzyme';
import Icon from '../components/Icon';

describe('Icon', () => {
    it('exists', () => {
        expect(Icon).toBeDefined();
    });

    it('#name', () => {
        expect(shallow(<Icon name="icon-test" />)).toMatchSnapshot();
    });

    it('#className', () => {
        expect(shallow(<Icon name="icon-test" className="u-test" />)).toMatchSnapshot();
    });

    it('#title', () => {
        expect(shallow(<Icon name="icon-test" title="Test title" />)).toMatchSnapshot();
    });
});
