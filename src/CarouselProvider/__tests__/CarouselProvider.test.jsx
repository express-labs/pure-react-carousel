import React from 'react';
import { shallow } from 'enzyme';
import CarouselProvider from '../';

describe('<CarouselProvider />', () => {
  it('should render', () => {
    const wrapper = shallow(<CarouselProvider>Hello</CarouselProvider>);
    expect(wrapper.exists()).toBe(true);
  });
});
