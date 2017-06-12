import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn, pct } from '../helpers';
import s from './slide.css';

const Slide = class Slide extends React.PureComponent {
  static propTypes = {
    children: CarouselPropTypes.children,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    innerClassName: PropTypes.string,
    innerTag: PropTypes.string,
    naturalSlideHeight: PropTypes.number.isRequired,
    naturalSlideWidth: PropTypes.number.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    orientation: CarouselPropTypes.orientation.isRequired,
    slideSize: PropTypes.number.isRequired,
    store: PropTypes.object,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    tag: PropTypes.string,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  }

  static defaultProps = {
    children: null,
    className: null,
    innerClassName: null,
    innerTag: 'div',
    onBlur: null,
    onFocus: null,
    store: null,
    style: {},
    tabIndex: null,
    tag: 'li',
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

  handleOnFocus(ev) {
    const { onFocus } = this.props;
    this.setState({
      focused: true,
    }, onFocus !== null && onFocus.call(this, ev));
  }

  handleOnBlur(ev) {
    const { onBlur } = this.props;
    this.setState({
      focused: false,
    }, onBlur !== null && onBlur.call(this, ev));
  }

  renderFocusRing() {
    if (this.state.focused) return <div className={s.focusRing} />;
    return null;
  }

  render() {
    const {
      children, className, currentSlide, index, innerClassName, innerTag: InnerTag,
      naturalSlideHeight, naturalSlideWidth, onBlur, onFocus, orientation, slideSize, store, style,
      tabIndex, tag: Tag, totalSlides, visibleSlides,
      ...props
    } = this.props;

    const tempStyle = {};

    if (orientation === 'horizontal') {
      tempStyle.width = pct(slideSize);
      tempStyle.paddingBottom = pct((naturalSlideHeight * 100) / (naturalSlideWidth * totalSlides));
    } else {
      tempStyle.width = pct(100);
      tempStyle.paddingBottom = pct((naturalSlideHeight * 100) / naturalSlideWidth);
    }

    const newStyle = Object.assign({}, tempStyle, style);

    const newClassName = cn([
      s.slide,
      orientation === 'horizontal' && s.slideHorizontal,
      'carousel__slide',
      className,
    ]);

    const newInnerClassName = cn([
      s.slideInner,
      'carousel__inner-slide',
      innerClassName,
    ]);

    const defaultTabIndex = this.isVisible() ? 0 : -1;
    const newTabIndex = typeof tabIndex === 'number' ? tabIndex : defaultTabIndex;

    return (
      <Tag
        tabIndex={newTabIndex}
        aria-hidden={!this.isVisible()}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
        className={newClassName}
        style={newStyle}
        {...props}
      >
        <InnerTag className={newInnerClassName}>
          {this.props.children}
          {this.renderFocusRing()}
        </InnerTag>
      </Tag>
    );
  }
};

export default Slide;
