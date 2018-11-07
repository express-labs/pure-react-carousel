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
  };

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
  }

  static setDisabled(disabled, currentSlide, visibleSlides, totalSlides) {
    if (disabled !== null) return disabled;
    if (currentSlide >= (totalSlides - visibleSlides)) return true;
    return false;
  }

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.state = {
      disabled: ButtonNext.setDisabled(
        props.disabled,
        props.currentSlide,
        props.visibleSlides,
        props.totalSlides,
      ),
    };
  }

  // TODO: get tests for this to work again
  /* istanbul ignore next */
  componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: ButtonNext.setDisabled(
        nextProps.disabled,
        nextProps.currentSlide,
        nextProps.visibleSlides,
        nextProps.totalSlides,
      ),
    });
  }

  handleOnClick(ev) {
    const {
      currentSlide, onClick, step, carouselStore,
    } = this.props;
    const maxSlide = this.props.totalSlides - this.props.visibleSlides;
    const newCurrentSlide = Math.min(
      (currentSlide + step),
      maxSlide,
    );
    carouselStore.setStoreState({
      currentSlide: newCurrentSlide,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      carouselStore, className, currentSlide, disabled, onClick, step, totalSlides, visibleSlides,
      ...props
    } = this.props;

    const newClassName = cn([
      s.buttonNext,
      'carousel__next-button',
      className,
    ]);

    return (
      <button
        type="button"
        aria-label="next"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={this.state.disabled}
        {...props}
      >
        {this.props.children}
      </button>
    );
  }
};

export default ButtonNext;
