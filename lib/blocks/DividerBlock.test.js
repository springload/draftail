import React from 'react';
import { shallow } from 'enzyme';
import DividerBlock from './DividerBlock';

describe('DividerBlock', () => {
    it('basic', () => {
        expect(shallow(<DividerBlock />)).toMatchSnapshot();
    });
});
