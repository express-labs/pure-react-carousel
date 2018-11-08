import React from 'react';
import PropTypes from 'prop-types';
import Dot from '../Dot';
import { CarouselPropTypes, cn } from '../helpers';
import s from './DotGroup.scss';

const DotGroup = class DotGroup extends React.Component {
  static propTypes = {
    children: CarouselPropTypes.children,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    carouselStore: PropTypes.object.isRequired,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
    dotNumbers: PropTypes.bool,
  }

  static defaultProps = {
    children: null,
    className: null,
    dotNumbers: false,
  }

  renderDots() {
    const { currentSlide, totalSlides, visibleSlides } = this.props;
    const dots = [];
    for (let i = 0; i < totalSlides; i += 1) {
      const selected = i >= currentSlide && i < (currentSlide + visibleSlides);
      const slide = i >= totalSlides - visibleSlides ? totalSlides - visibleSlides : i;
      dots.push(
        <Dot key={i} slide={slide} selected={selected} disabled={selected}>
          <span className={cn['carousel__dot-group-dot']}>{this.props.dotNumbers && i + 1}</span>
        </Dot>,
      );
    }
    return dots;
  }

  render() {
    const {
      carouselStore, children, className, currentSlide, dotNumbers, totalSlides, visibleSlides,
      ...props
    } = this.props;

    const newClassName = cn([
      s.DotGroup,
      'carousel__dot-group',
      className,
    ]);

    return (
      <div className={newClassName} {...props}>
        {this.renderDots()}
        {children}
      </div>
    );
  }
};

export default DotGroup;
