import React from 'react';
import PropTypes from 'prop-types';
import { cn, pct, slideUnit } from '../helpers';
import s from './slider.css';

const Slider = class Slider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    currentSlide: PropTypes.number,
    slideTrayWidth: PropTypes.number,
    visibleSlides: PropTypes.number,
  }

  static defaultProps = {
    className: '',
    style: {},
    currentSlide: 0,
    slideTrayWidth: 100,
    slideWidth: 100,
    visibleSlides: 1,
  }

  render() {
    const style = Object.assign({}, this.props.style, {
      width: pct(this.props.slideTrayWidth),
      marginLeft: pct(slideUnit(this.props.visibleSlides) * this.props.currentSlide * -1),
    });


    return (
      <div className={cn(['slider', s.slider, this.props.className])}>
        <div className={cn(['slider__inner', s.sliderInner])} style={style}>
          {this.props.children}
        </div>
      </div>
    );
  }
};

export default Slider;
