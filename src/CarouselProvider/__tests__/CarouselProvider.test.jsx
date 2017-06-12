import React from 'react';
import { shallow } from 'enzyme';
import CarouselProvider from '../';

describe('<CarouselProvider />', () => {
  it('should render', () => {
    const wrapper = shallow(<CarouselProvider>Hello</CarouselProvider>);
    expect(wrapper.exists()).toBe(true);
  });
  it('utility function getState should return the state', () => {
    const wrapper = shallow(<CarouselProvider orientation="vertical">Hello</CarouselProvider>);
    const instance = wrapper.instance();
    expect(instance.getStore()).toBe(instance.store);
  });
});
