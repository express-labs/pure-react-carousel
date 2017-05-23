import React from 'react';
import PropTypes from 'prop-types';
import { Store } from '../';

export default class CarouselProvider extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    visibleSlides: PropTypes.number,
    totalSlides: PropTypes.number,
  }

  static defaultProps = {
    visibleSlides: 1,
    totalSlides: 0,
  }

  static childContextTypes = {
    store: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    const options = {
      visibleSlides: props.visibleSlides,
      totalSlides: props.totalSlides,
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
