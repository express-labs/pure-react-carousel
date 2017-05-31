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
    currentSlide: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    slideWidth: PropTypes.number.isRequired,
    store: PropTypes.object,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    tag: PropTypes.string,
    visibleSlides: PropTypes.number.isRequired,
  }

  static defaultProps = {
    children: null,
    className: null,
    store: null,
    style: {},
    tabIndex: null,
    tag: 'div',
  }

  constructor() {
    super();
    this.handleOnFocus = this.handleOnFocus.bind(this);
    this.handleOnBlur = this.handleOnBlur.bind(this);
    this.state = {
      focused: false,
    };
  }

  isVisible() {
    const { currentSlide, index, visibleSlides } = this.props;
    return index >= currentSlide && index < currentSlide + visibleSlides;
  }

  handleOnFocus() {
    this.setState({
      focused: true,
    });
  }

  handleOnBlur() {
    this.setState({
      focused: false,
    });
  }

  renderFocusRing() {
    if (this.state.focused) return <div className={s.focusRing} />;
    return null;
  }

  render() {
    const {
      children, className, currentSlide, index, slideWidth, store, style, tabIndex, tag: Tag,
      visibleSlides, ...props
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

    const defaultTabIndex = this.isVisible() ? 0 : -1;
    const newTabIndex = typeof tabIndex === 'boolean' ? tabIndex : defaultTabIndex;

    return (
      <Tag
        tabIndex={newTabIndex}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
        className={newClassName}
        style={newStyle}
        {...props}
      >{this.props.children}{this.renderFocusRing()}</Tag>
    );
  }
};

export default Slide;
