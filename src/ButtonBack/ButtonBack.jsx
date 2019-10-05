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
    infinite: PropTypes.bool.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  };

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
  }

  static setDisabled(disabled, currentSlide, infinite) {
    if (disabled !== null) return disabled;
    if (currentSlide === 0 && !infinite) return true;
    return false;
  }

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.state = {
      disabled: ButtonBack.setDisabled(props.disabled, props.currentSlide, props.infinite),
    };
  }

  // TODO: get tests for this to work again
  /* istanbul ignore next */
  componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: ButtonBack.setDisabled(
        nextProps.disabled,
        nextProps.currentSlide,
        nextProps.infinite,
      ),
    });
  }

  handleOnClick(ev) {
    const {
      carouselStore, currentSlide, onClick, step, infinite, visibleSlides, totalSlides,
    } = this.props;

    const maxSlide = totalSlides - visibleSlides;

    let finalSlideState = Math.max(
      currentSlide - step,
      0,
    );

    if (infinite) {
      const isOnFirstSlide = currentSlide === 0;
      finalSlideState = isOnFirstSlide ? maxSlide : finalSlideState;
    }

    carouselStore.setStoreState({
      currentSlide: finalSlideState,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      carouselStore, className, currentSlide, disabled, onClick, step, ...props
    } = this.props;

    const newClassName = cn([
      s.buttonBack,
      'carousel__back-button',
      className,
    ]);

    return (
      <button
        type="button"
        aria-label="previous"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={this.state.disabled}
        {...props}
      >
        {this.props.children}
      </button>
    );
  }
}
