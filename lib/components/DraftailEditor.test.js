import React from 'react';
import { shallow } from 'enzyme';
import DraftailEditor from '../components/DraftailEditor';

describe('DraftailEditor', () => {
    it('exists', () => {
        expect(DraftailEditor).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<DraftailEditor />)).toBeDefined();
    });
});
