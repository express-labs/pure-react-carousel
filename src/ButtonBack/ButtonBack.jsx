import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn } from '../helpers';
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
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
    infinite: PropTypes.bool,
    tag: PropTypes.elementType,
  };

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
    infinite: false,
    tag: 'button',
  };

  static setDisabled(disabled, currentSlide, infinite) {
    if (disabled !== null) return disabled;
    if (currentSlide === 0 && !infinite) return true;
    return false;
  }

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(ev) {
    const {
      carouselStore, currentSlide, onClick, step, infinite, visibleSlides, totalSlides,
    } = this.props;

    const maxSlide = totalSlides - visibleSlides;

    let newCurrentSlide = Math.max(
      currentSlide - step,
      0,
    );

    if (infinite) {
      const isOnFirstSlide = currentSlide === 0;
      newCurrentSlide = isOnFirstSlide ? maxSlide : newCurrentSlide;
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
      tag: Tag,
      ...props
    } = this.props;

    const newClassName = cn([s.buttonBack, 'carousel__back-button', className]);
    const isDisabled = ButtonBack.setDisabled(
      this.props.disabled,
      this.props.currentSlide,
      infinite,
    );

    return (
      <Tag
        type="button"
        aria-label="previous"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={isDisabled}
        {...props}
      >
        {this.props.children}
      </Tag>
    );
  }
}
