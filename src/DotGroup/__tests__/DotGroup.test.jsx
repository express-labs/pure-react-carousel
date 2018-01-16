import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import clone from 'clone';
import components from '../../helpers/component-config';
import DotGroup from '../DotGroup';

configure({ adapter: new Adapter() });


let props;

describe('<DotGroup />', () => {
  beforeEach(() => {
    props = clone(components.DotGroup.props);
  });
  it('should render', () => {
    const wrapper = shallow(<DotGroup {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should render any children', () => {
    const wrapper = shallow(<DotGroup {...props}><h1>Hello There</h1></DotGroup>);
    expect(wrapper.find('h1').text()).toBe('Hello There');
  });
  it('should render dots with numbers if dotNumbers prop is true', () => {
    const wrapper = shallow(<DotGroup {...props} dotNumbers />);
    expect(wrapper.find('span').at(0).text()).toEqual('1');
    expect(wrapper.find('span').at(1).text()).toEqual('2');
    expect(wrapper.find('span').at(2).text()).toEqual('3');
  });
  it('should NOT render dots with numbers if dotNumbers prop is not set', () => {
    const wrapper = shallow(<DotGroup {...props} />);
    expect(wrapper.find('span').at(0).text()).toEqual('');
    expect(wrapper.find('span').at(1).text()).toEqual('');
    expect(wrapper.find('span').at(2).text()).toEqual('');
  });
});
