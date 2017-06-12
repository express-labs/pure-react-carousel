import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

describe('<App />', () => {
  it('should render the demo app', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists()).toBe(true);
  });
});
