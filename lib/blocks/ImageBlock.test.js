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
    onClick: jest.fn(),
    onSave: jest.fn(),
    onCancel: jest.fn(),
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

    it('#onSave', () => {
        shallow(<ImageBlock {...mockProps} isActive={true} />)
            .find('.button')
            .at(0)
            .simulate('click');
        expect(mockProps.onSave).toHaveBeenCalledTimes(1);
    });

    it('#onCancel', () => {
        shallow(<ImageBlock {...mockProps} isActive={true} />)
            .find('.button.no')
            .simulate('click');
        expect(mockProps.onCancel).toHaveBeenCalledTimes(1);
    });

    it('componentWillReceiveProps', () => {
        const wrapper = shallow(<ImageBlock {...mockProps} />);

        wrapper.instance().componentWillReceiveProps({
            entity: {
                getData: () => ({}),
            },
        });

        expect(wrapper.state('alignment')).toBe('left');
    });

    it('changeText', () => {
        const wrapper = shallow(<ImageBlock {...mockProps} isActive={true} />);

        wrapper.find('[type="text"]').simulate('change', {
            currentTarget: {
                value: 'new alt',
            },
        });

        expect(wrapper.state('altText')).toBe('new alt');
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

        expect(wrapper.state('alignment')).toBe('center');
    });
});
