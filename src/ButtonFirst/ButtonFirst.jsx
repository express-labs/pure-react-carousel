import React from 'react';
import PropTypes from 'prop-types';
import s from './ButtonFirst.css';
import { cn } from '../helpers';

const ButtonFirst = class ButtonFirst extends React.Component {
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
    const { store, onClick } = this.props;
    store.setState({
      currentSlide: 0,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      className, currentSlide, disabled, onClick, store, totalSlides, ...props
    } = this.props;

    const newClassName = cn([
      s.buttonFirst,
      'carousel__first-button',
      className,
    ]);

    const newDisabled = disabled !== null ? disabled : currentSlide === 0;

    return (
      <button
        aria-label="first"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={newDisabled}
        {...props}
      >{this.props.children}</button>
    );
  }
};

export default ButtonFirst;
