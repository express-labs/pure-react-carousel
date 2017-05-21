import React from 'react';
import PropTypes from 'prop-types';

export default class Button extends React.Component {
  static propTypes = {
    store: PropTypes.object.shape({ setState: PropTypes.func }).isRequired,
  }
  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
    this.counter = 1;
  }

  onClick() {
    this.counter += 1;
    this.props.store.setState({ demo: `Hello ${this.counter}` });
  }

  render() {
    return (
      <button onClick={this.onClick}>Click Me!! {this.props.demo}</button>
    );
  }
}
