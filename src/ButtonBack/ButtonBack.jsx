import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn, move } from '../helpers';
import s from './ButtonBack.scss';

export default class ButtonBack extends React.Component {
  static propTypes = {
    carouselStore: PropTypes.object.isRequired,
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    step: PropTypes.number.isRequired,
    infiniteLoop: CarouselPropTypes.infiniteLoop.isRequired,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  };

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
  };

  static setDisabled(disabled, currentSlide) {
    if (disabled !== null) return disabled;
    if (currentSlide === 0) return true;
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
      const nextLeftMostSlide = move(currentSlide - visibleSlides, -step, totalSlides);
      const nextRightMostSlide = move(currentSlide, -step, totalSlides);
      const originalSlidesEndAt = totalSlides - visibleSlides;
      if (nextLeftMostSlide > nextRightMostSlide) {
        const preJumpToSlide = originalSlidesEndAt + (nextLeftMostSlide - totalSlides);
        carouselStore.setStoreState = {
          // jump to this slide BEFORE the animation to give the illusion of infinite slides.
          preJumpToSlide,
        };
      }
    } else {
      const newCurrentSlide = Math.max(currentSlide - step, 0);
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
      ...props
    } = this.props;

    const newClassName = cn([s.buttonBack, 'carousel__back-button', className]);
    const isDisabled = ButtonBack.setDisabled(this.props.disabled, this.props.currentSlide);

    return (
      <button
        type="button"
        aria-label="previous"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={isDisabled}
        {...props}
      >
        {this.props.children}
      </button>
    );
  }
}
