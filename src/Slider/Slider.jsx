import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../helpers';

const Slider = class Slider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
  }

  render() {
    return (
      <div className={cn(['slider'])}>
        <div className={cn['slider--inner']}>
          {this.props.children}
        </div>
      </div>
    );
  }
};

export default Slider;
