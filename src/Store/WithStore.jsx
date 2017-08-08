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
      this.state = mapStateToProps(context.store.state);
      this.updateStateProps = this.updateStateProps.bind(this);
    }

    componentWillMount() {
      this.context.store.subscribe(this.updateStateProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
      const test = !equal(nextState, this.state) || !equal(nextProps, this.props);
      return test;
    }

    componentWillUnmount() {
      this.context.store.unsubscribe(this.updateStateProps);
    }

    updateStateProps() {
      this.setState(mapStateToProps(this.context.store.state));
    }

    render() {
      const props = deepMerge(this.state, this.props);

      return (
        <WrappedComponent
          ref={(el) => { this.instance = el; }} // allows access to refs in wrapped components.
          {...props}
          store={{
            masterSpinnerError: this.context.store.masterSpinnerError,
            masterSpinnerSuccess: this.context.store.masterSpinnerSuccess,
            setStoreState: this.context.store.setStoreState,
            subscribeMasterSpinner: this.context.store.subscribeMasterSpinner,
            unsubscribeMasterSpinner: this.context.store.unsubscribeMasterSpinner,
          }}
        >{this.props.children}</WrappedComponent>);
    }
  }

  return Wrapper;
}
