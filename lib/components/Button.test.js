import React from 'react';
import { shallow } from 'enzyme';
import Button from '../components/Button';

describe('Button', () => {
    it('exists', () => {
        expect(Button).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<Button label="Test" onClick={() => {}} />)).toBeDefined();
    });
});
