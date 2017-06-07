import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn } from '../helpers';
import s from './ButtonNext.css';

const ButtonNext = class ButtonNext extends React.PureComponent {
  static propTypes = {
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    step: PropTypes.number.isRequired,
    store: PropTypes.object.isRequired,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  };

  static defaultProps = {
    disabled: null,
    className: null,
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
    const { currentSlide, onClick, step, store } = this.props;
    const maxSlide = this.props.totalSlides - this.props.visibleSlides;
    const newCurrentSlide = Math.min(
      (currentSlide + step),
      maxSlide,
    );
    store.setState({
      currentSlide: newCurrentSlide,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      className, currentSlide, disabled, onClick, step, store, totalSlides, visibleSlides, ...props
    } = this.props;

    const newClassName = cn([
      s.buttonNext,
      'carousel__next-button',
      className,
    ]);

    return (
      <button
        aria-label="next"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={this.state.disabled}
        {...props}
      >{this.props.children}</button>
    );
  }
};

export default ButtonNext;
