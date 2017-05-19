import React from 'react';
import PropTypes from 'prop-types';

export default function WithStore(WrappedComponent) {
  return class extends React.Component {
    static propTypes = {
      store: PropTypes.shape({
        setState: PropTypes.func,
        state: PropTypes.func,
      }).isRequired,
      children: PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.node),
        React.PropTypes.node,
      ]).isRequired,
    }

    static contextTypes = {
      theme: PropTypes.object,
    }

    constructor(props, context) {
      super(props, context);
      this.props.store = {
        setState: this.context.store.setState,
        state: this.context.store.getState(),
      };
    }

    componentDidMount() {
      this.context.store.subscribe(() => this.forceUpdate());
    }

    render() {
      return <WrappedComponent {...this.props}>{this.props.children}</WrappedComponent>;
    }
  };
}
