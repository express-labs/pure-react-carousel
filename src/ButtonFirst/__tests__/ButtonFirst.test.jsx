import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import clone from 'clone';
import ButtonFirst from '../ButtonFirst';
import components from '../../helpers/component-config';

configure({ adapter: new Adapter() });


let props;

describe('<ButtonFirst />', () => {
  beforeEach(() => {
    props = clone(components.ButtonFirst.props);
  });
  it('should render', () => {
    const wrapper = shallow(<ButtonFirst {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should be disabled if the currentSlide is 0', () => {
    const newProps = Object.assign({}, props, { currentSlide: 0 });
    const wrapper = shallow(<ButtonFirst {...newProps} />);
    expect(wrapper.prop('disabled')).toBe(true);
  });
  it('should be disabled if the disabled prop is set manually, regardless of currentSlide', () => {
    const wrapper = shallow(<ButtonFirst {...props} disabled />);
    expect(wrapper.prop('disabled')).toBe(true);
  });
  it('should set the currentSlide to 0 when clicked', () => {
    const wrapper = mount(<ButtonFirst {...props} />);
    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(props.carouselStore.getStoreState().currentSlide).toBe(0);
  });
  it('should call an onClick function passed as a prop', () => {
    const onClick = jest.fn();
    const newProps = Object.assign({}, props, { onClick });
    const wrapper = mount(<ButtonFirst {...newProps} />);
    wrapper.find('button').simulate('click');
    expect(onClick.mock.calls.length).toBe(1);
  });
});
