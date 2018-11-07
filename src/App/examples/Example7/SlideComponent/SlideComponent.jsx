import React from 'react';
import PropTypes from 'prop-types';
import s from './SliderComponent.css';


export default class SlideComponent extends React.Component {
  static propTypes = {
    count: PropTypes.number.isRequired,
    setIncrement: PropTypes.func.isRequired,
    setDecrement: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  }

  constructor() {
    super();

    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
  }

  handleIncrement() {
    this.props.setIncrement();
  }

  handleDecrement() {
    this.props.setDecrement();
  }

  render() {
    return (
      <div className={s.container}>
        <div>{this.props.children}</div>
        <div>
          <p>
            Count:
            { this.props.count }
          </p>
          <p>
            <button type="button" onClick={this.handleDecrement}>-1</button>
            <button type="button" onClick={this.handleIncrement}>+1</button>
          </p>
        </div>
      </div>
    );
  }
}
