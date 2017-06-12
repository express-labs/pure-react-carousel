import React from 'react';
import { shallow, mount } from 'enzyme';
import components from '../../helpers/component-config';
import { ERROR } from '../../helpers/index';
import ImageWithZoom from '../ImageWithZoom';
import CarouselProvider from '../../CarouselProvider/CarouselProvider';
import Store from '../../Store/Store';

const { props } = components.ImageWithZoom;

describe('<ImageWithZoom />', () => {
  let wrapper;
  let imageWithZoom;

  beforeEach(() => {
    wrapper = mount((
      <CarouselProvider>
        <ImageWithZoom {...props} />
      </CarouselProvider>
    ));

    imageWithZoom = wrapper.find(ImageWithZoom);
  });
  it('should render', () => {
    expect(wrapper.exists()).toBe(true);
  });
  it('should add hovering classes to the overlay when mouse is hovering', () => {
    imageWithZoom.find('.overlay').simulate('mouseover');
    wrapper.update();
    expect(imageWithZoom.find('.overlay').hasClass('hover')).toBe(true);
    expect(imageWithZoom.find('.overlay').hasClass('carousel__zoom-image-overlay--hovering')).toBe(true);
  });
  it('should remove hovering classes to the overlay when mouse is not hovering', () => {
    imageWithZoom.find('.overlay').simulate('mouseover');
    wrapper.update();
    imageWithZoom.find('.overlay').simulate('mouseout');
    wrapper.update();
    console.log(wrapper.debug());
    expect(imageWithZoom.find('.overlay').hasClass('hover')).toBe(false);
    expect(imageWithZoom.find('.overlay').hasClass('carousel__zoom-image-overlay--hovering')).toBe(false);
  });
});
