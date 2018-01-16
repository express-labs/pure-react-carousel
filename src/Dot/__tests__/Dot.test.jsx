import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import clone from 'clone';
import components from '../../helpers/component-config';
import Dot from '../Dot';
import Store from '../../Store/Store';

configure({ adapter: new Adapter() });


let props;

describe('<Dot />', () => {
  beforeEach(() => {
    props = clone(components.Dot.props);
  });
  it('should render', () => {
    const wrapper = shallow(<Dot {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should add the dotSelected class when selected', () => {
    const newProps = Object.assign({}, props, { selected: true });
    const wrapper = shallow(<Dot {...newProps} />);
    expect(wrapper.hasClass('dotSelected')).toBe(true);
  });
  it('should add the carousel__dot--selected class when selected', () => {
    const newProps = Object.assign({}, props, { selected: true });
    const wrapper = shallow(<Dot {...newProps} />);
    expect(wrapper.hasClass('carousel__dot--selected')).toBe(true);
  });
  it('should call any supplied onClick as a callback', () => {
    const onClick = jest.fn();
    const newProps = Object.assign({}, props, { onClick });
    const wrapper = mount(<Dot {...newProps} />);
    expect(onClick.mock.calls.length).toBe(0);
    wrapper.find('button').simulate('click');
    expect(onClick.mock.calls.length).toBe(1);
  });
  it('should update carouselStore.state.currentSlide with the value of slide', () => {
    const onClick = jest.fn();
    const carouselStore = new Store(Object.assign({}, props, { currentSlide: 0 }));
    const newProps = Object.assign({}, props, { onClick, carouselStore });
    const wrapper = mount(<Dot {...newProps} />);
    expect(carouselStore.state.currentSlide).toBe(0);
    wrapper.find('button').simulate('click');
    expect(carouselStore.state.currentSlide).toEqual(props.slide);
  });
  it('should keep the last slide pegged to the right of the viewport if visibleSlides > 1', () => {
    const wrapper = mount(<Dot {...props} slide={10} />);
    wrapper.find('button').simulate('click');
    expect(props.carouselStore.getStoreState().currentSlide).toBe(8);
  });
  it('should not override disabled if disabled prop is set to false manually', () => {
    const wrapper = mount(<Dot {...props} slide={10} disabled={false} />);
    expect(wrapper.find('button').prop('disabled')).toBe(false);
  });
  it('should not override disabled if disabled prop is set to true manually', () => {
    const wrapper = mount(<Dot {...props} slide={0} disabled />);
    expect(wrapper.find('button').prop('disabled')).toBe(true);
  });
});
