import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import clone from 'clone';
import Adapter from 'enzyme-adapter-react-16';
import ButtonLast from '../ButtonLast';
import Store from '../../Store/Store';
import components from '../../helpers/component-config';

configure({ adapter: new Adapter() });


let props;

describe('<ButtonLast />', () => {
  beforeEach(() => {
    props = clone(components.ButtonLast.props);
  });
  it('should render', () => {
    const wrapper = shallow(<ButtonLast {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should be disabled if the currentSlide is equal to totalSlides', () => {
    const newProps = Object.assign({}, props, { currentSlide: props.totalSlides });
    const wrapper = shallow(<ButtonLast {...newProps} />);
    expect(wrapper.prop('disabled')).toBe(true);
  });
  it('should be disabled if the disabled prop is set manually, regardless of currentSlide', () => {
    const wrapper = shallow(<ButtonLast {...props} disabled />);
    expect(wrapper.prop('disabled')).toBe(true);
  });
  it('should set the currentSlide to totalSlides - 1 when clicked', () => {
    const wrapper = mount(<ButtonLast {...props} />);
    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(props.carouselStore.getStoreState().currentSlide).toBe(props.totalSlides - 1);
  });
  it('should call an onClick function passed as a prop', () => {
    const onClick = jest.fn();
    const newProps = Object.assign({}, props, { onClick });
    const wrapper = mount(<ButtonLast {...newProps} />);
    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(onClick.mock.calls.length).toBe(1);
  });
  it('should set the button to disabled when (visibleSlides > 1) and (currentSlide > totalSlides - visibleSlides)', () => {
    const newProps = Object.assign({}, props, {
      currentSlide: 5,
      carouselStore: new Store({
        currentSlide: 5,
        totalSlides: 7,
        visibleSlides: 2,
      }),
      totalSlides: 7,
      visibleSlides: 2,
    });
    const wrapper = shallow(<ButtonLast {...newProps} />);
    expect(wrapper.prop('disabled')).toBe(true);
  });
  it('should NOT set the button to disabled when (visibleSlides > 1) and (currentSlide <= totalSlides - visibleSlides)', () => {
    const newProps = Object.assign({}, props, {
      currentSlide: 4,
      carouselStore: new Store({
        currentSlide: 4,
        totalSlides: 7,
        visibleSlides: 2,
      }),
      totalSlides: 7,
      visibleSlides: 2,
    });
    const wrapper = shallow(<ButtonLast {...newProps} />);
    expect(wrapper.prop('disabled')).toBe(false);
  });
});
