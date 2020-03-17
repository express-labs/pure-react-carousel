import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn } from '../helpers';
import s from './ButtonNext.scss';

const ButtonNext = class ButtonNext extends React.PureComponent {
  static propTypes = {
    carouselStore: PropTypes.object.isRequired,
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    step: PropTypes.number.isRequired,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
    infinite: PropTypes.bool,
  };

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
    infinite: false,
  };

  static setDisabled(disabled, currentSlide, visibleSlides, totalSlides, infinite) {
    if (disabled !== null) return disabled;
    if (currentSlide >= totalSlides - visibleSlides && !infinite) return true;
    return false;
  }

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(ev) {
    const {
      currentSlide, onClick, step, carouselStore, infinite, totalSlides, visibleSlides,
    } = this.props;

    const maxSlide = totalSlides - visibleSlides;
    const nextSlide = step + currentSlide;

    let newCurrentSlide = Math.min(
      nextSlide,
      maxSlide,
    );

    if (infinite) {
      const isOnLastSlide = maxSlide === currentSlide;
      newCurrentSlide = isOnLastSlide ? 0 : newCurrentSlide;
    }

    carouselStore.setStoreState(
      {
        currentSlide: newCurrentSlide,
        isPlaying: false,
      },
      onClick !== null && onClick.call(this, ev),
    );
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
      infinite,
      ...props
    } = this.props;

    const newClassName = cn([s.buttonNext, 'carousel__next-button', className]);
    const isDisabled = ButtonNext.setDisabled(
      disabled,
      currentSlide,
      visibleSlides,
      totalSlides,
      infinite,
    );

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
