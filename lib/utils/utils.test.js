import React from 'react';
import { shallow } from 'enzyme';

import { getComponentWrapper } from '../utils/utils';

describe('utils', () => {
    it('#getComponentWrapper', () => {
        const Wrapped = () => <div />;
        const Wrapper = getComponentWrapper(Wrapped, {
            test: true,
        });

        expect(shallow(<Wrapper />)).toMatchSnapshot();
    });
});
