import React from 'react';
import PropTypes from 'prop-types';
import s from './ButtonFirst.scss';
import { CarouselPropTypes, cn } from '../helpers';

const ButtonFirst = class ButtonFirst extends React.Component {
  static propTypes = {
    carouselStore: PropTypes.object.isRequired,
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    totalSlides: PropTypes.number.isRequired,
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
    const { carouselStore, onClick } = this.props;
    carouselStore.setStoreState({
      currentSlide: 0,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      carouselStore, className, currentSlide, disabled, onClick, totalSlides, ...props
    } = this.props;

    const newClassName = cn([
      s.buttonFirst,
      'carousel__first-button',
      className,
    ]);

    const newDisabled = disabled !== null ? disabled : currentSlide === 0;

    return (
      <button
        type="button"
        aria-label="first"
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

export default ButtonFirst;
