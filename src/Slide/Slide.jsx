import React from 'react';
import PropTypes from 'prop-types';
import { computeSlideWidthPercent, randomHexColor } from '../helpers';
import s from './styles.css';

export default class Slide extends React.PureComponent {
  static propTypes = {
    visibleSlides: PropTypes.number,
    totalSlides: PropTypes.number,
    style: PropTypes.object,
  }

  static defaultProps = {
    visibleSlides: 1,
    totalSlides: 0,
    style: {},
  }

  render() {
    const style = Object.assign({
      backgroundColor: randomHexColor(),
    }, this.props.style, {
      width: computeSlideWidthPercent(this.props.totalSlides, this.props.visibleSlides),
    });

    return <div className={s.slide} style={style} />;
  }
}
