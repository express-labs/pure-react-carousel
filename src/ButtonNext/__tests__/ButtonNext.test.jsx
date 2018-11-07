import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import clone from 'clone';
import Adapter from 'enzyme-adapter-react-16';
import components from '../../helpers/component-config';
import ButtonNext from '../ButtonNext';
import Store from '../../Store/Store';
import CarouselProvider from '../../CarouselProvider/CarouselProvider';
import ButtonNextWithStore from '..';

configure({ adapter: new Adapter() });


let props;

describe('<ButtonNext />', () => {
  beforeEach(() => {
    props = clone(components.ButtonNext.props);
  });
  it('should render', () => {
    const wrapper = shallow(<ButtonNext {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should be disabled if the currentSlide >= totalSlides - visibleSlides', () => {
    const newProps = Object.assign({}, props, {
      carouselStore: new Store({
        currentSlide: 5,
        totalSlides: 7,
        visibleSlides: 2,
      }),
    });
    const wrapper = shallow(<ButtonNext {...newProps} />);
    expect(wrapper.prop('disabled')).toBe(true);
  });
  it('should NOT be disabled if the currentSlide < totalSlides - visibleSlides', () => {
    const carouselStore = new Store({
      currentSlide: 4,
      totalSlides: 7,
      visibleSlides: 2,
      step: 1,
    });

    const newProps = Object.assign({}, props, {
      currentSlide: 4,
      totalSlides: 7,
      visibleSlides: 2,
      step: 1,
      carouselStore,
    });

    const wrapper = shallow(<ButtonNext {...newProps} />);
    expect(wrapper.prop('disabled')).toBe(false);
  });
  it('should be disabled if the disabled prop is set manually, regardless of currentSlide', () => {
    const wrapper = shallow(<ButtonNext {...props} disabled />);
    expect(wrapper.prop('disabled')).toBe(true);
  });
  it('should add the value of step from currentSlide when clicked.', () => {
    const carouselStore = new Store({
      currentSlide: 0,
      totalSlides: 7,
      visibleSlides: 2,
      step: 2,
    });

    const newProps = Object.assign({}, props, {
      carouselStore,
      currentSlide: 0,
      totalSlides: 7,
      visibleSlides: 2,
      step: 2,
    });

    const wrapper = mount(<ButtonNext {...newProps} />);
    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(carouselStore.state.currentSlide).toBe(2);
  });
  it('should call an onClick function passed as a prop', () => {
    const onClick = jest.fn();
    const newProps = Object.assign({}, props, { onClick, currentSlide: 0 });
    const wrapper = mount(<ButtonNext {...newProps} />);
    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(onClick.mock.calls.length).toBe(1);
  });
  xit('should disable the button and change the slide to (totalSlides - visibleSlides) if ((currentSlide + step) >= (totalSlides + 1))', () => {
    const newProps = {
      currentSlide: 4,
      totalSlides: 7,
      visibleSlides: 2,
      step: 4,
      naturalSlideWidth: 100,
      naturalSlideHeight: 125,
    };

    const wrapper = mount((
      <CarouselProvider {...newProps}>
        <ButtonNextWithStore>Next</ButtonNextWithStore>
      </CarouselProvider>
    ));

    const instance = wrapper.instance();
    expect(instance.carouselStore.state.currentSlide).toBe(4);
    wrapper.find('button').simulate('click');
    wrapper.update();
    expect(instance.carouselStore.state.currentSlide).toBe(newProps.totalSlides - newProps.visibleSlides);
    expect(wrapper.find('button').prop('disabled')).toBe(true);
  });
});
