import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn } from '../helpers';
import s from './Dot.css';

const Dot = class Dot extends React.Component {
  static propTypes = {
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
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
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(ev) {
    const { slide, store, onClick } = this.props;
    store.setState({
      currentSlide: slide,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const { children, className, onClick, slide, store, ...props } = this.props;

    const newClassName = cn([
      s.dot,
      this.props.selected && s.dotSelected,
      'carousel__dot',
      `carousel__dot--${slide}`,
      this.props.selected && 'carousel__dot--selected',
      className,
    ]);

    return (
      <button
        onClick={this.handleOnClick}
        className={newClassName}
        {...props}
      >{this.props.children}</button>
    );
  }
};

export default Dot;
