import React from 'react';
import { shallow } from 'enzyme';

import ListNesting from '../components/ListNesting';

jest.mock('draft-js/lib/generateRandomKey', () => () => 'a');

describe('ListNesting', () => {
    it('works', () => {
        expect(shallow(<ListNesting max={0} />)).toMatchSnapshot();
    });

    it('max > DRAFT_MAX_DEPTH', () => {
        expect(shallow(<ListNesting max={6} />)).toMatchSnapshot();
    });
});
