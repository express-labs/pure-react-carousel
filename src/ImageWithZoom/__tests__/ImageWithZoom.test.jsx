import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import clone from 'clone';
import Adapter from 'enzyme-adapter-react-16';
import components from '../../helpers/component-config';
import ImageWithZoom from '../ImageWithZoom';
import CarouselProvider from '../../CarouselProvider/CarouselProvider';

configure({ adapter: new Adapter() });


describe('<ImageWithZoom />', () => {
  let wrapper;
  let imageWithZoom;
  let props;

  beforeEach(() => {
    props = clone(components.ImageWithZoom.props);
    wrapper = mount((
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={1}
      >
        <ImageWithZoom {...props} />
      </CarouselProvider>
    ));
    imageWithZoom = wrapper.find(ImageWithZoom);
  });
  it('should render', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it('should add hovering classes to the overlay when mouse is hovering', () => {
    expect(imageWithZoom.find('div.overlay').hasClass('hover')).toBe(false);
    expect(imageWithZoom.find('div.overlay').hasClass('carousel__zoom-image-overlay--hovering')).toBe(false);
    imageWithZoom.find('Wrapper.overlay').simulate('mouseover');

    // enzyme 3.x wrappers are immutable, so we need to find stuff again after an update.
    const updatedImageWithZoom = wrapper.find(ImageWithZoom);

    expect(updatedImageWithZoom.find('div.overlay').hasClass('hover')).toBe(true);
    expect(updatedImageWithZoom.find('div.overlay').hasClass('carousel__zoom-image-overlay--hovering')).toBe(true);
  });
  it('should remove hovering classes to the overlay when mouse is not hovering', () => {
    expect(wrapper.find('div.overlay').hasClass('hover')).toBe(false);
    expect(wrapper.find('div.overlay').hasClass('carousel__zoom-image-overlay--hovering')).toBe(false);
    wrapper.find('div.overlay').simulate('mouseover');
    wrapper.update();
    wrapper.find('div.overlay').simulate('mouseout');
    wrapper.update();
    expect(wrapper.find('div.overlay').hasClass('hover')).toBe(false);
    expect(wrapper.find('div.overlay').hasClass('carousel__zoom-image-overlay--hovering')).toBe(false);
  });
  it('should properly set state for x y when mouse moving', () => {
    const shallowWrapper = shallow((
      <ImageWithZoom {...props} />
    ));
    expect(shallowWrapper.state('x')).toBe(null);
    expect(shallowWrapper.state('y')).toBe(null);
    shallowWrapper.find('.overlay').simulate('mousemove', {
      nativeEvent: {
        offsetX: 1,
        offsetY: 1,
      },
      target: {
        offsetWidth: 100,
        offsetHeight: 100,
      },
    });
    shallowWrapper.update();
    expect(shallowWrapper.state('x')).toBe(1);
    expect(shallowWrapper.state('y')).toBe(1);
    shallowWrapper.find('.overlay').simulate('mousemove', {
      nativeEvent: {
        offsetX: 50,
        offsetY: 50,
      },
      target: {
        offsetWidth: 100,
        offsetHeight: 100,
      },
    });
    shallowWrapper.update();
    expect(shallowWrapper.state('x')).toBe(50);
    expect(shallowWrapper.state('y')).toBe(50);
  });
});
