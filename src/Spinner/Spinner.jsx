import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../helpers';
import s from './Spinner.scss';

const Spinner = class Spinner extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: null,
  }

  render() {
    const { className, ...filteredProps } = this.props;
    const newClassName = cn([s.spinner, 'carousel__spinner', className]);
    return (
      <div className={newClassName} {...filteredProps} />
    );
  }
};

export default Spinner;
