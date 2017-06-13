import React from 'react';
import PropTypes from 'prop-types';
import { Dot } from '../';
import { CarouselPropTypes, cn } from '../helpers';
import s from './DotGroup.css';

const DotGroup = class DotGroup extends React.Component {
  static propTypes = {
    children: CarouselPropTypes.children,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    store: PropTypes.object.isRequired,
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
      dots.push(<Dot key={i} slide={slide} selected={selected} disabled={selected}>
        <span className={cn['carousel__dot-group-dot']}>{this.props.dotNumbers && i + 1}</span>
      </Dot>);
    }
    return dots;
  }

  render() {
    const {
      className, currentSlide, store, totalSlides, visibleSlides, dotNumbers, ...props
    } = this.props;

    const newClassName = cn([
      s.DotGroup,
      'carousel__dot-group',
      className,
    ]);

    return (
      <div className={newClassName} {...props}>
        {this.renderDots()}
      </div>
    );
  }
};

export default DotGroup;
