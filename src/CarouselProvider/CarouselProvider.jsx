import React from 'react';
import PropTypes from 'prop-types';
import Store from '../Store/Store';
import {
  CarouselPropTypes, slideSize, slideTraySize, cn,
} from '../helpers';

const CarouselProvider = class CarouselProvider extends React.Component {
  static propTypes = {
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number,
    disableAnimation: PropTypes.bool,
    disableKeyboard: PropTypes.bool,
    dragEnabled: PropTypes.bool,
    dragStep: PropTypes.number,
    hasMasterSpinner: PropTypes.bool,
    interval: PropTypes.number,
    infiniteLoop: CarouselPropTypes.infiniteLoop,
    isPageScrollLocked: PropTypes.bool,
    isPlaying: PropTypes.bool,
    lockOnWindowScroll: PropTypes.bool,
    naturalSlideHeight: PropTypes.number.isRequired,
    naturalSlideWidth: PropTypes.number.isRequired,
    orientation: CarouselPropTypes.orientation,
    playDirection: CarouselPropTypes.direction,
    step: PropTypes.number,
    tag: PropTypes.string,
    totalSlides: PropTypes.number.isRequired,
    touchEnabled: PropTypes.bool,
    visibleSlides: PropTypes.number,
  };

  static childContextTypes = {
    carouselStore: PropTypes.object,
  };

  static defaultProps = {
    className: null,
    currentSlide: 0,
    disableAnimation: false,
    disableKeyboard: false,
    dragEnabled: true,
    dragStep: 1,
    hasMasterSpinner: false,
    interval: 5000,
    infiniteLoop: 'off',
    isPageScrollLocked: false,
    isPlaying: false,
    lockOnWindowScroll: false,
    orientation: 'horizontal',
    playDirection: 'forward',
    step: 1,
    tag: 'div',
    touchEnabled: true,
    visibleSlides: 1,
  };

  constructor(props, context) {
    super(props, context);

    const realCurrentSlide = props.infiniteLoop === 'auto' || props.infiniteLoop === 'manual'
      ? props.currentSlide + props.visibleSlides - 1
      : props.currentSlide;

    const realTotalSlides = props.infiniteLoop === 'auto'
      ? props.totalSlides + (props.visibleSlides - 1) * 2
      : props.totalSlides;

    const options = {
      currentSlide: realCurrentSlide,
      disableAnimation: props.disableAnimation,
      disableKeyboard: props.disableKeyboard,
      dragEnabled: props.dragEnabled,
      dragStep: props.dragStep,
      hasMasterSpinner: props.hasMasterSpinner,
      imageErrorCount: 0,
      imageSuccessCount: 0,
      interval: props.interval,
      infiniteLoop: props.infiniteLoop,
      isPageScrollLocked: props.isPageScrollLocked,
      isPlaying: props.isPlaying,
      lockOnWindowScroll: props.lockOnWindowScroll,
      masterSpinnerThreshold: 0,
      naturalSlideHeight: props.naturalSlideHeight,
      naturalSlideWidth: props.naturalSlideWidth,
      orientation: props.orientation,
      playDirection: props.playDirection,
      privateUnDisableAnimation: false,
      slideSize: slideSize(props.totalSlides, props.visibleSlides),
      slideTraySize: slideTraySize(props.totalSlides, props.visibleSlides),
      step: props.step,
      totalSlides: realTotalSlides,
      touchEnabled: props.touchEnabled,
      visibleSlides: props.visibleSlides,
    };
    this.carouselStore = new Store(options);
  }

  getChildContext() {
    return { carouselStore: this.carouselStore };
  }

  componentDidUpdate(prevProps) {
    const newStoreState = {};

    [
      'currentSlide', // poorly named.  This is only slide that shows on MOUNT. deprecating soon.
      'disableAnimation',
      'disableKeyboard',
      'dragEnabled',
      'dragStep',
      'hasMasterSpinner',
      'interval',
      'infiniteLoop',
      'isPlaying',
      'lockOnWindowScroll',
      'naturalSlideHeight',
      'naturalSlideWidth',
      'orientation',
      'playDirection',
      'step',
      'totalSlides',
      'touchEnabled',
      'visibleSlides',
    ].forEach((propName) => {
      if (prevProps[propName] !== this.props[propName]) {
        newStoreState[propName] = this.props[propName];
      }
    });

    const isNewCurrentSlide = this.props.currentSlide !== prevProps.currentSlide;

    // currentSlide, a poorly named variable that determines which slide show when carousel is
    // mounted, has changed value.  We want to temporarily disable the css transition and just
    // "jump" to the new "currentSlide"

    // Disable the css animation, set a private flag to re-enable the animation.
    if (isNewCurrentSlide && !this.props.disableAnimation) {
      newStoreState.disableAnimation = true;
      newStoreState.privateUnDisableAnimation = true;
      // Slider.jsx componentDidUpdate detects privateUnDisableAnimation to re-enable animation.
    }

    if (
      this.props.totalSlides !== prevProps.totalSlides
      || this.props.visibleSlides !== prevProps.visibleSlides
    ) {
      newStoreState.slideSize = slideSize(this.props.totalSlides, this.props.visibleSlides);
      newStoreState.slideTraySize = slideTraySize(this.props.totalSlides, this.props.visibleSlides);
    }

    if (Object.keys(newStoreState).length > 0) {
      this.carouselStore.setStoreState(newStoreState);
    }
  }

  componentWillUnmount() {
    this.carouselStore.unsubscribeAllMasterSpinner();
  }

  // Utility function for tests.
  // in jest + enzyme tests you can do wrapper.instance().getStore()
  // you can also just do...
  // wrapper.instance().carouselStore
  // I created this method to make it obvious that you have access to carouselStore.
  getStore() {
    return this.carouselStore;
  }

  render() {
    const {
      children,
      className,
      currentSlide,
      disableAnimation,
      disableKeyboard,
      dragEnabled,
      dragStep,
      hasMasterSpinner,
      interval,
      infiniteLoop,
      isPageScrollLocked,
      isPlaying,
      lockOnWindowScroll,
      naturalSlideHeight,
      naturalSlideWidth,
      orientation,
      playDirection,
      step,
      tag: Tag,
      totalSlides,
      touchEnabled,
      visibleSlides,
      ...filteredProps
    } = this.props;

    const newClassName = cn(['carousel', this.props.className]);

    return (
      <Tag className={newClassName} {...filteredProps}>
        {this.props.children}
      </Tag>
    );
  }
};

export default CarouselProvider;
