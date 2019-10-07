import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn, move } from '../helpers';
import s from './ButtonNext.scss';

const ButtonNext = class ButtonNext extends React.PureComponent {
  static propTypes = {
    carouselStore: PropTypes.object.isRequired,
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    infiniteLoop: CarouselPropTypes.infiniteLoop.isRequired,
    onClick: PropTypes.func,
    step: PropTypes.number.isRequired,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  };

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
  };

  static setDisabled(disabled, currentSlide, visibleSlides, totalSlides) {
    if (disabled !== null) return disabled;
    if (currentSlide >= totalSlides - visibleSlides) return true;
    return false;
  }

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(ev) {
    // TODO: move all this logic to a central location to make it available to other components.
    // then import it here.
    const {
      carouselStore,
      currentSlide,
      infiniteLoop,
      onClick,
      step,
      totalSlides,
      visibleSlides,
    } = this.props;

    if (infiniteLoop !== 'off') {
      const nextLeftMostSlide = move(currentSlide, step, totalSlides);
      const nextRightMostSlide = move(currentSlide + visibleSlides, step, totalSlides);
      const originalSlidesStartAt = visibleSlides;
      if (nextRightMostSlide < nextLeftMostSlide) {
        const preJumpToSlide = originalSlidesStartAt - (nextRightMostSlide - visibleSlides);
        carouselStore.setStoreState = {
          // jump to this slide BEFORE the animation to give the illusion of infinite slides.
          preJumpToSlide,
        };
      }
    } else {
      const maxSlide = totalSlides - visibleSlides;
      const newCurrentSlide = Math.min(currentSlide + step, maxSlide);
      carouselStore.setStoreState(
        {
          currentSlide: newCurrentSlide,
        },
        onClick !== null && onClick.call(this, ev),
      );
    }
  }

  render() {
    const {
      carouselStore,
      className,
      currentSlide,
      disabled,
      onClick,
      step,
      totalSlides,
      visibleSlides,
      ...props
    } = this.props;

    const newClassName = cn([s.buttonNext, 'carousel__next-button', className]);
    const isDisabled = ButtonNext.setDisabled(disabled, currentSlide, visibleSlides, totalSlides);

    return (
      <button
        type="button"
        aria-label="next"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={isDisabled}
        {...props}
      >
        {this.props.children}
      </button>
    );
  }
};

export default ButtonNext;
