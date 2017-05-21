import React from 'react';

export default function WithStore(WrappedComponent, mapStateToProps) {
  class Wrapper extends React.Component {
    static propTypes = {
      children: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.node),
        React.PropTypes.node,
      ]).isRequired,
    }

    static contextTypes = {
      store: React.PropTypes.object,
    }

    componentDidMount() {
      this.context.store.subscribe(() => this.forceUpdate());
    }

    render() {
      const stateProps = mapStateToProps(this.context.store.getState());
      return (
        <WrappedComponent
          {...this.props}
          {...stateProps}
          store={{
            setState: this.context.store.setState
          }}
        >{this.props.children}</WrappedComponent>);
    }
  }

  return Wrapper;
}
