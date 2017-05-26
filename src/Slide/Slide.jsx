import React from 'react';
import PropTypes from 'prop-types';
import { cn, pct, randomHexColor } from '../helpers';
import s from './slide.css';

const Slide = class Slide extends React.PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    className: PropTypes.string,
    slideWidth: PropTypes.number,
    style: PropTypes.object,
    store: PropTypes.object,
    tag: PropTypes.string,
  }

  static defaultProps = {
    children: null,
    className: null,
    slideWidth: 100,
    style: {},
    store: null,
    tag: 'div',
  }

  render() {
    const {
      children, className, slideWidth, store, style, tag: Tag, ...props
    } = this.props;

    const newStyle = Object.assign({
      backgroundColor: randomHexColor(),
      width: pct(this.props.slideWidth),
    }, style);

    const newClassName = cn([
      s.slide,
      'carousel__slide',
      className,
    ]);

    return <Tag className={newClassName} style={newStyle} {...props}>{this.props.children}</Tag>;
  }
};

export default Slide;
