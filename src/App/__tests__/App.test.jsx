import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

describe('<App />', () => {
  it('should render the demo app', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should call handleChange when a select is changed', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.state('value')).toBe('0');
    wrapper.find('.select').simulate('change', { target: { value: '5' } });
    wrapper.update();
    expect(wrapper.state('value')).toBe('5');
  });
});
