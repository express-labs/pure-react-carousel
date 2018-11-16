import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import clone from 'clone';
import components from '../../helpers/component-config';
import Store from '../../Store/Store';
import Slider from '../Slider';

configure({ adapter: new Adapter() });

const touch100 = {
  preventDefault: jest.fn(),
  stopPropagation: jest.fn(),
  targetTouches: [
    {
      screenX: 100,
      screenY: 100,
    },
  ],
};

const drag100 = {
  persist: jest.fn(),
  preventDefault: jest.fn(),
  screenX: 100,
  screenY: 100,
};

// mock requestAnimationFrame
global.window = global;
let raf = 0;
window.requestAnimationFrame = (r) => {
  r();
  raf += 1;
  return raf;
};
window.cancelAnimationFrame = jest.fn().mockImplementation(() => {});

// patch for missing SVGElement in jsDom.  Supposedly is fixed in newer versions of jsDom.
if (!global.SVGElement) global.SVGElement = global.Element;

// mock event listeners
global.window.addEventListener = jest.fn();
global.window.removeEventListener = jest.fn();
global.document.documentElement.addEventListener = jest.fn();
global.document.documentElement.removeEventListener = jest.fn();


jest.useFakeTimers();

describe('<Slider />', () => {
  describe('unit tests', () => {
    beforeEach(() => {
      global.window.addEventListener.mockClear();
      global.window.removeEventListener.mockClear();
      global.document.documentElement.addEventListener.mockClear();
      global.document.documentElement.removeEventListener.mockClear();
      window.cancelAnimationFrame.mockClear();
    });
    describe('static slideSizeInPx()', () => {
      it('should return the tray width / total slides if orientation is horizontal', () => {
        expect(Slider.slideSizeInPx('horizontal', 100, 20, 2)).toBe(50);
      });
      it('should return the tray height / total slides if orientation is NOT horizontal', () => {
        expect(Slider.slideSizeInPx('vertical', 100, 20, 2)).toBe(10);
      });
    });
    describe('static slidesMoved()', () => {
      it('should return 0 if the delta is less than the threshold', () => {
        expect(Slider.slidesMoved(20, 'horizontal', 19, 0, 100)).toBe(0);
      });
      it('should return 0 if the delta is 0', () => {
        expect(Slider.slidesMoved(20, 'horizontal', 0, 0, 100)).toBe(0);
      });
      it('should return 1 if the delta is equal to the threshold', () => {
        expect(Slider.slidesMoved(20, 'horizontal', 20, 0, 100)).toBe(0);
      });
      it('should return -2 if the delta is greater than 2 slides but less than 2.5 slides', () => {
        expect(Slider.slidesMoved(20, 'horizontal', 200, 0, 100)).toBe(-2);
      });
      it('should return -3 if the delta is equal to 2.5 slides', () => {
        expect(Slider.slidesMoved(20, 'horizontal', 250, 0, 100)).toBe(-3);
      });
      it('should return -3 if the delta is greater than 2.5 slides but less than 3', () => {
        expect(Slider.slidesMoved(20, 'horizontal', 299, 0, 100)).toBe(-3);
      });
    });
    describe('constructor()', () => {
      const instance = new Slider();
      it('should bind getSliderRef', () => {
        expect(instance.getSliderRef.name).toEqual('bound getSliderRef');
      });
      it('should bind handleDocumentScroll', () => {
        expect(instance.handleDocumentScroll.name).toEqual('bound handleDocumentScroll');
      });
      it('should bind handleOnClickCapture', () => {
        expect(instance.handleOnClickCapture.name).toEqual('bound handleOnClickCapture');
      });
      it('should bind handleOnKeyDown', () => {
        expect(instance.handleOnKeyDown.name).toEqual('bound handleOnKeyDown');
      });
      it('should bind handleOnMouseDown', () => {
        expect(instance.handleOnMouseDown.name).toEqual('bound handleOnMouseDown');
      });
      it('should bind handleOnMouseMove', () => {
        expect(instance.handleOnMouseMove.name).toEqual('bound handleOnMouseMove');
      });
      it('should bind handleOnMouseUp', () => {
        expect(instance.handleOnMouseUp.name).toEqual('bound handleOnMouseUp');
      });
      it('should bind handleOnTouchCancel', () => {
        expect(instance.handleOnTouchCancel.name).toEqual('bound handleOnTouchCancel');
      });
      it('should bind handleOnTouchEnd', () => {
        expect(instance.handleOnTouchEnd.name).toEqual('bound handleOnTouchEnd');
      });
      it('should bind handleOnTouchMove', () => {
        expect(instance.handleOnTouchMove.name).toEqual('bound handleOnTouchMove');
      });
      it('should bind handleOnTouchStart', () => {
        expect(instance.handleOnTouchStart.name).toEqual('bound handleOnTouchStart');
      });
      it('should bind playBackward', () => {
        expect(instance.playBackward.name).toEqual('bound playBackward');
      });
      it('should bind playForward', () => {
        expect(instance.playForward.name).toEqual('bound playForward');
      });
      it('should initialize the state with the following shape', () => {
        expect(instance.state).toEqual({
          cancelNextClick: false,
          deltaX: 0,
          deltaY: 0,
          isBeingMouseDragged: false,
          isBeingTouchDragged: false,
          startX: 0,
          startY: 0,
        });
      });
      it('should null out interval', () => {
        expect(instance.interval).toBe(null);
      });
      it('should null out isDocumentScrolling', () => {
        expect(instance.isDocumentScrolling).toBe(null);
      });
      it('should null out moveTimer', () => {
        expect(instance.moveTimer).toBe(null);
      });
      it('should null out originalOverflow', () => {
        expect(instance.originalOverflow).toBe(null);
      });
      it('should null out scrollParent', () => {
        expect(instance.scrollParent).toBe(null);
      });
      it('should null out scrollStopTimer', () => {
        expect(instance.scrollStopTimer).toBe(null);
      });
    });
    describe('componentDidMount()', () => {
      it('should add an event listener for handleDocumentScroll if the prop lockOnWindowScroll is true', () => {
        const instance = new Slider({ lockOnWindowScroll: true });
        instance.componentDidMount();
        expect(global.window.addEventListener).toHaveBeenCalledWith('scroll', instance.handleDocumentScroll, false);
      });
      it('should NOT add an event listener for handleDocumentScroll if the prop lockOnWindowScroll is false', () => {
        const instance = new Slider({ lockOnWindowScroll: false });
        instance.componentDidMount();
        expect(global.window.addEventListener).toHaveBeenCalledTimes(0);
      });
      it('should add an event listener to documentElement for mouseleave', () => {
        const instance = new Slider({});
        instance.componentDidMount();
        expect(global.document.documentElement.addEventListener).toHaveBeenCalledWith('mouseleave', instance.handleOnMouseUp, false);
      });
      it('should add an event listener to documentElement for mousemove', () => {
        const instance = new Slider({});
        instance.componentDidMount();
        expect(global.document.documentElement.addEventListener).toHaveBeenCalledWith('mousemove', instance.handleOnMouseMove, false);
      });
      it('should add an event listener to documentElement for mouseup', () => {
        const instance = new Slider({});
        instance.componentDidMount();
        expect(global.document.documentElement.addEventListener).toHaveBeenCalledWith('mouseup', instance.handleOnMouseUp, false);
      });
      it('should call this.play() if props isPlaying is true', () => {
        const instance = new Slider({ isPlaying: true });
        instance.play = jest.fn();
        instance.componentDidMount();
        expect(instance.play).toHaveBeenCalledTimes(1);
      });
      it('should NOT call this.play() if props isPlaying is NOT true', () => {
        const instance = new Slider({ isPlaying: false });
        instance.play = jest.fn();
        instance.componentDidMount();
        expect(instance.play).toHaveBeenCalledTimes(0);
      });
    });
    describe('componentWillUnmount()', () => {
      let instance;
      beforeEach(() => {
        instance = new Slider();
        instance.componentWillUnmount();
      });
      it('should remove the mouseleave listener from document.documentElement', () => {
        expect(global.document.documentElement.removeEventListener).toHaveBeenCalledWith('mouseleave', instance.handleOnMouseUp, false);
      });
      it('should remove the mousemove listener from document.documentElement', () => {
        expect(global.document.documentElement.removeEventListener).toHaveBeenCalledWith('mousemove', instance.handleOnMouseMove, false);
      });
      it('should remove the mouseup listener from document.documentElement', () => {
        expect(global.document.documentElement.removeEventListener).toHaveBeenCalledWith('mouseup', instance.handleOnMouseUp, false);
      });
      it('should remove the scroll listener from window', () => {
        expect(global.window.removeEventListener).toHaveBeenCalledWith('scroll', instance.handleDocumentScroll, false);
      });
      it('should reset isDocumentScrolling to null', () => {
        expect(instance.isDocumentScrolling).toBe(null);
      });
      it('should reset moveTimer to null', () => {
        expect(instance.moveTimer).toBe(null);
      });
      it('should reset scrollStopTimer to null', () => {
        expect(instance.scrollStopTimer).toBe(null);
      });
      it('should call cancelAnimationFrame and pass it this.moveTimer', () => {
        expect(window.cancelAnimationFrame).toHaveBeenCalledTimes(1);
      });
    });
    describe('handleOnMouseMove()', () => {
      it('should return undefined if isBeingMouseDragged is false', () => {
        const instance = new Slider({});
        instance.state.isBeingMouseDragged = false;
        expect(instance.handleOnMouseMove()).toBe(undefined);
      });
      it('should call preventDefault on the supplied event is isBeingTouchDragged is true', () => {
        const instance = new Slider({});
        instance.state.isBeingMouseDragged = true;
        const ev = {
          preventDefault: jest.fn(),
        };
        instance.onDragMove = jest.fn();
        instance.setState = jest.fn();
        instance.handleOnMouseMove(ev);
        expect(ev.preventDefault).toHaveBeenCalledTimes(1);
      });
      it('should call setState for cancelNextClick to true if isBeingTouchDragged is true', () => {
        const instance = new Slider({});
        instance.state.isBeingMouseDragged = true;
        const ev = {
          preventDefault: jest.fn(),
        };
        instance.onDragMove = jest.fn();
        instance.setState = jest.fn();
        instance.handleOnMouseMove(ev);
        expect(instance.setState).toHaveBeenCalledTimes(1);
        expect(instance.setState).toHaveBeenCalledWith({ cancelNextClick: true });
      });
      it('should call onDragMove and pass it the event screen x and y values', () => {
        const instance = new Slider({});
        instance.state.isBeingMouseDragged = true;
        const ev = {
          preventDefault: jest.fn(),
          screenX: 1,
          screenY: 2,
        };
        instance.onDragMove = jest.fn();
        instance.setState = jest.fn();
        instance.handleOnMouseMove(ev);
        expect(instance.onDragMove).toHaveBeenCalledTimes(1);
        expect(instance.onDragMove).toHaveBeenCalledWith(1, 2);
      });
    });
    describe('onMouseUp()', () => {
      it('should return undefined if isBeingMouseDragged is false', () => {
        const instance = new Slider({});
        instance.state.isBeingMouseDragged = false;
        expect(instance.handleOnMouseUp()).toBe(undefined);
      });
      it('should call preventDefault on the supplied event is isBeingTouchDragged is true', () => {
        const instance = new Slider({});
        instance.state.isBeingMouseDragged = true;
        const ev = {
          preventDefault: jest.fn(),
        };
        instance.onDragEnd = jest.fn();
        instance.handleOnMouseUp(ev);
        expect(ev.preventDefault).toHaveBeenCalledTimes(1);
      });
      it('should call onDragEnd and pass it the event screen x and y values', () => {
        const instance = new Slider({});
        instance.state.isBeingMouseDragged = true;
        const ev = {
          preventDefault: jest.fn(),
          screenX: 1,
          screenY: 2,
        };
        instance.onDragEnd = jest.fn();
        instance.handleOnMouseUp(ev);
        expect(instance.onDragEnd).toHaveBeenCalledTimes(1);
      });
    });
    describe('handleOnClickCapture', () => {
      it('should return undefined if state.cancelNextClick is false', () => {
        const instance = new Slider({});
        expect(instance.handleOnClickCapture()).toBe(undefined);
      });
      it('should call preventDefault, stopPropagation and set cancelNextClick to false', () => {
        const instance = new Slider({});
        instance.state.cancelNextClick = true;
        instance.setState = jest.fn();
        const ev = {
          preventDefault: jest.fn(),
          stopPropagation: jest.fn(),
        };
        instance.handleOnClickCapture(ev);
        expect(instance.setState).toHaveBeenCalledWith({ cancelNextClick: false });
        expect(ev.preventDefault).toHaveBeenCalledTimes(1);
        expect(ev.stopPropagation).toHaveBeenCalledTimes(1);
      });
    });
    describe('renderMasterSpinner', () => {
      it('should render a custom spinner if supplied', () => {
        const instance = new Slider({
          hasMasterSpinner: true,
          masterSpinnerFinished: false,
          spinner: () => <div className="custom-spinner" />,
        });
        const wrapper = shallow(instance.renderMasterSpinner());
        expect(wrapper.find('.custom-spinner').exists()).toBe(true);
      });
      it('should render a the default spinner if no custom spinner was supplied', () => {
        const instance = new Slider({
          hasMasterSpinner: true,
          masterSpinnerFinished: false,
        });
        const wrapper = shallow(instance.renderMasterSpinner());
        expect(wrapper.find('Spinner').exists()).toBe(true);
      });
      it('should return null if hasMasterSpinner is false', () => {
        const instance = new Slider({
          hasMasterSpinner: false,
          masterSpinnerFinished: false,
        });
        expect(instance.renderMasterSpinner()).toBe(null);
      });
      it('should return null if masterSpinnerFinished is true', () => {
        const instance = new Slider({
          hasMasterSpinner: true,
          masterSpinnerFinished: true,
        });
        expect(instance.renderMasterSpinner()).toBe(null);
      });
    });
  });
  describe('integration tests', () => {
    let props;
    beforeEach(() => {
      props = clone(components.Slider.props);
    });

    it('should render', () => {
      const wrapper = shallow(<Slider {...props} />);
      expect(wrapper.exists()).toBe(true);
    });

    it('componentWillUnmount should cancel any animation frame and null out moveTimer', () => {
      window.cancelAnimationFrame.mockReset();
      const wrapper = shallow(<Slider {...props} />);
      const instance = wrapper.instance();
      instance.moveTimer = 'I be a timer';
      instance.componentWillUnmount();
      expect(cancelAnimationFrame).toHaveBeenCalledTimes(1);
      expect(cancelAnimationFrame.mock.calls[0][0]).toBe('I be a timer');
      expect(instance.moveTimer).toBe(null);
    });

    it('should not update the state if touched and touchEnabled is false', () => {
      const wrapper = shallow(<Slider {...props} touchEnabled={false} />);
      expect(wrapper.state('isBeingTouchDragged')).toBe(false);
      wrapper.find('.sliderTray').simulate('touchstart');
      wrapper.update();
      expect(wrapper.state('isBeingTouchDragged')).toBe(false);
    });

    it('should change state values when slider tray is touched', () => {
      const wrapper = shallow(<Slider {...props} />);
      expect(wrapper.state('isBeingTouchDragged')).toBe(false);
      wrapper.find('.sliderTray').simulate('touchstart', touch100);
      wrapper.update();
      expect(wrapper.state('isBeingTouchDragged')).toBe(true);
      expect(wrapper.state('startX')).toBe(100);
      expect(wrapper.state('startY')).toBe(100);
    });

    it('given the document has vertical scroll bars, it should set carouselStore the document\'s original overflow value on a touchStart event and set the document overflow to hidden.', () => {
      global.document.documentElement.style.overflow = 'scroll';
      touch100.preventDefault.mockReset();
      touch100.stopPropagation.mockReset();

      // have to call mount() because we need refs to be set up.  That only happens when mounted.
      const wrapper = mount(<Slider {...props} orientation="vertical" />);
      const instance = wrapper.instance();
      wrapper.find('.sliderTray').simulate('touchstart', touch100);

      // Enzyme doesn't yet call componentDidUpdate().  They are working on adding this feature.
      // so, we have to manually simulate this.
      const prevProps = wrapper.props();
      wrapper.setProps({ isPageScrollLocked: true });
      instance.componentDidUpdate(prevProps);

      expect(instance.originalOverflow).toBe('scroll');
      expect(global.document.documentElement.style.overflow).toBe('hidden');
      expect(touch100.preventDefault).toHaveBeenCalledTimes(1);
      expect(touch100.stopPropagation).toHaveBeenCalledTimes(1);
      global.document.documentElement.style.overflow = '';
    });

    it('should recarouselStore the document\'s original overflow value and set originalOverflow to null on a vertical carousel touchEnd', () => {
      global.document.documentElement.style.overflow = 'scroll';

      // need to call mount() because there are refs that need to be created.  That only happens on when mounted.
      const wrapper = mount(<Slider {...props} orientation="vertical" />);
      const instance = wrapper.instance();

      wrapper.find('.sliderTray').simulate('touchstart', touch100);
      wrapper.setProps({ isPageScrollLocked: true });
      wrapper.find('.sliderTray').simulate('touchend');
      wrapper.setProps({ isPageScrollLocked: false });
      expect(global.document.documentElement.style.overflow).toBe('scroll');
      expect(instance.originalOverflow).toBe(null);
    });

    it('should update deltaX and deltaY when isBeingTouchDragged', () => {
      const wrapper = shallow(<Slider {...props} />);
      expect(wrapper.state('startX')).toBe(0);
      expect(wrapper.state('startY')).toBe(0);
      wrapper.find('.sliderTray').simulate('touchmove', touch100);
      expect(wrapper.state('deltaX')).toBe(100);
      expect(wrapper.state('deltaY')).toBe(100);
    });

    it('touchmove should not alter state if touchEnabled is false', () => {
      const wrapper = shallow(<Slider {...props} touchEnabled={false} />);
      expect(wrapper.state('startX')).toBe(0);
      expect(wrapper.state('startY')).toBe(0);
      wrapper.find('.sliderTray').simulate('touchmove', touch100);
      expect(wrapper.state('deltaX')).toBe(0);
      expect(wrapper.state('deltaY')).toBe(0);
    });

    it('touchmove should not alter state if props.lockOnWindowScroll and this.isDocumentScrolling are both true', () => {
      const wrapper = shallow(<Slider {...props} lockOnWindowScroll />);
      const instance = wrapper.instance();
      instance.handleDocumentScroll();
      expect(wrapper.state('startX')).toBe(0);
      expect(wrapper.state('startY')).toBe(0);
      wrapper.find('.sliderTray').simulate('touchmove', touch100);
      expect(wrapper.state('deltaX')).toBe(0);
      expect(wrapper.state('deltaY')).toBe(0);
    });

    it('should not set this.isDocumentScrolling to true if touchEnabled is false', () => {
      const wrapper = shallow(<Slider {...props} touchEnabled={false} />);
      const instance = wrapper.instance();
      instance.handleDocumentScroll();
      expect(instance.isDocumentScrolling).toBe(null);
    });

    it('should assign the correct vertical css classes when orientation="vertical"', () => {
      const wrapper = shallow(<Slider {...props} orientation="vertical" />);
      expect(wrapper.find('.carousel__slider').hasClass('verticalSlider')).toBe(true);
      expect(wrapper.find('.carousel__slider').hasClass('carousel__slider--vertical')).toBe(true);
      expect(wrapper.find('.carousel__slider-tray').hasClass('verticalTray')).toBe(true);
      expect(wrapper.find('.carousel__slider-tray').hasClass('carousel__slider-tray--vertical')).toBe(true);
      expect(wrapper.find('.carousel__slider-tray-wrapper').hasClass('verticalSlideTrayWrap')).toBe(true);
      expect(wrapper.find('.carousel__slider-tray-wrapper').hasClass('carousel__slider-tray-wrap--vertical')).toBe(true);
    });

    it('Slider.slideSizeInPx should return 100 given the test conditions (horizontal)', () => {
      expect(Slider.slideSizeInPx(
        'horizontal',
        400,
        100,
        4,
      )).toBe(100);
    });

    it('Slider.slideSizeInPx should return 100 given the test conditions (vertical)', () => {
      expect(Slider.slideSizeInPx(
        'vertical',
        100,
        400,
        4,
      )).toBe(100);
    });

    it('Slider.slidesMoved should return 0 given the test conditions (horizontal)', () => {
      expect(Slider.slidesMoved(
        0.1,
        'horizontal',
        9,
        0,
        100,
      )).toBe(0);
    });

    it('Slider.slidesMoved should return -1 given the test conditions (horizontal)', () => {
      expect(Slider.slidesMoved(
        0.1,
        'horizontal',
        10,
        0,
        100,
      )).toBe(-1);
    });

    it('Slider.slidesMoved should return 0 given the test conditions (vertical)', () => {
      expect(Slider.slidesMoved(
        0.1,
        'vertical',
        0,
        9,
        100,
      )).toBe(0);
    });

    it('Slider.slidesMoved should return -1 given the test conditions (vertical)', () => {
      expect(Slider.slidesMoved(
        0.1,
        'vertical',
        0,
        10,
        100,
      )).toBe(-1);
    });

    it('Should move the slider to slide 2 (index 1 since slide numbering starts at 0) on touchend given the test conditions', () => {
      const wrapper = mount(<Slider {...props} />);
      expect(wrapper.prop('naturalSlideHeight')).toBe(100);
      expect(wrapper.prop('naturalSlideWidth')).toBe(100);
      expect(props.carouselStore.state.currentSlide).toBe(0);
      const instance = wrapper.instance();
      expect(instance.sliderTrayElement).not.toBe(undefined);
      wrapper.setState({
        deltaX: -51,
        deltaY: 0,
      });
      wrapper.update();
      instance.sliderTrayElement = {
        clientWidth: 500,
        clientHeight: 100,
      };
      wrapper.find('.sliderTray').simulate('touchend', { targetTouches: [] });
      expect(props.carouselStore.state.currentSlide).toBe(1);
    });

    it('Should keep the slider on slide 0 on touchend when dragging the slider past the start of the slide show.', () => {
      const wrapper = mount(<Slider {...props} />);
      const instance = wrapper.instance();
      wrapper.setState({
        deltaX: 1000,
        deltaY: 0,
      });
      wrapper.update();
      instance.sliderTrayElement = {
        clientWidth: 500,
        clientHeight: 100,
      };
      wrapper.find('.sliderTray').simulate('touchend', { targetTouches: [] });
      expect(props.carouselStore.state.currentSlide).toBe(0);
    });

    it('Should move the slider to totalSlides - visibleSlides - 1 when dragging past the last slide.', () => {
      const wrapper = mount(<Slider {...props} />);
      const instance = wrapper.instance();
      wrapper.setState({
        deltaX: -1000,
        deltaY: 0,
      });
      wrapper.update();
      instance.sliderTrayElement = {
        clientWidth: 500,
        clientHeight: 100,
      };
      wrapper.find('.sliderTray').simulate('touchend', { targetTouches: [] });
      expect(props.carouselStore.state.currentSlide).toBe(3);
    });

    it('should not change the state at all when touchEnd and touchEnabled prop is false', () => {
      const wrapper = shallow(<Slider {...props} touchEnabled={false} />);
      // nonsense values to test that slider state is not reset on touchend
      wrapper.setState({
        deltaX: 100,
        deltaY: 100,
        isBeingTouchDragged: true,
      });
      wrapper.update();
      wrapper.find('.sliderTray').simulate('touchend', { targetTouches: [] });
      wrapper.update();
      expect(wrapper.state('deltaX')).toBe(100);
      expect(wrapper.state('deltaY')).toBe(100);
      expect(wrapper.state('isBeingTouchDragged')).toBe(true);
    });
    // skipping this test for now v1.8.1
    // note: getting closer - 4/4/2018
    xit('should still have state.isBeingTouchDragged === true a touch ended but there are still more touches left', () => {
      const handleOnTouchEnd = jest.spyOn(Slider.prototype, 'handleOnTouchEnd');
      const wrapper = shallow(<Slider {...props} />);
      const instance = wrapper.instance();
      instance.sliderTrayElement = {
        clientWidth: 500,
        clientHeight: 100,
      };
      wrapper.setState({
        isBeingTouchDragged: true,
      });
      wrapper.update();
      wrapper.find('.sliderTray').simulate('touchend', touch100);
      wrapper.update();
      expect(handleOnTouchEnd).toHaveBeenCalledTimes(1);
      expect(wrapper.state('isBeingTouchDragged')).toBe(true);
      handleOnTouchEnd.mockReset();
      handleOnTouchEnd.mockRestore();
    });

    it('should call handleOnTouchCancel when a touch is canceled', () => {
      const wrapper = shallow(<Slider {...props} />);
      const instance = wrapper.instance();
      instance.sliderTrayElement = {
        clientWidth: 500,
        clientHeight: 100,
      };
      const handleOnTouchCancel = jest.spyOn(instance, 'handleOnTouchCancel');
      wrapper.setState({
        isBeingTouchDragged: true,
      });
      wrapper.find('.sliderTray').simulate('touchcancel', { type: 'touchcancel' });
      expect(handleOnTouchCancel).toHaveBeenCalledTimes(1);
      expect(wrapper.state('isBeingTouchDragged')).toBe(false);
    });

    it('should show a spinner if the carousel was just inserted in the DOM but the carousel slides are still being added', () => {
      const wrapper = shallow(<Slider {...props} hasMasterSpinner />);
      expect(wrapper.find('.masterSpinnerContainer').length).toBe(1);
      expect(wrapper.find('.carousel__master-spinner-container').length).toBe(1);
    });

    it('should call any supplied onMasterSpinner function when the masterSpinner is showing.', () => {
      const onMasterSpinner = jest.fn();
      shallow(<Slider {...props} hasMasterSpinner onMasterSpinner={onMasterSpinner} />);
      expect(onMasterSpinner).toHaveBeenCalledTimes(1);
    });

    it('should move the slider to slide 1 from slide 0 when pressing the left arrow', () => {
      const carouselStore = new Store({
        currentSlide: 1,
      });
      const wrapper = mount(<Slider {...props} currentSlide={1} carouselStore={carouselStore} />);
      expect(carouselStore.state.currentSlide).toBe(1);
      wrapper.find('.carousel__slider').simulate('keydown', { keyCode: 37 });
      expect(carouselStore.state.currentSlide).toBe(0);
    });

    it('should NOT move the slider lower than zero when left arrow is pressed', () => {
      const carouselStore = new Store({
        currentSlide: 0,
      });
      const wrapper = mount(<Slider {...props} currentSlide={0} carouselStore={carouselStore} />);
      expect(carouselStore.state.currentSlide).toBe(0);
      wrapper.find('.carousel__slider').simulate('keydown', { keyCode: 37 });
      expect(carouselStore.state.currentSlide).toBe(0);
    });

    it('should move the slider to slide 0 from slide 1 when pressing the right arrow', () => {
      const wrapper = mount(<Slider {...props} />);
      expect(wrapper.prop('carouselStore').state.currentSlide).toBe(0);
      wrapper.find('.carousel__slider').simulate('keydown', { keyCode: 39 });
      expect(wrapper.prop('carouselStore').state.currentSlide).toBe(1);
    });

    it('should not move the slider from 3 to 4 since !(currentslide < (totalSlides - visibleSlides)', () => {
      const carouselStore = new Store({
        currentSlide: 3,
      });
      const wrapper = mount(<Slider {...props} currentSlide={3} carouselStore={carouselStore} />);
      expect(wrapper.prop('carouselStore').state.currentSlide).toBe(3);
      wrapper.find('.carousel__slider').simulate('keydown', { keyCode: 39 });
      expect(wrapper.prop('carouselStore').state.currentSlide).toBe(3);
    });

    it('should not move the slider from 0 to 1 if right arrow is pressed and keyboard is disabled', () => {
      const carouselStore = new Store({
        currentSlide: 0,
        disableKeyboard: true,
      });
      const wrapper = mount(<Slider {...props} currentSlide={0} disableKeyboard carouselStore={carouselStore} />);
      expect(wrapper.prop('carouselStore').state.currentSlide).toBe(0);
      wrapper.find('.carousel__slider').simulate('keydown', { keyCode: 39 });
      expect(wrapper.prop('carouselStore').state.currentSlide).toBe(0);
    });

    it('should not move the slider from 1 to 0 if left arrow is pressed and keyboard is disabled', () => {
      const carouselStore = new Store({
        currentSlide: 1,
        disableKeyboard: true,
      });
      const wrapper = mount(<Slider {...props} currentSlide={1} disableKeyboard carouselStore={carouselStore} />);
      expect(wrapper.prop('carouselStore').state.currentSlide).toBe(1);
      wrapper.find('.carousel__slider').simulate('keydown', { keyCode: 37 });
      expect(wrapper.prop('carouselStore').state.currentSlide).toBe(1);
    });

    it('the .carousel__slider should have a default tabIndex of 0', () => {
      const wrapper = shallow(<Slider {...props} />);
      expect(wrapper.find('.carousel__slider').prop('tabIndex')).toBe(0);
    });

    it('override the default tabIndex for .carousel__slider if a tabIndex prop is passed to this component', () => {
      const wrapper = shallow(<Slider {...props} tabIndex={-1} />);
      expect(wrapper.find('.carousel__slider').prop('tabIndex')).toBe(-1);
    });

    it('should not call this.focus() if totalSlides <= visibleSlides', () => {
      const wrapper = shallow(<Slider {...props} totalSlides={2} visibleSlides={2} />);
      const instance = wrapper.instance();
      const focus = jest.spyOn(instance, 'focus');
      expect(focus).toHaveBeenCalledTimes(0);
      wrapper.find('.carousel__slider').simulate('keydown', { keyCode: 39 });
      expect(focus).toHaveBeenCalledTimes(0);
    });

    it('endTouchMove should set this.isDocumentScrolling to false if props.lockOnWindowScroll is true', () => {
      const wrapper = shallow(<Slider {...props} lockOnWindowScroll />);
      const instance = wrapper.instance();
      instance.computeCurrentSlide = () => {};
      instance.handleDocumentScroll();
      expect(instance.isDocumentScrolling).toBe(true);
      instance.endTouchMove();
      expect(instance.isDocumentScrolling).toBe(false);
    });

    it('endTouchMove should NOT set this.isDocumentScrolling to false if props.lockOnWindowScroll is FALSE', () => {
      const wrapper = shallow(<Slider {...props} />);
      const instance = wrapper.instance();
      instance.computeCurrentSlide = () => {};
      instance.endTouchMove();
      expect(instance.isDocumentScrolling).toBe(null);
    });

    it('should not supply the default css transitions if classNameAnimation property is not null', () => {
      const wrapper = shallow(<Slider {...props} classNameAnimation="my-animation" />);
      expect(wrapper.find('.sliderAnimation').exists()).toBe(false);
      expect(wrapper.find('.my-animation').exists()).toBe(true);
    });

    it('should supply the default css transitions if classNameAnimation property null', () => {
      const wrapper = shallow(<Slider {...props} />);
      expect(wrapper.find('.sliderAnimation').exists()).toBe(true);
      expect(wrapper.find('.my-animation').exists()).toBe(false);
    });

    it('should apply the classNameTray class to the tray', () => {
      const wrapper = shallow(<Slider {...props} classNameTray="tray-class" />);
      expect(wrapper.find('.tray-class').exists()).toBe(true);
    });

    it('should apply the classNameTrayWrap class to the tray wrap div', () => {
      const wrapper = shallow(<Slider {...props} classNameTrayWrap="tray-class-wrap" />);
      expect(wrapper.find('.tray-class-wrap').exists()).toBe(true);
    });

    it('should start playing the slideshow after mounting after a delay of props.interval if props.isPlay is true', () => {
      const playForward = jest.spyOn(Slider.prototype, 'playForward');
      const wrapper = shallow(<Slider {...props} isPlaying />);
      const instance = wrapper.instance();
      jest.runTimersToTime(props.interval);
      expect(instance.interval).not.toBe(null);
      expect(playForward).toHaveBeenCalledTimes(1);
      playForward.mockReset();
      playForward.mockRestore();
    });

    it('should stop playing the slideshow if the isPlaying prop is changed to false', () => {
      const wrapper = shallow(<Slider {...props} isPlaying />);
      const instance = wrapper.instance();
      expect(instance.interval).not.toBe(null);
      wrapper.setProps({ isPlaying: false });
      expect(instance.interval).toBe(null);
    });

    it('should start playing the slideshow if the isPlaying prop is changed to true', () => {
      const play = jest.spyOn(Slider.prototype, 'play');
      const wrapper = shallow(<Slider {...props} />);
      const instance = wrapper.instance();
      expect(instance.interval).toBe(null);
      wrapper.setProps({ isPlaying: true });
      expect(instance.interval).not.toBe(null);
      expect(play).toHaveBeenCalledTimes(1);
      play.mockReset();
      play.mockRestore();
    });

    it('should start playing the slideshow backwards after prop.interval milliseconds if prop.isPlaying is true and prop.playDirection is backward', () => {
      const wrapper = shallow(<Slider {...props} playDirection="backward" />);
      const instance = wrapper.instance();
      const playBackward = jest.spyOn(instance, 'playBackward');
      expect(instance.interval).toBe(null);
      wrapper.setProps({ isPlaying: true });
      jest.runTimersToTime(props.interval);
      expect(instance.interval).not.toBe(null);
      expect(playBackward).toHaveBeenCalledTimes(1);
    });

    it('playForward() should increment the currentSlide by value of step', () => {
      const wrapper = shallow(<Slider {...props} />);
      const instance = wrapper.instance();
      instance.playForward();
      expect(props.carouselStore.state.currentSlide).toBe(2);
    });

    it('playForward() should jump to slide 0 if at the end of the slides.', () => {
      props.carouselStore.state.currentSlide = 3;
      const wrapper = shallow(<Slider {...props} currentSlide={3} />);
      expect(props.carouselStore.state.currentSlide).toBe(3);
      const instance = wrapper.instance();
      instance.playForward();
      expect(props.carouselStore.state.currentSlide).toBe(0);
    });

    it('playBackward() should derement the currentSlide by value of step', () => {
      props.carouselStore.state.currentSlide = 4;
      const wrapper = shallow(<Slider {...props} currentSlide={4} />);
      expect(props.carouselStore.state.currentSlide).toBe(4);
      const instance = wrapper.instance();
      instance.playBackward();
      expect(props.carouselStore.state.currentSlide).toBe(2);
    });

    it('playBackward() should jump to totalSlides - visibleSlides (end of the slides) if at the start of slides.', () => {
      const wrapper = shallow(<Slider {...props} />);
      expect(props.carouselStore.state.currentSlide).toBe(0);
      const instance = wrapper.instance();
      instance.playBackward();
      expect(props.carouselStore.state.currentSlide).toBe(3);
    });

    it('should not change isBeingMouseDragged on mousedown event when dragging is disabled', () => {
      const wrapper = shallow(<Slider {...props} dragEnabled={false} />);
      expect(wrapper.state('isBeingMouseDragged')).toBe(false);

      wrapper.find('.sliderTray').simulate('mousedown', drag100);
      wrapper.update();

      expect(wrapper.state('isBeingMouseDragged')).toBe(false);
    });

    it('should set isBeingMouseDragged to true on mousedown event', () => {
      const wrapper = shallow(<Slider {...props} />);
      expect(wrapper.state('isBeingMouseDragged')).toBe(false);

      wrapper.find('.sliderTray').simulate('mousedown', drag100);
      wrapper.update();

      expect(wrapper.state('isBeingMouseDragged')).toBe(true);
    });

    it('should set isBeingMouseDragged to true when the mouse is moving while in a dragging state', () => {
      const wrapper = shallow(<Slider {...props} />);

      wrapper.find('.sliderTray').simulate('mousedown', drag100);
      wrapper.update();
      wrapper.find('.sliderTray').simulate('mousemove', drag100);
      wrapper.update();

      expect(wrapper.state('isBeingMouseDragged')).toBe(true);
    });

    // it('should prevent default action on clicks when mouse is moving', () => {
    //   const wrapper = shallow(<Slider {...props} />);
    //   const instance = wrapper.instance();
    //
    //   instance.sliderTrayElement = {
    //     clientWidth: 100,
    //     clientHeight: 100,
    //   };
    //
    //   wrapper.find('.sliderTray').simulate('mousedown', drag100);
    //   wrapper.update();
    //   wrapper.find('.sliderTray').simulate('mousemove', drag100);
    //   wrapper.update();
    //
    //   expect(wrapper.state('isBeingMouseDragged')).toBe(true);
    //   drag100.preventDefault.mockReset();
    //
    //   wrapper.find('.sliderTray').simulate('click', drag100);
    //   wrapper.update();
    //
    //   expect(drag100.preventDefault).toHaveBeenCalled();
    //   expect(wrapper.state('isBeingMouseDragged')).toBe(false);
    // });
    //
    // it('should not prevent default action on clicks when not dragging or mouse moving', () => {
    //   const wrapper = shallow(<Slider {...props} dragEnabled />);
    //   const instance = wrapper.instance();
    //
    //   instance.sliderTrayElement = {
    //     clientWidth: 100,
    //     clientHeight: 100,
    //   };
    //
    //   drag100.preventDefault.mockReset();
    //
    //   wrapper.setState({
    //     isBeingMouseDragged: true,
    //     mouseIsMoving: false,
    //   });
    //
    //   wrapper.find('.sliderTray').simulate('click', drag100);
    //   wrapper.update();
    //
    //   expect(drag100.preventDefault).toHaveBeenCalledTimes(0);
    // });

    // it('should not do anything on clicks when dragging is disabled', () => {
    //   const wrapper = shallow(<Slider {...props} dragEnabled={false} />);
    //   const instance = wrapper.instance();
    //   expect(instance.handleOnMouseClick(drag100)).toBeUndefined();
    // });

    it('should not do anything when moving the mouse if not dragging', () => {
      const wrapper = shallow(<Slider {...props} />);

      wrapper.find('.sliderTray').simulate('mousemove', drag100);
      wrapper.update();

      expect(wrapper.state('deltaX')).toBe(0);
      expect(wrapper.state('deltaY')).toBe(0);
    });

    it('should not do anything when moving the mouse if dragging is not enabled', () => {
      const wrapper = shallow(<Slider {...props} dragEnabled={false} />);

      wrapper.find('.sliderTray').simulate('click', drag100);
      wrapper.update();
      wrapper.find('.sliderTray').simulate('mousemove', drag100);
      wrapper.update();

      expect(wrapper.state('deltaX')).toBe(0);
      expect(wrapper.state('deltaY')).toBe(0);
    });
    it('lockScroll() should NOT set scrollParent style if there is no scrollParent', () => {
      const wrapper = mount(<Slider {...props} />);
      const instance = wrapper.instance();
      instance.sliderTrayElement = null;
      instance.lockScroll();
      expect(instance.scrollParent).toEqual(null);
    });
    it('unlockScroll() should NOT set scrollParent style if there is no scrollParent', () => {
      const wrapper = mount(<Slider {...props} />);
      const instance = wrapper.instance();
      instance.sliderTrayElement = null;
      instance.unlockScroll();
      expect(instance.scrollParent).toEqual(null);
    });
    it('unlockScroll() should set scrollParent style if there is a scrollParent', () => {
      const wrapper = mount(<Slider {...props} />);
      const instance = wrapper.instance();
      instance.sliderTrayElement = null;
      instance.unlockScroll();
      expect(instance.scrollParent).toEqual(null);
    });
  });
});
