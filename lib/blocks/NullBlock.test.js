import React from 'react';
import { shallow } from 'enzyme';
import NullBlock from '../blocks/NullBlock';

describe('NullBlock', () => {
    it('exists', () => {
        expect(NullBlock).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<NullBlock />)).toBeDefined();
    });
});
