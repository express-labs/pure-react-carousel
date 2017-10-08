import React from 'react';
import PropTypes from 'prop-types';
import s from './ButtonLast.css';
import { CarouselPropTypes, cn } from '../helpers';

const ButtonLast = class ButtonLast extends React.Component {
  static propTypes = {
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    carouselStore: PropTypes.object.isRequired,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  }

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
  }

  constructor() {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(ev) {
    const { carouselStore, onClick, totalSlides, visibleSlides } = this.props;
    carouselStore.setStoreState({
      currentSlide: totalSlides - visibleSlides,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      className, currentSlide, disabled, onClick, carouselStore, totalSlides, visibleSlides, ...props
    } = this.props;

    const newClassName = cn([
      s.buttonLast,
      'carousel__last-button',
      className,
    ]);

    const newDisabled = disabled !== null ? disabled : currentSlide >= totalSlides - visibleSlides;

    return (
      <button
        aria-label="last"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={newDisabled}
        {...props}
      >{this.props.children}</button>
    );
  }
};

export default ButtonLast;
