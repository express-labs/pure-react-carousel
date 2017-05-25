import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../helpers';
import s from './ButtonBack.css';

const ButtonBack = class ButtonBack extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    store: PropTypes.object.isRequired,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
  };

  static defaultProps = {
    disabled: null,
  }

  static setDisabled(disabled, currentSlide) {
    if (disabled !== null) return disabled;
    if (currentSlide === 0) return true;
    return false;
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      disabled: ButtonBack.setDisabled(props.disabled, props.currentSlide),
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      disabled: ButtonBack.setDisabled(nextProps.disabled, nextProps.currentSlide),
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
        className={cn(['button__back', s.ButtonBack])}
        onClick={this.handleClick}
        disabled={this.state.disabled}
      >{this.props.children}</button>
    );
  }
};

export default ButtonBack;
