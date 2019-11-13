import React from 'react';
import equal from 'equals';
import deepMerge from 'deepmerge';
import { CarouselPropTypes } from '../helpers';
import { CarouselContext } from '../CarouselProvider';

export default function WithStore(
  WrappedComponent,
  /* istanbul ignore next */ mapStateToProps = () => ({}),
) {
  class Wrapper extends React.Component {
    static contextType = CarouselContext

    static propTypes = {
      children: CarouselPropTypes.children,
    };

    static defaultProps = {
      children: null,
    };

    constructor(props, context) {
      super(props, context);
      this.state = mapStateToProps({ ...context.state });
      this.updateStateProps = this.updateStateProps.bind(this);
    }

    componentDidMount() {
      this.context.subscribe(this.updateStateProps);
    }

    shouldComponentUpdate(nextProps, nextState) {
      const test = !equal(nextState, this.state) || !equal(nextProps, this.props);
      return test;
    }

    componentWillUnmount() {
      this.context.unsubscribe(this.updateStateProps);
    }

    updateStateProps() {
      this.setState(mapStateToProps({ ...this.context.state }));
    }

    render() {
      const props = deepMerge(this.state, this.props);

      return (
        <WrappedComponent
          ref={(el) => {
            this.instance = el;
          }} // allows access to refs in wrapped components.
          {...props}
          carouselStore={{
            getStoreState: this.context.getStoreState,
            masterSpinnerError: this.context.masterSpinnerError,
            masterSpinnerSuccess: this.context.masterSpinnerSuccess,
            setStoreState: this.context.setStoreState,
            subscribeMasterSpinner: this.context.subscribeMasterSpinner,
            unsubscribeAllMasterSpinner: this.context.unsubscribeAllMasterSpinner,
            unsubscribeMasterSpinner: this.context.unsubscribeMasterSpinner,
          }}
        >
          {this.props.children}
        </WrappedComponent>
      );
    }
  }

  return Wrapper;
}
