import React from 'react';
import PropTypes from 'prop-types';
import { Store } from '../';

export default class CarouselProvider extends React.Component {
  static propTypes = {
    // TODO:  Before release, see if I can lock this down to a specific object shape
    // eslint-disable-next-line react/forbid-prop-types
    initialState: PropTypes.object,
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
  }

  static defaultProps = {
    initialState: {},
  }

  static childContextTypes = {
    store: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context);
    this.store = new Store(props.initialState);
  }

  getChildContext() {
    return { store: this.store };
  }

  render() {
    return <div className="carousel">{this.props.children}</div>;
  }
}
