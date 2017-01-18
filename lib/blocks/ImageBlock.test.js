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
    isActive: false,
    onClick: () => {},
    onSave: () => {},
    onCancel: jest.fn(),
};

describe('ImageBlock', () => {
    it('exists', () => {
        expect(ImageBlock).toBeDefined();
    });

    it('basic', () => {
        expect(shallow(<ImageBlock {...stubProps} />)).toMatchSnapshot();
    });

    it('#isActive', () => {
        expect(shallow((
            <ImageBlock
                {...stubProps}
                isActive={true}
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
                isActive={true}
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
                isActive={true}
            />
        )).setState({ alignment: 'left' })).toMatchSnapshot();
    });


    it('#onCancel', () => {
        shallow((
            <ImageBlock
                {...stubProps}
                isActive={true}
            />
        )).find('.button.no').simulate('click');
        expect(stubProps.onCancel.mock.calls.length).toBe(1);
    });
});
