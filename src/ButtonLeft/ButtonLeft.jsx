import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../helpers';
import s from './ButtonLeft.css';

export default class extends React.Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    
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
