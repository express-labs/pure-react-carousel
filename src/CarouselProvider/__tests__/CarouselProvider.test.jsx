import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import clone from 'clone';
import CarouselProvider from '..';
import components from '../../helpers/component-config';

configure({ adapter: new Adapter() });


let props;

jest.useFakeTimers();

describe('<CarouselProvider />', () => {
  beforeEach(() => {
    props = clone(components.CarouselProvider.props);
  });
  it('should render', () => {
    const wrapper = shallow((
      <CarouselProvider
        {...props}
      >
        Hello
      </CarouselProvider>
    ));
    expect(wrapper.exists()).toBe(true);
  });
  it('utility function getStoreState should return the state', () => {
    const wrapper = shallow((
      <CarouselProvider
        {...props}
        orientation="vertical"
      >
Hello
      </CarouselProvider>
    ));
    const instance = wrapper.instance();
    expect(instance.getStore()).toBe(instance.carouselStore);
  });
  it('should update the carouselStore values for slideSize and slideTraySize if totalSlides prop changes', () => {
    const wrapper = shallow(<CarouselProvider {...props} totalSlides={4} />);
    const instance = wrapper.instance();
    expect(instance.carouselStore.state.slideSize).toBe(25);
    expect(instance.carouselStore.state.slideTraySize).toBe(400);
    wrapper.setProps({ totalSlides: 2 });
    expect(instance.carouselStore.state.slideSize).toBe(50);
    expect(instance.carouselStore.state.slideTraySize).toBe(200);
  });
  it('should update the carouselStore values for slideSize and slideTraySize if visibleSlides prop changes', () => {
    const wrapper = shallow(<CarouselProvider {...props} totalSlides={4} />);
    const instance = wrapper.instance();
    expect(instance.carouselStore.state.slideSize).toBe(25);
    expect(instance.carouselStore.state.slideTraySize).toBe(400);
    wrapper.setProps({ visibleSlides: 2 });
    expect(instance.carouselStore.state.slideSize).toBe(25);
    expect(instance.carouselStore.state.slideTraySize).toBe(200);
  });
  it('should not update the carouselStore if some prop we do not track changes', () => {
    const wrapper = shallow(<CarouselProvider {...props} data-foo={1} />);
    const instance = wrapper.instance();
    const start = clone(instance.carouselStore.state);
    wrapper.setProps({ 'data-foo': 2 });
    const end = clone(instance.carouselStore.state);
    expect(start).toEqual(end);
  });
  it('should not reset the currentSlide or disableAnimation values when unrelated props change', () => {
    const wrapper = shallow(<CarouselProvider {...props} data-foo={1} />);
    const instance = wrapper.instance();
    instance.carouselStore.setStoreState({ currentSlide: 2 });
    const start = clone(instance.carouselStore.state);
    wrapper.setProps({ naturalSlideWidth: 300 });
    const end = clone(instance.carouselStore.state);
    expect(start.currentSlide).toEqual(end.currentSlide);
    expect(start.disableAnimation).toEqual(end.disableAnimation);
  });
  it('should set disable animation to false if we updated currentSlide and animationDisabled is false', () => {
    const wrapper = mount((
      <CarouselProvider
        {...props}
      >
Hello
      </CarouselProvider>
    ));
    wrapper.setProps({ currentSlide: 1 });
    expect(wrapper.instance().getStore().state.disableAnimation).toBe(true);
    jest.runAllTimers();
    expect(wrapper.instance().getStore().state.disableAnimation).toBe(false);
  });
});
