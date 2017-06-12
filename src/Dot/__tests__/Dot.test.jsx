import React from 'react';
import { shallow, mount } from 'enzyme';
import components from '../../helpers/component-config';
import Dot from '../Dot';
import Store from '../../Store/Store';

const { props } = components.Dot;

describe('<Dot />', () => {
  it('should render', () => {
    const wrapper = shallow(<Dot {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should add the dotSelected class when selected', () => {
    const newProps = Object.assign({}, props, { selected: true });
    const wrapper = shallow(<Dot {...newProps} />);
    expect(wrapper.hasClass('dotSelected')).toBe(true);
  });
  it('should add the carousel__dot--selected class when selected', () => {
    const newProps = Object.assign({}, props, { selected: true });
    const wrapper = shallow(<Dot {...newProps} />);
    expect(wrapper.hasClass('carousel__dot--selected')).toBe(true);
  });
  it('should call any supplied onClick as a callback', () => {
    const onClick = jest.fn();
    const newProps = Object.assign({}, props, { onClick });
    const wrapper = mount(<Dot {...newProps} />);
    expect(onClick.mock.calls.length).toBe(0);
    wrapper.find('button').simulate('click');
    expect(onClick.mock.calls.length).toBe(1);
  });
  it('should update store.state.currentSlide with the value of slide', () => {
    const onClick = jest.fn();
    const store = new Store(Object.assign({}, props, { currentSlide: 0 }));
    const newProps = Object.assign({}, props, { onClick, store });
    const wrapper = mount(<Dot {...newProps} />);
    expect(store.state.currentSlide).toBe(0);
    wrapper.find('button').simulate('click');
    expect(store.state.currentSlide).toBe(props.slide);
  });
});
