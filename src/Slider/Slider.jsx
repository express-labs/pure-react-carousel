import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from '../';
import { CarouselPropTypes, cn, pct } from '../helpers';
import s from './slider.css';

const Slider = class Slider extends React.Component {
  static propTypes = {
    carouselStore: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disableAnimation: PropTypes.bool,
    hasMasterSpinner: PropTypes.bool.isRequired,
    lockOnWindowScroll: PropTypes.bool.isRequired,
    masterSpinnerFinished: PropTypes.bool.isRequired,
    naturalSlideHeight: PropTypes.number.isRequired,
    naturalSlideWidth: PropTypes.number.isRequired,
    onMasterSpinner: PropTypes.func,
    orientation: CarouselPropTypes.orientation.isRequired,
    slideSize: PropTypes.number.isRequired,
    slideTraySize: PropTypes.number.isRequired,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    totalSlides: PropTypes.number.isRequired,
    touchEnabled: PropTypes.bool.isRequired,
    trayTag: PropTypes.string,
    visibleSlides: PropTypes.number,
  }

  static defaultProps = {
    className: '',
    disableAnimation: false,
    height: null,
    onMasterSpinner: null,
    style: {},
    tabIndex: null,
    trayTag: 'ul',
    visibleSlides: 1,
  }

  static slideSizeInPx(orientation, sliderTrayWidth, sliderTrayHeight, totalSlides) {
    return (orientation === 'horizontal' ? sliderTrayWidth : sliderTrayHeight) / totalSlides;
  }

  static slidesMoved(orientation, deltaX, deltaY, slideSizeInPx) {
    const threshold = 0.1;
    const bigDrag = Math.abs(Math.round((orientation === 'horizontal' ? deltaX : deltaY) / slideSizeInPx));
    const smallDrag = (Math.abs(orientation === 'horizontal' ? deltaX : deltaY) >= (slideSizeInPx * threshold)) ? 1 : 0;
    if ((orientation === 'horizontal' ? deltaX : deltaY) < 0) {
      return Math.max(smallDrag, bigDrag);
    }
    return -Math.max(bigDrag, smallDrag);
  }

  constructor() {
    super();
    this.handleDocumentScroll = this.handleDocumentScroll.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleOnTouchCancel = this.handleOnTouchCancel.bind(this);
    this.handleOnTouchEnd = this.handleOnTouchEnd.bind(this);
    this.handleOnTouchMove = this.handleOnTouchMove.bind(this);
    this.handleOnTouchStart = this.handleOnTouchStart.bind(this);

    this.state = {
      deltaX: 0,
      deltaY: 0,
      startX: 0,
      startY: 0,
      isDocumentScrolling: null,
      isBeingTouchDragged: false,
    };

    this.originalOverflow = null;
    this.moveTimer = null;
    this.isDocumentScrolling = null;
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleDocumentScroll);
  }


  componentWillUnmount() {
    document.documentElement.removeEventListener('scroll', this.handleDocumentScroll);
    window.cancelAnimationFrame.call(window, this.moveTimer);
    this.moveTimer = null;
    this.isDocumentScrolling = null;
  }

  handleDocumentScroll() {
    if (!this.props.touchEnabled) return;
    this.isDocumentScrolling = true;
  }

  handleOnTouchStart(ev) {
    if (!this.props.touchEnabled) return;

    window.cancelAnimationFrame.call(window, this.moveTimer);

    const touch = ev.targetTouches[0];
    if (this.props.orientation === 'vertical') {
      this.originalOverflow = this.originalOverflow || document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      ev.preventDefault();
      ev.stopPropagation();
    }
    this.setState({
      isBeingTouchDragged: true,
      startX: touch.screenX,
      startY: touch.screenY,
    });
  }

  handleOnTouchMove(ev) {
    if (
      !this.props.touchEnabled ||
      (this.props.lockOnWindowScroll && this.isDocumentScrolling)
    ) return;

    window.cancelAnimationFrame.call(window, this.moveTimer);

    const touch = ev.targetTouches[0];
    this.moveTimer = window.requestAnimationFrame.call(window, () => {
      this.setState({
        deltaX: touch.screenX - this.state.startX,
        deltaY: touch.screenY - this.state.startY,
      });
    });
  }

  handleOnKeyDown(ev) {
    const { keyCode } = ev;
    const { carouselStore, currentSlide, totalSlides, visibleSlides } = this.props;
    const newStoreState = {};
    let isUpdated = false;

    if (totalSlides <= visibleSlides) return;

    // left arrow
    if (keyCode === 37) {
      ev.preventDefault();
      ev.stopPropagation();
      this.focus();
      if (currentSlide > 0) {
        newStoreState.currentSlide = currentSlide - 1;
        isUpdated = true;
      }
    }

    // right arrow
    if (keyCode === 39) {
      ev.preventDefault();
      ev.stopPropagation();
      this.focus();
      if (currentSlide < (totalSlides - visibleSlides)) {
        newStoreState.currentSlide = currentSlide + 1;
        isUpdated = true;
      }
    }

    if (isUpdated && typeof newStoreState.currentSlide === 'number') {
      carouselStore.setStoreState(newStoreState);
    }
  }

  computeCurrentSlide() {
    const slideSizeInPx = Slider.slideSizeInPx(
      this.props.orientation,
      this.sliderTrayElement.clientWidth,
      this.sliderTrayElement.clientHeight,
      this.props.totalSlides,
    );

    const slidesMoved = Slider.slidesMoved(
      this.props.orientation,
      this.state.deltaX,
      this.state.deltaY,
      slideSizeInPx,
    );

    const maxSlide = this.props.totalSlides - Math.min(
      this.props.totalSlides, this.props.visibleSlides,
    );

    let newCurrentSlide = this.props.currentSlide + slidesMoved;
    newCurrentSlide = Math.max(0, newCurrentSlide);
    newCurrentSlide = Math.min(maxSlide, newCurrentSlide);

    this.props.carouselStore.setStoreState({
      currentSlide: newCurrentSlide,
    });
  }

  focus() {
    this.sliderElement.focus();
  }

  handleOnTouchEnd() {
    this.endTouchMove();
  }

  handleOnTouchCancel() {
    this.endTouchMove();
  }

  endTouchMove() {
    if (!this.props.touchEnabled) return;

    window.cancelAnimationFrame.call(window, this.moveTimer);

    this.computeCurrentSlide();
    if (this.props.orientation === 'vertical') {
      document.documentElement.style.overflow = this.originalOverflow;
      this.originalOverflow = null;
    }

    this.setState({
      deltaX: 0,
      deltaY: 0,
      isBeingTouchDragged: false,
    });

    this.isDocumentScrolling = this.props.lockOnWindowScroll ? false : null;
  }

  renderMasterSpinner() {
    const { hasMasterSpinner, masterSpinnerFinished } = this.props;

    if (hasMasterSpinner && (!masterSpinnerFinished)) {
      if (typeof this.props.onMasterSpinner === 'function') this.props.onMasterSpinner();

      return (
        <div
          className={cn([
            s.masterSpinnerContainer,
            'carousel__master-spinner-container',
          ])}
        >
          <Spinner />
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      carouselStore, children, className, currentSlide, disableAnimation, hasMasterSpinner,
      lockOnWindowScroll, masterSpinnerFinished, naturalSlideHeight, naturalSlideWidth,
      onMasterSpinner, orientation, slideSize, slideTraySize, style, tabIndex, totalSlides,
      touchEnabled, trayTag: TrayTag, visibleSlides,
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
    const trans = pct(slideSize * currentSlide * -1);

    if (this.state.isBeingTouchDragged || disableAnimation) {
      trayStyle.transition = 'none';
    }

    if (orientation === 'vertical') {
      trayStyle.transform = `translateY(${trans}) translateY(${this.state.deltaY}px)`;
      trayStyle.width = pct(100);
    } else {
      trayStyle.width = pct(slideTraySize);
      trayStyle.transform = `translateX(${trans}) translateX(${this.state.deltaX}px)`;
    }

    const sliderClasses = cn([
      orientation === 'vertical' ? s.verticalSlider : s.horizontalSlider,
      'carousel__slider',
      orientation === 'vertical' ? 'carousel__slider--vertical' : 'carousel__slider--horizontal',
      className,
    ]);

    const trayWrapClasses = cn([
      s.sliderTrayWrap,
      'carousel__slider-tray-wrapper',
      orientation === 'vertical' ? s.verticalSlideTrayWrap : s.horizontalTrayWrap,
      orientation === 'vertical' ? 'carousel__slider-tray-wrap--vertical' : 'carousel__slider-tray-wrap--horizontal',
    ]);

    const trayClasses = cn([
      s.sliderTray,
      'carousel__slider-tray',
      orientation === 'vertical' ? s.verticalTray : s.horizontalTray,
      orientation === 'vertical' ? 'carousel__slider-tray--vertical' : 'carousel__slider-tray--horizontal',
    ]);

    const newTabIndex = tabIndex !== null ? tabIndex : 0;

    // console.log(Object.assign({}, trayStyle), new Date());

    return (
      <div
        ref={(el) => { this.sliderElement = el; }}
        className={sliderClasses}
        aria-live="polite"
        style={sliderStyle}
        tabIndex={newTabIndex}
        onKeyDown={this.handleOnKeyDown}
        role="listbox"
        {...props}
      >
        <div className={trayWrapClasses} style={trayWrapStyle}>
          <TrayTag
            ref={(el) => { this.sliderTrayElement = el; }}
            className={trayClasses}
            style={trayStyle}
            onTouchStart={this.handleOnTouchStart}
            onTouchMove={this.handleOnTouchMove}
            onTouchEnd={this.handleOnTouchEnd}
            onTouchCancel={this.handleOnTouchCancel}
          >
            {children}
          </TrayTag>
          {this.renderMasterSpinner()}
        </div>
      </div>
    );
  }
};

export default Slider;
