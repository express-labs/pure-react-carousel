import React from 'react';
import PropTypes from 'prop-types';
import s from './ButtonLast.scss';
import { CarouselPropTypes, cn } from '../helpers';

const ButtonLast = class ButtonLast extends React.Component {
  static propTypes = {
    carouselStore: PropTypes.object.isRequired,
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
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
    const {
      carouselStore, onClick, totalSlides, visibleSlides,
    } = this.props;
    carouselStore.setStoreState({
      currentSlide: totalSlides - visibleSlides,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      carouselStore, className, currentSlide, disabled, onClick, totalSlides, visibleSlides,
      ...props
    } = this.props;

    const newClassName = cn([
      s.buttonLast,
      'carousel__last-button',
      className,
    ]);

    const newDisabled = disabled !== null ? disabled : currentSlide >= totalSlides - visibleSlides;

    return (
      <button
        type="button"
        aria-label="last"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={newDisabled}
        {...props}
      >
        {this.props.children}
      </button>
    );
  }
};

export default ButtonLast;
