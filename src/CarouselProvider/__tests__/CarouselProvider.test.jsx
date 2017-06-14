import React from 'react';
import { shallow } from 'enzyme';
import clone from 'clone';
import CarouselProvider from '../';
import components from '../../helpers/component-config';

let props;

describe('<CarouselProvider />', () => {
  beforeEach(() => {
    props = clone(components.CarouselProvider.props);
  });
  it('should render', () => {
    const wrapper = shallow((
      <CarouselProvider
        {...props}
      >
        Hello
      </CarouselProvider>
    ));
    expect(wrapper.exists()).toBe(true);
  });
  it('utility function getState should return the state', () => {
    const wrapper = shallow((
      <CarouselProvider
        {...props}
        orientation="vertical"
      >Hello</CarouselProvider>
    ));
    const instance = wrapper.instance();
    expect(instance.getStore()).toBe(instance.store);
  });
});
