import React from 'react';
import { shallow } from 'enzyme';
import ImageBlock from '../blocks/ImageBlock';

const mockProps = {
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
    it('basic', () => {
        expect(shallow(<ImageBlock {...mockProps} />)).toMatchSnapshot();
    });

    it('#isActive', () => {
        expect(
            shallow(<ImageBlock {...mockProps} isActive={true} />),
        ).toMatchSnapshot();
    });

    it('#entityConfig.imageFormats', () => {
        expect(
            shallow(
                <ImageBlock
                    {...mockProps}
                    entityConfig={{
                        imageFormats: [
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' },
                        ],
                    }}
                    isActive={true}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('#alignment', () => {
        expect(
            shallow(
                <ImageBlock
                    {...mockProps}
                    entityConfig={{
                        imageFormats: [
                            { label: 'Left', value: 'left' },
                            { label: 'Right', value: 'right' },
                        ],
                    }}
                    isActive={true}
                />,
            ).setState({ alignment: 'left' }),
        ).toMatchSnapshot();
    });

    it('#onCancel', () => {
        shallow(<ImageBlock {...mockProps} isActive={true} />)
            .find('.button.no')
            .simulate('click');
        expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
    });
});
