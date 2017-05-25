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
    store: PropTypes.object.isRequired,
    currentSlide: PropTypes.number.isRequired,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
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
    this.props.store.setState({
      currentSlide: this.props.currentSlide + 1,
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
