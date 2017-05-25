import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../helpers';
import s from './Dot.css';

const Dot = class Dot extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    selected: PropTypes.bool,
    onClick: PropTypes.func,
    slide: PropTypes.number.isRequired,
    store: PropTypes.object.isRequired,
  }

  static defaultProps = {
    className: null,
    disabled: false,
    onClick: null,
    selected: false,
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const { slide, store, onClick } = this.props;
    store.setState({
      currentSlide: slide,
    }, typeof onClick === 'function' && onClick(slide));
  }

  render() {
    const { children, className, onClick, slide, store, ...props } = this.props;
    const cssClasses = cn([
      s.dot,
      this.props.selected && s.dotSelected,
      'carousel__dot',
      `carousel__dot--${slide}`,
      this.props.selected && 'carousel__dot--selected',
      className,
    ]);

    return (
      <button
        onClick={this.handleClick}
        className={cssClasses}
        {...props}
      >{this.props.children}</button>
    );
  }
};

export default Dot;
