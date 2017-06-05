import React from 'react';
import PropTypes from 'prop-types';
import s from './ButtonLast.css';
import { cn } from '../helpers';

const ButtonLast = class ButtonLast extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    store: PropTypes.object.isRequired,
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
    const { store, onClick, totalSlides, visibleSlides } = this.props;
    store.setState({
      currentSlide: totalSlides - visibleSlides,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      className, currentSlide, disabled, onClick, store, totalSlides, visibleSlides, ...props
    } = this.props;

    const newClassName = cn([
      s.buttonFirst,
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
