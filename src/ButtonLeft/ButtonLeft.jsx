import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../helpers';
import s from './ButtonLeft.css';

export default class extends React.Component {
  static propTypes = {
    store: PropTypes.object.isRequired,
    currentSlide: PropTypes.number.isRequired,
  };

  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.store.setState({
      currentSlide: this.props.currentSlide - 1,
    });
  }

  render() {
    return (
      <button
        className={cn(['button__left', s.buttonLeft])}
        onClick={this.handleClick}
      >left</button>
    );
  }
}
