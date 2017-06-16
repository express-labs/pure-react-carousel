import React from 'react';
import PropTypes from 'prop-types';
import omit from 'object.omit';
import { Store } from '../';
import { CarouselPropTypes, slideSize, slideTraySize, cn } from '../helpers';

const CarouselProvider = class CarouselProvider extends React.Component {
  static propTypes = {
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number,
    hasMasterSpinner: PropTypes.bool,
    naturalSlideHeight: PropTypes.number.isRequired,
    naturalSlideWidth: PropTypes.number.isRequired,
    orientation: CarouselPropTypes.orientation,
    step: PropTypes.number,
    totalSlides: PropTypes.number.isRequired,
    touchEnabled: PropTypes.bool,
    visibleSlides: PropTypes.number,
  }

  static defaultProps = {
    className: null,
    currentSlide: 0,
    hasMasterSpinner: false,
    orientation: 'horizontal',
    step: 1,
    touchEnabled: true,
    visibleSlides: 1,
  }

  static childContextTypes = {
    store: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    const options = {
      currentSlide: props.currentSlide,
      hasMasterSpinner: props.hasMasterSpinner,
      imageErrorCount: 0,
      imageSuccessCount: 0,
      masterSpinnerThreshold: 0,
      naturalSlideHeight: props.naturalSlideHeight,
      naturalSlideWidth: props.naturalSlideWidth,
      orientation: props.orientation,
      slideSize: slideSize(props.totalSlides, props.visibleSlides),
      slideTraySize: slideTraySize(props.totalSlides, props.visibleSlides),
      step: props.step,
      totalSlides: props.totalSlides,
      touchEnabled: props.touchEnabled,
      visibleSlides: props.visibleSlides,
    };
    this.store = new Store(options);
  }

  // Utility function for tests.
  // in jest + enzyme tests you can do wrapper.instance().getStore()
  // you can also just do...
  // wrapper.instance().store
  // I created this method to make it obvious that you have access to store.
  getStore() {
    return this.store;
  }

  getChildContext() {
    return { store: this.store };
  }

  componentWillReceiveProps(nextProps) {
    const newStoreState = {};

    [
      'currentSlide',
      'hasMasterSpinner',
      'naturalSlideHeight',
      'naturalSlideWidth',
      'orientation',
      'step',
      'totalSlides',
      'touchEnabled',
      'visibleSlides',
    ].forEach((propName) => {
      if (nextProps[propName] !== this.props[propName]) {
        newStoreState[propName] = nextProps[propName];
      }
    });

    if (
      this.props.totalSlides !== nextProps.totalSlides ||
      this.props.visibleSlides !== nextProps.visibleSlides
    ) {
      newStoreState.slideSize = slideSize(nextProps.totalSlides, nextProps.visibleSlides);
      newStoreState.slideTraySize = slideTraySize(nextProps.totalSlides, nextProps.visibleSlides);
    }

    if (Object.keys(newStoreState).length > 0) {
      this.store.setStoreState(newStoreState);
    }
  }

  render() {
    const filteredProps = omit(this.props, Object.keys(CarouselProvider.propTypes));
    const newClassName = cn([
      'carousel',
      this.props.className,
    ]);

    return <div className={newClassName} {...filteredProps}>{this.props.children}</div>;
  }
};

export default CarouselProvider;
