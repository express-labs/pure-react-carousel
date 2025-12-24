import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import clone from 'clone';
import components from '../../helpers/component-config';
import Slide from '../Slide';

configure({ adapter: new Adapter() });


describe('<Slide />', () => {
  let props;

  beforeEach(() => {
    props = clone(components.Slide.props);
  });
  it('should render', () => {
    const wrapper = shallow(<Slide {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should show an aria focus ring when focused', () => {
    const wrapper = shallow(<Slide {...props} />);
    expect(wrapper.state('focused')).toBe(false);
    expect(wrapper.find('.focusRing').exists()).toBe(false);
    wrapper.find('.slide').simulate('focus');
    wrapper.update();
    expect(wrapper.state('focused')).toBe(true);
    expect(wrapper.find('.focusRing').exists()).toBe(true);
  });
  it('should call any supplied onFocus when focused and pass it event data', () => {
    const onFocus = jest.fn();
    const wrapper = shallow(<Slide {...props} onFocus={onFocus} />);
    wrapper.find('.slide').simulate('focus', { data: 1 });
    wrapper.update();
    expect(onFocus).toHaveBeenCalledTimes(1);
    expect(onFocus.mock.calls[0][0]).toEqual({ data: 1 });
  });
  it('should remove the aria focus ring when blur after focus', () => {
    const wrapper = shallow(<Slide {...props} />);
    expect(wrapper.state('focused')).toBe(false);
    expect(wrapper.find('.focusRing').exists()).toBe(false);
    wrapper.find('.slide').simulate('focus');
    wrapper.update();
    wrapper.find('.slide').simulate('blur');
    wrapper.update();
    expect(wrapper.state('focused')).toBe(false);
    expect(wrapper.find('.focusRing').exists()).toBe(false);
  });
  it('should call any supplied onBlur when blurred and pass it event data', () => {
    const onBlur = jest.fn();
    const wrapper = shallow(<Slide {...props} onBlur={onBlur} />);
    wrapper.find('.slide').simulate('blur', { data: 1 });
    wrapper.update();
    expect(onBlur).toHaveBeenCalledTimes(1);
    expect(onBlur.mock.calls[0][0]).toEqual({ data: 1 });
  });
  it('should set the width to 100% when orientation is "vertical"', () => {
    const wrapper = shallow(<Slide {...props} orientation="vertical" />);
    expect(wrapper.find('.slide').prop('style').width).toBe('100%');
  });

  it('should apply any supplied classes to hidden slides', () => {
    const wrapper = shallow((
      <Slide
        classNameHidden="i-be-hidden"
        classNameVisible="i-be-visible"
        currentSlide={1}
        index={0}
        naturalSlideHeight={400}
        naturalSlideWidth={300}
        orientation="horizontal"
        slideSize={25}
        totalSlides={6}
        visibleSlides={2}
      />
    ));
    expect(wrapper.find('.slide').hasClass('i-be-hidden')).toBe(true);
    expect(wrapper.find('.slide').hasClass('carousel__slide--hidden')).toBe(true);
  });
  it('should apply any supplied classes to visible slides', () => {
    const wrapper = shallow((
      <Slide
        classNameHidden="i-be-hidden"
        classNameVisible="i-be-visible"
        currentSlide={0}
        index={0}
        naturalSlideHeight={400}
        naturalSlideWidth={300}
        orientation="horizontal"
        slideSize={25}
        totalSlides={6}
        visibleSlides={2}
      />
    ));
    expect(wrapper.find('.slide').hasClass('i-be-visible')).toBe(true);
    expect(wrapper.find('.slide').hasClass('carousel__slide--visible')).toBe(true);
  });

  it('should correctly set styles, if isIntrinsicHeight is set', () => {
    // this is for testing only.

    const wrapper = shallow(<Slide {...props} isIntrinsicHeight />);
    const slideStyle = wrapper.find('.slide').prop('style');
    expect(slideStyle.paddingBottom).toBe('unset');
    expect(slideStyle.height).toBe('unset');

    const innerSlideStyle = wrapper.find('.carousel__inner-slide').prop('style');
    expect(innerSlideStyle.position).toBe('unset');
  });
  it('should correctly set styles, in vertical mode if isIntrinsicHeight is set', () => {
    // this is for testing only.
    const wrapper = shallow(<Slide {...props} orientation="vertical" isIntrinsicHeight />);
    const slideStyle = wrapper.find('.slide').prop('style');
    expect(slideStyle.paddingBottom).toBe('unset');
    expect(slideStyle.width).toBe('unset');

    const innerSlideStyle = wrapper.find('.carousel__inner-slide').prop('style');
    expect(innerSlideStyle.position).toBe('unset');
  });
});
