import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../helpers';
import s from './ButtonNext.css';

const ButtonNext = class ButtonNext extends React.PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    step: PropTypes.number.isRequired,
    store: PropTypes.object.isRequired,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  };

  static defaultProps = {
    disabled: null,
  }

  static setDisabled(disabled, currentSlide, visibleSlides, totalSlides) {
    if (disabled !== null) return disabled;
    if (currentSlide === (totalSlides - visibleSlides)) return true;
    return false;
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
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

  handleClick() {
    const maxSlide = this.props.totalSlides - this.props.visibleSlides;
    const nextSlide = Math.min(
      (this.props.currentSlide + this.props.step),
      maxSlide,
    );
    this.props.store.setState({
      currentSlide: nextSlide,
    });
  }

  render() {
    return (
      <button
        className={cn(['button__next', s.ButtonNext])}
        onClick={this.handleClick}
        disabled={this.state.disabled}
      >{this.props.children}</button>
    );
  }
};

export default ButtonNext;
