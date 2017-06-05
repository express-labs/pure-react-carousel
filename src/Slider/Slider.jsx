import React from 'react';
import PropTypes from 'prop-types';
import { cn, pct } from '../helpers';
import s from './slider.css';

const Slider = class Slider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    store: PropTypes.object.isRequired,
    className: PropTypes.string,
    style: PropTypes.object,
    currentSlide: PropTypes.number.isRequired,
    slideTrayWidth: PropTypes.number.isRequired,
    slideWidth: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number,
  }

  static defaultProps = {
    className: '',
    style: {},
    visibleSlides: 1,
  }

  render() {
    const {
      className, children, currentSlide, slideTrayWidth, slideWidth, store, visibleSlides, ...props
    } = this.props;

    const style = {
      width: pct(slideTrayWidth),
      transform: `translateX(${pct(slideWidth * currentSlide * -1)})`,
    };

    const sliderClasses = cn([
      s.slider,
      'carousel__slide-show',
      className,
    ]);

    const trayClasses = cn([
      s.sliderTray,
      'carousel__slide-tray',
    ]);

    return (
      <div className={sliderClasses} aria-live="polite" {...props}>
        <div className={trayClasses} style={style}>
          {children}
        </div>
      </div>
    );
  }
};

export default Slider;
