import React from 'react';
import PropTypes from 'prop-types';
import { cn, pct } from '../helpers';
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
    orientation: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
    slideTrayWidth: PropTypes.number.isRequired,
    slideSize: PropTypes.number.isRequired,
    store: PropTypes.object.isRequired,
    style: PropTypes.object,
    totalSlides: PropTypes.number.isRequired,
    touchEnabled: PropTypes.bool.isRequired,
    visibleSlides: PropTypes.number,
  }

  static defaultProps = {
    className: '',
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
      touching: false,
    };
  }

  handleOnTouchStart(ev) {
    const touch = ev.targetTouches[0];
    this.setState({
      touching: true,
      startX: touch.screenX,
      startY: touch.screenY,
    });
  }

  handleOnTouchMove(ev) {
    const touch = ev.targetTouches[0];
    this.setState({
      touching: true,
      deltaX: touch.screenX - this.state.startX,
      deltaY: touch.screenY - this.state.startY,
    });
  }

  handleOnTouchEnd(ev) {
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

    if (ev.targetTouches.length === 0) {
      this.setState({
        deltaX: 0,
        deltaY: 0,
        touching: false,
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
      return (
        <div
          className={cn(['carousel__master-spinner-container', s.masterSpinnerContainer])}
        >
          <div className={cn(['carousel__master-spinner', s.masterSpinner])} />
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      children, className, currentSlide, hasMasterSpinner, masterSpinnerErrorCount,
      masterSpinnerSubscriptionCount, masterSpinnerSuccessCount, orientation, slideTrayWidth,
      slideSize, store, totalSlides, touchEnabled, visibleSlides,
      ...props
    } = this.props;

    const style = {
      width: pct(slideTrayWidth),
    };

    if (this.state.touching) {
      style.transition = 'none';
    }

    if (orientation === 'vertical') {
      style.transform = `translateY(${pct(slideSize * currentSlide * -1)}) translateY(${this.state.deltaY}px)`;
    } else {
      style.transform = `translateX(${pct(slideSize * currentSlide * -1)}) translateX(${this.state.deltaX}px)`;
    }

    const sliderClasses = cn([
      s.slider,
      'carousel__slide-show',
      className,
    ]);

    const trayClasses = cn([
      s.sliderTray,
      'carousel__slide-tray',
    ]);

    return (
      <div className={sliderClasses} aria-live="polite" {...props}>
        <div
          ref={(el) => { this.sliderTrayDiv = el; }}
          className={trayClasses}
          style={style}
          onTouchStart={this.handleOnTouchStart}
          onTouchMove={this.handleOnTouchMove}
          onTouchEnd={this.handleOnTouchEnd}
        >
          {children}
        </div>
        {this.renderMasterSpinner()}
      </div>
    );
  }
};

export default Slider;
