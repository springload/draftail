import React from 'react';
import { shallow } from 'enzyme';
import DividerBlock from '../blocks/DividerBlock';

describe('DividerBlock', () => {
    it('exists', () => {
        expect(DividerBlock).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<DividerBlock />)).toBeDefined();
    });
});
