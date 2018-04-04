import React from 'react';
import { shallow, configure } from 'enzyme';
import clone from 'clone';
import Adapter from 'enzyme-adapter-react-16';
import components from '../../helpers/component-config';
import ButtonPlay from '../ButtonPlay';

configure({ adapter: new Adapter() });

let props;

describe('<ButtonPlay />', () => {
  beforeEach(() => {
    props = clone(components.ButtonPlay.props);
  });
  it('should render', () => {
    const wrapper = shallow(<ButtonPlay {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should update isPlaying in the carousel store toggling it from false to true after one click and back again after another click.', () => {
    const wrapper = shallow(<ButtonPlay {...props} />);
    wrapper.find('button').simulate('click');
    expect(props.carouselStore.state.isPlaying).toBe(true);
    // manualy replicate WithStore HOC()
    wrapper.setProps({ isPlaying: props.carouselStore.state.isPlaying });
    wrapper.find('button').simulate('click');
    expect(props.carouselStore.state.isPlaying).toBe(false);
  });
  it('should call any supplied onClick function on click', () => {
    const onClick = jest.fn();
    const wrapper = shallow(<ButtonPlay {...props} onClick={onClick} />);
    wrapper.find('button').simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
