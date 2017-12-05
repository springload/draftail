import React from 'react';
import { shallow } from 'enzyme';
import ImageBlock from '../blocks/ImageBlock';

const mockProps = {
    entity: {
        getData() {
            return {
                src: 'http://www.example.com/example.png',
                alt: 'Test alt',
                alignment: 'right',
            };
        },
    },
    entityConfig: {},
    isActive: false,
    onClick: jest.fn(),
    onSave: jest.fn(),
};

describe('ImageBlock', () => {
    it('empty', () => {
        expect(
            shallow(
                <ImageBlock
                    {...mockProps}
                    entity={{
                        getData() {
                            return {};
                        },
                    }}
                />,
            ),
        ).toMatchSnapshot();
    });

    it('basic', () => {
        expect(shallow(<ImageBlock {...mockProps} />)).toMatchSnapshot();
    });

    it('#isActive', () => {
        expect(
            shallow(<ImageBlock {...mockProps} isActive={true} />),
        ).toMatchSnapshot();
    });

    it('empty #isActive', () => {
        expect(
            shallow(
                <ImageBlock
                    {...mockProps}
                    isActive={true}
                    entity={{
                        getData() {
                            return {};
                        },
                    }}
                />,
            ),
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

    it('changeText', () => {
        const wrapper = shallow(<ImageBlock {...mockProps} isActive={true} />);

        wrapper.find('[type="text"]').simulate('change', {
            currentTarget: {
                value: 'new alt',
            },
        });

        expect(mockProps.onSave).toHaveBeenCalledWith(
            expect.objectContaining({ alt: 'new alt' }),
        );
    });

    it('changeAlignment', () => {
        const wrapper = shallow(
            <ImageBlock
                {...mockProps}
                isActive={true}
                entityConfig={{
                    imageFormats: [
                        {
                            value: 'left',
                            label: 'Left',
                        },
                        { value: 'center', label: 'Center' },
                    ],
                }}
            />,
        );

        wrapper
            .find('[type="radio"]')
            .at(1)
            .simulate('change', {
                currentTarget: {
                    value: 'center',
                },
            });

        expect(mockProps.onSave).toHaveBeenCalledWith(
            expect.objectContaining({ alignment: 'center' }),
        );
    });
});
