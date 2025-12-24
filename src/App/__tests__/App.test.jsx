import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from '../App';

configure({ adapter: new Adapter() });


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
