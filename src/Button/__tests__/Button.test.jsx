import React from 'react';
import { shallow } from 'enzyme';
import Button from '../Button';

describe('<Button />', () => {
  it('should render', () => {
    const wrapper = shallow(<Button />);
    expect(wrapper.exists()).toBe(true);
  });
});
