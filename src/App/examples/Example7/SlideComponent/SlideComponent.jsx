import React from 'react';
import PropTypes from 'prop-types';


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

    ['handleIncrement', 'handleDecrement'].forEach((func) => {
      this[func].bind(this);
    });
  }

  handleIncrement() {
    this.props.setIncrement();
  }

  handleDecrement() {
    this.props.setDecrement();
  }

  render() {
    return (
      <div>
        <div>{this.props.children}</div>
        <div>
          <p>Count: { this.props.count }</p>
          <p>
            <button onClick={this.handleDecrement}>-1</button>
            <button onClick={this.handleIncrement}>+1</button>
          </p>
        </div>
      </div>
    );
  }
}
