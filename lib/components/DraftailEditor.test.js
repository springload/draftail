import React from 'react';
import { shallow } from 'enzyme';
import DraftailEditor from '../components/DraftailEditor';

describe('DraftailEditor', () => {
    it('exists', () => {
        expect(DraftailEditor).toBeDefined();
    });

    it('empty', () => {
        expect(shallow(<DraftailEditor />)).toBeDefined();
    });

    it('#readOnly', () => {
        expect(shallow(<DraftailEditor />).setState({
            readOnly: true,
        }).hasClass('editor--readonly')).toBeTruthy();
    });
});
