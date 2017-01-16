import React from 'react';
import { shallow } from 'enzyme';
import ImageBlock from '../blocks/ImageBlock';

const stubProps = {
    entity: {
        getData() {
            return {
                src: 'http://www.example.com/example.png',
                alt: 'Test alt',
                altText: 'Test alt text',
                alignment: 'right',
            };
        },
    },
    entityConfig: {},
    active: false,
    onClick: () => {},
    onSave: () => {},
    onCancel: () => {},
};

describe('ImageBlock', () => {
    it('exists', () => {
        expect(ImageBlock).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<ImageBlock {...stubProps} />)).toMatchSnapshot();
    });

    it('#active', () => {
        expect(shallow((
            <ImageBlock
                {...stubProps}
                active={true}
            />
        ))).toMatchSnapshot();
    });

    it('#entityConfig.imageFormats', () => {
        expect(shallow((
            <ImageBlock
                {...stubProps}
                entityConfig={{
                    imageFormats: [
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                    ],
                }}
                active={true}
            />
        ))).toMatchSnapshot();
    });

    it('#alignment', () => {
        expect(shallow((
            <ImageBlock
                {...stubProps}
                entityConfig={{
                    imageFormats: [
                        { label: 'Left', value: 'left' },
                        { label: 'Right', value: 'right' },
                    ],
                }}
                active={true}
            />
        )).setState({ alignment: 'left' })).toMatchSnapshot();
    });
});
