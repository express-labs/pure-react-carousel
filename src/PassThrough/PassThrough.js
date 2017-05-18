/* eslint-disable no-console */
// SEE https://github.com/unicorn-standard/react-passthrough/blob/master/src/passthrough.js
import React from 'react';

export default function PassThrough(WrappedComponent) {
  return class extends React.Component {
    componentWillReceiveProps(nextProps) {
      console.log('Current props: ', this.props);
      console.log('Next props: ', nextProps);
    }
    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
