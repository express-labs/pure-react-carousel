import React from 'react';
import PropTypes from 'prop-types';
import { cn, computeSliderInnerWidth } from '../helpers';
import s from './slider-style.css';

const Slider = class Slider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  }

  static defaultProps = {
    className: '',
    style: {},
  }

  render() {
    const style = Object.assign({}, this.props.style, {
      width: computeSliderInnerWidth(this.props.totalSlides, this.props.visibleSlides),
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
