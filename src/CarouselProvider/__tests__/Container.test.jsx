import React from 'react';
import { shallow } from 'enzyme';
import Container from '../Container';

describe('<Container />', () => {
  it('should render', () => {
    const wrapper = shallow(<Container />);
    expect(wrapper.exists()).toBe(true);
  });
});
