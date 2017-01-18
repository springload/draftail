import React from 'react';
import { shallow } from 'enzyme';
import EmbedBlock from '../blocks/EmbedBlock';

const stubProps = {
    entity: {
        getData() {
            return {
                url: 'http://www.example.com/',
                title: 'Test title',
                providerName: 'Test provider',
                authorName: 'Test author',
                thumbnail: 'http://www.example.com/example.png',
            };
        },
    },
    isActive: false,
    onClick: () => {},
};

describe('EmbedBlock', () => {
    it('exists', () => {
        expect(EmbedBlock).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<EmbedBlock {...stubProps} />)).toMatchSnapshot();
    });

    it('#isActive', () => {
        expect(shallow((
            <EmbedBlock
                {...stubProps}
                isActive={true}
            />
        ))).toMatchSnapshot();
    });
});
