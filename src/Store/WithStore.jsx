import React from 'react';
import equal from 'equals';
import deepMerge from 'deepmerge';

export default function WithStore(WrappedComponent, mapStateToProps = () => ({})) {
  class Wrapper extends React.Component {
    static propTypes = {
      children: React.PropTypes.oneOfType([
        React.PropTypes.arrayOf(React.PropTypes.node),
        React.PropTypes.node,
      ]),
    }

    static defaultProps = {
      children: null,
    }

    static contextTypes = {
      store: React.PropTypes.object,
    }

    constructor(props, context) {
      super(props, context);
      this.state = {
        stateProps: mapStateToProps(context.store.getState()),
      };
    }

    componentDidMount() {
      this.context.store.subscribe(() => this.updateStateProps());
    }

    shouldComponentUpdate(nextProps, nextState) {
      return !equal(nextState, this.state) || !equal(nextProps, this.props);
    }

    updateStateProps() {
      this.setState({
        stateProps: mapStateToProps(this.context.store.getState()),
      });
    }

    render() {
      const props = deepMerge(this.state.stateProps, this.props);

      return (
        <WrappedComponent
          {...props}
          store={{
            setState: this.context.store.setState,
            subscribeMasterSpinner: this.context.store.subscribeMasterSpinner,
            masterSpinnerSuccess: this.context.store.masterSpinnerSuccess,
            masterSpinnerError: this.context.store.masterSpinnerError,
          }}
        >{this.props.children}</WrappedComponent>);
    }
  }

  return Wrapper;
}
