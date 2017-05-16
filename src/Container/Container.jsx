import React from 'react';
import PropTypes from 'prop-types';

const Container = props => <div className="container">{props.children}</div>;

export default Container;

Container.propTypes = {
  children: PropTypes.node,
};

Container.defaultProps = {
  children: null,
};
