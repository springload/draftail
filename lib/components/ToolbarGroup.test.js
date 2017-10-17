import React from 'react';
import { shallow } from 'enzyme';
import ToolbarGroup from './ToolbarGroup';

describe('ToolbarGroup', () => {
    it('exists', () => {
        expect(ToolbarGroup).toBeDefined();
    });

    it('empty', () => {
        expect(shallow(<ToolbarGroup />)).toMatchSnapshot();
    });

    it('empty children', () => {
        expect(
            shallow(
                <ToolbarGroup>
                    {null}
                    {null}
                </ToolbarGroup>,
            ),
        ).toMatchSnapshot();
    });

    it('empty array children', () => {
        expect(shallow(<ToolbarGroup>{[]}</ToolbarGroup>)).toMatchSnapshot();
    });
});
