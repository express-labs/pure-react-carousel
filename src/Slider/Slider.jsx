import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '../';
import { CarouselPropTypes, cn, pct } from '../helpers';
import s from './slider.css';

const Slider = class Slider extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    hasMasterSpinner: PropTypes.bool.isRequired,
    masterSpinnerErrorCount: PropTypes.number.isRequired,
    masterSpinnerSuccessCount: PropTypes.number.isRequired,
    masterSpinnerSubscriptionCount: PropTypes.number.isRequired,
    naturalSlideHeight: PropTypes.number.isRequired,
    naturalSlideWidth: PropTypes.number.isRequired,
    onMasterSpinner: PropTypes.func,
    orientation: CarouselPropTypes.orientation.isRequired,
    slideTraySize: PropTypes.number.isRequired,
    slideSize: PropTypes.number.isRequired,
    store: PropTypes.object.isRequired,
    style: PropTypes.object,
    totalSlides: PropTypes.number.isRequired,
    touchEnabled: PropTypes.bool.isRequired,
    visibleSlides: PropTypes.number,
  }

  static defaultProps = {
    className: '',
    height: null,
    onMasterSpinner: null,
    style: {},
    visibleSlides: 1,
  }


  constructor() {
    super();
    this.handleOnTouchStart = this.handleOnTouchStart.bind(this);
    this.handleOnTouchMove = this.handleOnTouchMove.bind(this);
    this.handleOnTouchEnd = this.handleOnTouchEnd.bind(this);

    this.state = {
      deltaX: 0,
      deltaY: 0,
      startX: 0,
      startY: 0,
      thresholdPixels: 0,
      isMoving: false,
    };

    this.originalOverflow = null;
  }

  handleOnTouchStart(ev) {
    if (!this.props.touchEnabled) return;

    const touch = ev.targetTouches[0];
    this.originalOverflow = this.originalOverflow || document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    this.setState({
      isMoving: true,
      startX: touch.screenX,
      startY: touch.screenY,
    });
  }

  handleOnTouchMove(ev) {
    if (!this.props.touchEnabled) return;

    const touch = ev.targetTouches[0];
    this.setState({
      deltaX: touch.screenX - this.state.startX,
      deltaY: touch.screenY - this.state.startY,
    });
  }

  computeCurrentSlide() {
    const slideSizeInPx = (
      this.props.orientation === 'horizontal' ?
      this.sliderTrayDiv.clientWidth :
      this.sliderTrayDiv.clientHeight
    ) / this.props.totalSlides;

    const slidesMoved = -Math.round((
      this.props.orientation === 'horizontal' ?
      this.state.deltaX :
      this.state.deltaY
    ) / slideSizeInPx);

    const maxSlide = this.props.totalSlides - Math.min(
      this.props.totalSlides, this.props.visibleSlides,
    );

    let newCurrentSlide = this.props.currentSlide + slidesMoved;
    newCurrentSlide = Math.max(0, newCurrentSlide);
    newCurrentSlide = Math.min(maxSlide, newCurrentSlide);

    this.props.store.setState({
      currentSlide: newCurrentSlide,
    });
  }

  handleOnTouchEnd(ev) {
    if (!this.props.touchEnabled) return;

    this.computeCurrentSlide();

    document.documentElement.style.overflow = this.originalOverflow;
    this.originalOverflow = null;

    if (ev.targetTouches.length === 0) {
      this.setState({
        deltaX: 0,
        deltaY: 0,
        isMoving: false,
      });
    }
  }

  renderMasterSpinner() {
    const {
      hasMasterSpinner, masterSpinnerErrorCount,
      masterSpinnerSuccessCount, masterSpinnerSubscriptionCount,
    } = this.props;

    const testImageCountReached = (
      masterSpinnerErrorCount + masterSpinnerSuccessCount
    ) === masterSpinnerSubscriptionCount;

    const testInitialLoad = masterSpinnerSubscriptionCount === 0;

    if (hasMasterSpinner && (!testImageCountReached || testInitialLoad)) {
      if (typeof this.props.onMasterSpinner === 'function') this.props.onMasterSpinner();

      return (
        <div
          className={cn(['carousel__master-spinner-container', s.masterSpinnerContainer])}
        >
          <Spinner />
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      children, className, currentSlide, hasMasterSpinner, masterSpinnerErrorCount,
      masterSpinnerSubscriptionCount, masterSpinnerSuccessCount, naturalSlideHeight,
      naturalSlideWidth, onMasterSpinner, orientation, slideTraySize, slideSize, store, style,
      totalSlides, touchEnabled, visibleSlides,
      ...props
    } = this.props;

    const sliderStyle = Object.assign({}, style);

    // slider tray wrap
    const trayWrapStyle = {};

    if (orientation === 'vertical') {
      trayWrapStyle.height = 0;
      trayWrapStyle.paddingBottom = pct(
        (naturalSlideHeight * 100 * visibleSlides) / naturalSlideWidth,
      );
      trayWrapStyle.width = pct(100);
    }


    // slider tray
    const trayStyle = {};

    if (this.state.isMoving) {
      trayStyle.transition = 'none';
    }

    if (orientation === 'vertical') {
      trayStyle.transform = `translateY(${pct(slideSize * currentSlide * -1)}) translateY(${this.state.deltaY}px)`;
      trayStyle.width = pct(100);
    } else {
      trayStyle.width = pct(slideTraySize);
      trayStyle.transform = `translateX(${pct(slideSize * currentSlide * -1)}) translateX(${this.state.deltaX}px)`;
    }


    const sliderClasses = cn([
      orientation === 'vertical' ? s.verticalSlider : s.horizontalSlider,
      'carousel__slide-tray',
      orientation === 'vertical' ? 'carousel__slide-tray--vertical' : 'carousel__slide-tray--horizontal',
      className,
    ]);

    const trayClasses = cn([
      s.sliderTray,
      'carousel__slide-tray',
      orientation === 'vertical' ? s.verticalTray : s.horizontalTray,
      orientation === 'vertical' ? 'carousel__slide-tray--vertical' : 'carousel__slide-tray--horizontal',
    ]);

    const trayWrapClasses = cn([
      s.sliderTrayWrap,
      'carousel__slide-tray-wrapper',
      orientation === 'vertical' ? s.verticalSlideTrayWrap : s.horizontalTrayWrap,
      orientation === 'vertical' ? 'carousel__slide-tray-wrap--vertical' : 'carousel__slide-tray-wrap--horizontal',
    ]);

    return (
      <div
        className={sliderClasses}
        aria-live="polite"
        style={sliderStyle}
        {...props}
      >
        <div className={trayWrapClasses} style={trayWrapStyle}>
          <div
            ref={(el) => { this.sliderTrayDiv = el; }}
            className={trayClasses}
            style={trayStyle}
            onTouchStart={this.handleOnTouchStart}
            onTouchMove={this.handleOnTouchMove}
            onTouchEnd={this.handleOnTouchEnd}
          >
            {children}
          </div>
          {this.renderMasterSpinner()}
        </div>
      </div>
    );
  }
};

export default Slider;
