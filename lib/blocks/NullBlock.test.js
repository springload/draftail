import React from 'react';
import { shallow } from 'enzyme';
import NullBlock from '../blocks/NullBlock';

describe('NullBlock', () => {
    it('basic', () => {
        expect(shallow(<NullBlock />)).toMatchSnapshot();
    });
});
