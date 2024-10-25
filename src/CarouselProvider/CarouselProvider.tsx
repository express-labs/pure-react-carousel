import React from 'react';
import { responsiveSlideSize, responsiveSlideTraySize, cn } from '../helpers';

import { createContext } from 'react';

export const TasksContext = createContext(null);
export const TasksDispatchContext = createContext(null);

type CommonProps = {
  className?: string;
  interval?: number;
  lockOnWindowScroll?: boolean;
  responsive?: boolean;
  animations?: boolean;
  initialSlide?: number;
  stepSlideShow?: number;
  stepDrag?: number;
  visibleSlides?: number;
  totalSlides?: number;
  infiniteSlideShow?: boolean;
};

type HorizontalSlider = {
  orientation: 'horizontal';
  playDirection: 'right' | 'left';
  slideWidth: number;
};

type VerticalSlider = {
  orientation: 'vertical';
  playDirection: 'up' | 'down';
  slideHeight: number;
};

export type CarouselProviderProps = CommonProps &
  (HorizontalSlider | VerticalSlider);

export type CarouselContext = {
  currentSlide: number;
  isAnimationEnabled: boolean;
  isKeyboardEnabled: boolean;
  isResponsiveEnabled: boolean;
  interval: number;
  isPageScrollLocked: boolean;
  isPlaying: boolean;
  isLockOnWindowScroll: boolean;
  naturalSlideHeight?: number;
  naturalSlideWidth?: number;
  orientation: 'horizontal' | 'vertical';
  playDirection: 'right' | 'left';
  slideSize: number;
  slideTraySize: number;
  stepSlideShow: number;
  stepDrag: number;
  totalSlides: number;
  visibleSlides: number;
  infinite: boolean;
};

const CarouselProvider = (props: CarouselProviderProps) => {
  return <h1>Hello</h1>;
};

const CarouselProvider = class CarouselProvider extends React.Component {
  static propTypes = {
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number,
    disableAnimation: PropTypes.bool,
    disableKeyboard: PropTypes.bool,
    hasMasterSpinner: PropTypes.bool,
    interval: PropTypes.number,
    isPageScrollLocked: PropTypes.bool,
    isPlaying: PropTypes.bool,
    lockOnWindowScroll: PropTypes.bool,
    naturalSlideHeight: PropTypes.number.isRequired,
    naturalSlideWidth: PropTypes.number.isRequired,
    orientation: CarouselPropTypes.orientation,
    playDirection: CarouselPropTypes.direction,
    step: PropTypes.number,
    dragStep: PropTypes.number,
    tag: PropTypes.string,
    totalSlides: PropTypes.number.isRequired,
    touchEnabled: PropTypes.bool,
    dragEnabled: PropTypes.bool,
    visibleSlides: PropTypes.number,
    infinite: PropTypes.bool,
    isIntrinsicHeight: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    currentSlide: 0,
    disableAnimation: false,
    disableKeyboard: false,
    interval: 5000,
    isPageScrollLocked: false,
    isPlaying: false,
    lockOnWindowScroll: false,
    orientation: 'horizontal',
    playDirection: 'forward',
    step: 1,
    dragStep: 1,
    tag: 'div',
    touchEnabled: true,
    dragEnabled: true,
    visibleSlides: 1,
    infinite: false,
    isIntrinsicHeight: false,
  };

  constructor(props) {
    super(props);
    if (props.isIntrinsicHeight && props.orientation !== 'horizontal') {
      throw Error(
        'isIntrinsicHeight can only be used in "horizontal" orientation. See Readme for more information.'
      );
    }
    const options = {
      currentSlide: props.currentSlide,
      disableAnimation: props.disableAnimation,
      disableKeyboard: props.disableKeyboard,
      hasMasterSpinner: props.hasMasterSpinner,
      imageErrorCount: 0,
      imageSuccessCount: 0,
      interval: props.interval,
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
      dragStep: props.dragStep,
      totalSlides: props.totalSlides,
      touchEnabled: props.touchEnabled,
      dragEnabled: props.dragEnabled,
      visibleSlides: props.visibleSlides,
      infinite: props.infinite,
      isIntrinsicHeight: props.isIntrinsicHeight,
    };
    this.carouselStore = new Store(options);
  }

  componentDidUpdate(prevProps) {
    const newStoreState = {};

    [
      'currentSlide', // poorly named.  This is only slide that shows on MOUNT. deprecating soon.
      'disableAnimation',
      'disableKeyboard',
      'hasMasterSpinner',
      'interval',
      'isPlaying',
      'naturalSlideHeight',
      'naturalSlideWidth',
      'lockOnWindowScroll',
      'orientation',
      'playDirection',
      'step',
      'dragStep',
      'totalSlides',
      'touchEnabled',
      'dragEnabled',
      'visibleSlides',
    ].forEach((propName) => {
      if (prevProps[propName] !== this.props[propName]) {
        newStoreState[propName] = this.props[propName];
      }
    });

    const isNewCurrentSlide =
      this.props.currentSlide !== prevProps.currentSlide;

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
      this.props.totalSlides !== prevProps.totalSlides ||
      this.props.visibleSlides !== prevProps.visibleSlides
    ) {
      newStoreState.slideSize = slideSize(
        this.props.totalSlides,
        this.props.visibleSlides
      );
      newStoreState.slideTraySize = slideTraySize(
        this.props.totalSlides,
        this.props.visibleSlides
      );
    }

    if (this.carouselStore.state.currentSlide >= this.props.totalSlides) {
      newStoreState.currentSlide = Math.max(this.props.totalSlides - 1, 0);
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
      hasMasterSpinner,
      interval,
      isPageScrollLocked,
      isPlaying,
      lockOnWindowScroll,
      naturalSlideHeight,
      naturalSlideWidth,
      orientation,
      playDirection,
      step,
      dragStep,
      tag: Tag,
      totalSlides,
      touchEnabled,
      dragEnabled,
      visibleSlides,
      infinite,
      isIntrinsicHeight,
      ...filteredProps
    } = this.props;

    const newClassName = cn(['carousel', this.props.className]);

    return (
      <Tag className={newClassName} {...filteredProps}>
        <Context.Provider value={this.carouselStore}>
          {this.props.children}
        </Context.Provider>
      </Tag>
    );
  }
};

export default CarouselProvider;
