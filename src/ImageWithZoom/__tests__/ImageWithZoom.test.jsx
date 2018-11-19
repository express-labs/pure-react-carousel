import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import clone from 'clone';
import Adapter from 'enzyme-adapter-react-16';
import components from '../../helpers/component-config';
import ImageWithZoom from '../ImageWithZoom';
import CarouselProvider from '../../CarouselProvider/CarouselProvider';

configure({ adapter: new Adapter() });

const touchStart = {
  targetTouches: [
    {
      identifier: 1,
      clientX: 50,
      clientY: 50,
    },
    {
      identifier: 2,
      clientX: 100,
      clientY: 100,
    },
  ],
};

const touchMove = {
  persist: jest.fn(),
  stopPropagation: jest.fn(),
  target: {
    getBoundingClientRect: () => ({
      left: -75,
      top: -75,
      width: 300,
      height: 300,
    }),
  },
  targetTouches: [
    {
      identifier: 1,
      clientX: 25,
      clientY: 25,
    },
    {
      identifier: 2,
      clientX: 125,
      clientY: 125,
    },
  ],
};

const touchEnd = {
  changedTouches: [
    { identifier: 1 },
    { identifier: 2 },
  ],
};


describe('<ImageWithZoom />', () => {
  describe('unit tests', () => {
    describe('renderLoading', () => {
      it('should render a custom spinner if supplied', () => {
        const instance = new ImageWithZoom({
          spinner: () => <div className="custom-spinner" />,
        });
        instance.state.isImageLoading = true;
        const wrapper = shallow(instance.renderLoading());
        expect(wrapper.find('.custom-spinner').exists()).toBe(true);
      });
      it('should render a the default spinner if no custom spinner was supplied', () => {
        const instance = new ImageWithZoom({});
        instance.state.isImageLoading = true;
        const wrapper = shallow(instance.renderLoading());
        expect(wrapper.find('Spinner').exists()).toBe(true);
      });
      it('should return null if imageIsLoading is false', () => {
        const instance = new ImageWithZoom({});
        instance.state.isImageLoading = false;
        expect(instance.renderLoading()).toBe(null);
      });
    });
  });
  describe('integration tests', () => {
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
    it('should add zooming classes to the overlay when mouse is zoooming', () => {
      expect(imageWithZoom.find('div.overlay').hasClass('zoom')).toBe(false);
      expect(imageWithZoom.find('div.overlay').hasClass('carousel__zoom-image-overlay--zooming')).toBe(false);
      imageWithZoom.find('Wrapper.overlay').simulate('touchStart', touchStart);
      imageWithZoom.find('Wrapper.overlay').simulate('touchMove', touchMove);

      // enzyme 3.x wrappers are immutable, so we need to find stuff again after an update.
      const updatedImageWithZoom = wrapper.find(ImageWithZoom);

      expect(updatedImageWithZoom.find('div.overlay').hasClass('zoom')).toBe(true);
      expect(updatedImageWithZoom.find('div.overlay').hasClass('carousel__zoom-image-overlay--zooming')).toBe(true);
    });
    it('should remove zoooming classes to the overlay when mouse is not zoooming', () => {
      expect(wrapper.find('div.overlay').hasClass('zoom')).toBe(false);
      expect(wrapper.find('div.overlay').hasClass('carousel__zoom-image-overlay--zooming')).toBe(false);
      wrapper.find('div.overlay').simulate('touchStart', touchStart);
      wrapper.find('div.overlay').simulate('touchMove', touchMove);
      wrapper.find('div.overlay').simulate('touchEnd', touchEnd);
      expect(wrapper.find('div.overlay').hasClass('zoom')).toBe(false);
      expect(wrapper.find('div.overlay').hasClass('carousel__zoom-image-overlay--zooming')).toBe(false);
    });
  });
  describe('zoom tests', () => {
    let props;
    beforeEach(() => {
      props = clone(components.ImageWithZoom.props);
    });
    it('should use the "src" prop for the regular and zoomed image if optional prop srcZoomed is NOT provided ', () => {
      const wrapper = shallow((
        <ImageWithZoom {...props} />
      ));
      expect(wrapper.find('.carousel__zoom-image').prop('src')).toBe('bob.jpg');
      expect(wrapper.find('.carousel__zoom-image-overlay').prop('src')).toBe('bob.jpg');
    });
    it('should use the "srcZoomed" prop for the zoomed image if optional prop srcZoomed is provided ', () => {
      const wrapper = shallow((
        <ImageWithZoom {...props} srcZoomed="fred.jpg" />
      ));
      expect(wrapper.find('.carousel__zoom-image').prop('src')).toBe('bob.jpg');
      expect(wrapper.find('.carousel__zoom-image-overlay').prop('src')).toBe('fred.jpg');
    });
    it('should properly set state for x y when mouse moving', () => {
      const wrapper = shallow((
        <ImageWithZoom {...props} />
      ));
      expect(wrapper.state('x')).toBe(null);
      expect(wrapper.state('y')).toBe(null);
      wrapper.find('.overlay').simulate('mousemove', {
        nativeEvent: {
          offsetX: 1,
          offsetY: 1,
        },
        target: {
          offsetWidth: 100,
          offsetHeight: 100,
        },
      });
      wrapper.update();
      expect(wrapper.state('x')).toBe('1%');
      expect(wrapper.state('y')).toBe('1%');
      wrapper.find('.overlay').simulate('mousemove', {
        nativeEvent: {
          offsetX: 50,
          offsetY: 50,
        },
        target: {
          offsetWidth: 100,
          offsetHeight: 100,
        },
      });
      wrapper.update();
      expect(wrapper.state('x')).toBe('50%');
      expect(wrapper.state('y')).toBe('50%');
    });
    it('should properly set state for x y when touches are moving', () => {
      const wrapper = shallow((
        <ImageWithZoom {...props} />
      ));
      expect(wrapper.state('x')).toBe(null);
      expect(wrapper.state('y')).toBe(null);
      wrapper.find('.overlay').simulate('touchstart', touchStart);
      expect(wrapper.state('isZooming')).toBe(true);
      wrapper.find('.overlay').simulate('touchMove', touchMove);
      expect(wrapper.state('x')).toBe('50%');
      expect(wrapper.state('y')).toBe('50%');
      expect(wrapper.state('isZooming')).toBe(true);
    });
  });
  describe('mouse action handlers', () => {
    let props;
    let wrapper;
    let instance;
    beforeEach(() => {
      props = clone(components.ImageWithZoom.props);
      wrapper = shallow(<ImageWithZoom {...props} />);
      instance = wrapper.instance();
      instance.setState = jest.fn();
    });
    it('handleOnMouseOver should not call setState if state.isZooming is TRUE', () => {
      instance.state.isZooming = true;
      instance.handleOnMouseOver();
      expect(instance.setState).toHaveBeenCalledTimes(0);
    });
    it('handleOnMouseOver should call setState if state.isZooming is FALSE', () => {
      instance.state.isZooming = false;
      instance.handleOnMouseOver();
      expect(instance.setState).toHaveBeenCalledTimes(1);
    });
    it('handleOnMouseOut should not call setState if state.isZooming is TRUE', () => {
      instance.state.isZooming = true;
      instance.handleOnMouseOut();
      expect(instance.setState).toHaveBeenCalledTimes(0);
    });
    it('handleOnMouseOut should call setState if state.isZooming is FALSE', () => {
      instance.state.isZooming = false;
      instance.handleOnMouseOut();
      expect(instance.setState).toHaveBeenCalledTimes(1);
    });
    it('handleOnMouseMove should not call setState if state.isZooming is TRUE', () => {
      instance.state.isZooming = true;
      instance.handleOnMouseMove();
      expect(instance.setState).toHaveBeenCalledTimes(0);
    });
    it('handleOnMouseMove should call setState if state.isZooming is FALSE', () => {
      instance.state.isZooming = false;
      instance.handleOnMouseMove({
        nativeEvent: {
          offsetX: 1,
          offsetY: 1,
        },
        target: {
          offsetWidth: 100,
          offsetHeight: 100,
        },
      });
      expect(instance.setState).toHaveBeenCalledTimes(1);
    });
  });
  describe('touch action handlers', () => {
    let props;
    beforeEach(() => {
      props = clone(components.ImageWithZoom.props);
    });
    it('should add touches to tpCache if isPinchZoomEnabled', () => {
      const wrapper = shallow(<ImageWithZoom {...props} />);
      const instance = wrapper.instance();
      instance.handleOnTouchStart(touchStart);
      expect(instance.tpCache).toEqual({
        1: {
          clientX: 50,
          clientY: 50,
        },
        2: {
          clientX: 100,
          clientY: 100,
        },
      });
    });
    it('should not add touches to tpCache if isPinchZoomEnabled is false', () => {
      const wrapper = shallow(<ImageWithZoom {...props} isPinchZoomEnabled={false} />);
      const instance = wrapper.instance();
      instance.handleOnTouchStart(touchStart);
      expect(instance.tpCache).toEqual({});
    });
    it('handleOnTouchMove should not call setState() if isZooming is false.', () => {
      const wrapper = shallow(<ImageWithZoom {...props} isPinchZoomEnabled={false} />);
      const instance = wrapper.instance();
      instance.state.isZooming = false;
      instance.setState = jest.fn();
      instance.handleOnTouchMove(touchMove);
      expect(instance.setState).toHaveBeenCalledTimes(0);
    });
    it('handleOnTouchMove should not call setState() if isZooming is true but there is only ONE touch.', () => {
      const wrapper = shallow(<ImageWithZoom {...props} />);
      const instance = wrapper.instance();
      instance.state.isZooming = true;
      instance.setState = jest.fn();
      const myTouchMove = clone(touchMove);
      myTouchMove.targetTouches = [{
        identifier: 1,
        clientX: 25,
        clientY: 25,
      }];
      instance.handleOnTouchMove(myTouchMove);
      expect(instance.setState).toHaveBeenCalledTimes(0);
    });
    it('handleOnTouchEnd should call setState if isPinchZoomEnabled and tpCache length is 0', () => {
      const wrapper = shallow(<ImageWithZoom {...props} />);
      const instance = wrapper.instance();
      instance.setState = jest.fn();
      instance.handleOnTouchEnd(touchEnd);
      expect(instance.setState).toHaveBeenCalledTimes(1);
      expect(instance.setState.mock.calls[0][0]).toEqual({ isZooming: false });
    });
    it('handleOnTouchEnd should NOT call setState if isPinchZoomEnabled is FALSE', () => {
      const wrapper = shallow(<ImageWithZoom {...props} isPinchZoomEnabled={false} />);
      const instance = wrapper.instance();
      instance.setState = jest.fn();
      instance.handleOnTouchEnd(touchEnd);
      expect(instance.setState).toHaveBeenCalledTimes(0);
    });
    it('handleOnTouchEnd NOT should call setState if isPinchZoomEnabled and tpCache length is 1', () => {
      const wrapper = shallow(<ImageWithZoom {...props} />);
      const instance = wrapper.instance();
      instance.setState = jest.fn();
      instance.tpCache = {
        1: {
          clientX: 50,
          clientY: 50,
        },
        2: {
          clientX: 100,
          clientY: 100,
        },
      };
      const myTouchEnd = {
        changedTouches: [
          { identifier: 1 },
        ],
      };
      instance.handleOnTouchEnd(myTouchEnd);
      expect(Object.keys(instance.tpCache).length).toBe(1);
      expect(instance.setState).toHaveBeenCalledTimes(0);
    });
  });
});
