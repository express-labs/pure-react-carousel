import React from 'react';
import equal from 'equals';
import deepMerge from 'deepmerge';
import propTypes from 'prop-types';
import { CarouselPropTypes } from '../helpers';

export default function WithStore(
  WrappedComponent,
  /* istanbul ignore next */ mapStateToProps = () => ({}),
) {
  class Wrapper extends React.Component {
    static propTypes = {
      children: CarouselPropTypes.children,
    }

    static defaultProps = {
      children: null,
    }

    static contextTypes = {
      store: propTypes.object,
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
