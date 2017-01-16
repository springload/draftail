import React from 'react';
import { shallow } from 'enzyme';
import Button from '../components/Button';

describe('Button', () => {
    it('exists', () => {
        expect(Button).toBeDefined();
    });

    it('empty', () => {
        expect(shallow(<Button />)).toMatchSnapshot();
    });

    it('#label', () => {
        expect(shallow(<Button label="Test label" />)).toMatchSnapshot();
    });

    it('#icon', () => {
        expect(shallow(<Button icon="icon-test" />)).toMatchSnapshot();
    });

    it('#active', () => {
        expect(shallow(<Button active={true} />)).toMatchSnapshot();
    });

    it('#onClick', () => {
        const onClick = jest.fn();
        const event = { preventDefault: jest.fn() };
        shallow(<Button onClick={onClick} />).simulate('mousedown', event);
        expect(onClick.mock.calls.length).toBe(1);
        expect(event.preventDefault.mock.calls.length).toBe(1);
    });
});
