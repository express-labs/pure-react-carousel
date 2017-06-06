import React from 'react';
import PropTypes from 'prop-types';
import { Store } from '../';
import { CarouselPropTypes, slideSize, slideTraySize } from '../helpers';

export default class CarouselProvider extends React.Component {
  static propTypes = {
    children: CarouselPropTypes.children.isRequired,
    currentSlide: PropTypes.number,
    hasMasterSpinner: PropTypes.bool,
    height: CarouselPropTypes.height,
    orientation: CarouselPropTypes.orientation.isRequired,
    step: PropTypes.number,
    totalSlides: PropTypes.number,
    touchEnabled: PropTypes.bool,
    visibleSlides: PropTypes.number,
  }

  static defaultProps = {
    currentSlide: 0,
    hasMasterSpinner: false,
    orientation: 'horizontal',
    step: 1,
    totalSlides: 1,
    touchEnabled: true,
    visibleSlides: 1,
    height: null,
  }

  static childContextTypes = {
    store: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    const options = {
      currentSlide: props.currentSlide,
      hasMasterSpinner: props.hasMasterSpinner,
      height: props.height,
      imageErrorCount: 0,
      imageSuccessCount: 0,
      masterSpinnerThreshold: 0,
      orientation: props.orientation,
      slideTraySize: slideTraySize(props.totalSlides, props.visibleSlides),
      slideSize: slideSize(props.totalSlides, props.visibleSlides),
      step: props.step,
      totalSlides: props.totalSlides,
      touchEnabled: props.touchEnabled,
      visibleSlides: props.visibleSlides,
    };
    this.store = new Store(options);
  }

  getChildContext() {
    return { store: this.store };
  }

  render() {
    return <div className="carousel">{this.props.children}</div>;
  }
}
