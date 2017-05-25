import React from 'react';
import PropTypes from 'prop-types';
import { pct, randomHexColor } from '../helpers';
import s from './slide.css';

export default class Slide extends React.PureComponent {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    slideWidth: PropTypes.number,
    style: PropTypes.object,
  }

  static defaultProps = {
    slideWidth: 100,
    style: {},
    children: null,
  }

  render() {
    const style = Object.assign({
      backgroundColor: randomHexColor(),
    }, this.props.style, {
      width: pct(this.props.slideWidth),
    });

    return <div className={s.slide} style={style}>{this.props.children}</div>;
  }
}
