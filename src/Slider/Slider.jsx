import React from 'react';
import PropTypes from 'prop-types';
import Spinner from '../Spinner';
import GetScrollParent from './GetScrollParent';
import {
  CarouselPropTypes, cn, pct, boundedRange,
} from '../helpers';
import s from './Slider.scss';

const Slider = class Slider extends React.Component {
  static propTypes = {
    ariaLabel: PropTypes.string,
    carouselStore: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    classNameAnimation: PropTypes.string,
    classNameTray: PropTypes.string,
    classNameTrayWrap: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disableAnimation: PropTypes.bool,
    disableKeyboard: PropTypes.bool,
    dragEnabled: PropTypes.bool.isRequired,
    dragStep: PropTypes.number,
    hasMasterSpinner: PropTypes.bool.isRequired,
    infinite: PropTypes.bool,
    interval: PropTypes.number.isRequired,
    isPageScrollLocked: PropTypes.bool.isRequired,
    isPlaying: PropTypes.bool.isRequired,
    lockOnWindowScroll: PropTypes.bool.isRequired,
    masterSpinnerFinished: PropTypes.bool.isRequired,
    moveThreshold: PropTypes.number,
    /* eslint-disable react/require-default-props */
    naturalSlideHeight: CarouselPropTypes.slideSize,
    naturalSlideWidth: CarouselPropTypes.slideSize,
    /* eslint-enable react/require-default-props */
    onMasterSpinner: PropTypes.func,
    orientation: CarouselPropTypes.orientation.isRequired,
    playDirection: CarouselPropTypes.direction.isRequired,
    privateUnDisableAnimation: PropTypes.bool,
    slideSize: PropTypes.number.isRequired,
    slideTraySize: PropTypes.number.isRequired,
    spinner: PropTypes.func,
    step: PropTypes.number.isRequired,
    style: PropTypes.object,
    tabIndex: PropTypes.number,
    totalSlides: PropTypes.number.isRequired,
    touchEnabled: PropTypes.bool.isRequired,
    trayProps: PropTypes.shape({
      className: PropTypes.string,
      onClickCapture: PropTypes.func,
      onMouseDown: PropTypes.func,
      onTouchCancel: PropTypes.func,
      onTouchEnd: PropTypes.func,
      onTouchMove: PropTypes.func,
      onTouchStart: PropTypes.func,
      ref: PropTypes.shape({}),
      style: PropTypes.string,
    }),
    trayTag: PropTypes.string,
    visibleSlides: PropTypes.number,
    isIntrinsicHeight: PropTypes.bool,
  }

  static defaultProps = {
    ariaLabel: 'slider',
    className: null,
    classNameAnimation: null,
    classNameTray: null,
    classNameTrayWrap: null,
    disableAnimation: false,
    disableKeyboard: false,
    dragStep: 1,
    infinite: false,
    moveThreshold: 0.1,
    onMasterSpinner: null,
    privateUnDisableAnimation: false,
    spinner: null,
    style: {},
    tabIndex: null,
    trayProps: {},
    trayTag: 'div',
    visibleSlides: 1,
    isIntrinsicHeight: false,
  }

  static slideSizeInPx(orientation, sliderTrayWidth, sliderTrayHeight, totalSlides) {
    return (orientation === 'horizontal' ? sliderTrayWidth : sliderTrayHeight) / totalSlides;
  }

  static slidesMoved(threshold, orientation, deltaX, deltaY, slideSizeInPx, dragStep) {
    const delta = orientation === 'horizontal' ? deltaX : deltaY;
    const bigDrag = Math.abs(Math.round(delta / slideSizeInPx));
    const smallDrag = (Math.abs(delta) >= (slideSizeInPx * threshold)) ? dragStep : 0;
    const moved = Math.max(smallDrag, bigDrag);
    if (delta < 0) {
      return moved;
    }
    const retval = -moved;
    return retval === 0 ? 0 : retval; // get rid of -0
  }

  constructor(props) {
    super(props);

    this.getSliderRef = this.getSliderRef.bind(this);
    this.handleDocumentScroll = this.handleDocumentScroll.bind(this);
    this.handleOnClickCapture = this.handleOnClickCapture.bind(this);
    this.handleOnKeyDown = this.handleOnKeyDown.bind(this);
    this.handleOnMouseDown = this.handleOnMouseDown.bind(this);
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
    this.handleOnMouseUp = this.handleOnMouseUp.bind(this);
    this.handleOnTouchCancel = this.handleOnTouchCancel.bind(this);
    this.handleOnTouchEnd = this.handleOnTouchEnd.bind(this);
    this.handleOnTouchMove = this.handleOnTouchMove.bind(this);
    this.handleOnTouchStart = this.handleOnTouchStart.bind(this);
    this.playBackward = this.playBackward.bind(this);
    this.playForward = this.playForward.bind(this);
    this.callCallback = this.callCallback.bind(this);

    this.state = {
      cancelNextClick: false,
      deltaX: 0,
      deltaY: 0,
      isBeingMouseDragged: false,
      isBeingTouchDragged: false,
      startX: 0,
      startY: 0,
    };

    this.interval = null;
    this.isDocumentScrolling = null;
    this.moveTimer = null;
    this.originalOverflow = null;
    this.scrollParent = null;
    this.scrollStopTimer = null;
  }

  componentDidMount() {
    if (this.props.lockOnWindowScroll) {
      window.addEventListener('scroll', this.handleDocumentScroll, false);
    }
    document.documentElement.addEventListener('mouseleave', this.handleOnMouseUp, false);
    document.documentElement.addEventListener('mousemove', this.handleOnMouseMove, false);
    document.documentElement.addEventListener('mouseup', this.handleOnMouseUp, false);

    if (this.props.isPlaying) this.play();
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isPlaying && this.props.isPlaying) this.play();
    if (prevProps.isPlaying && !this.props.isPlaying) this.stop();
    if (!prevProps.isPageScrollLocked && this.props.isPageScrollLocked) this.lockScroll();
    if (prevProps.isPageScrollLocked && !this.props.isPageScrollLocked) this.unlockScroll();
    // Re-enable the css animation after currentSlide prop is changed in CarouselProvider
    if (
      prevProps.privateUnDisableAnimation === false
      && this.props.privateUnDisableAnimation === true
    ) {
      this.props.carouselStore.setStoreState({
        privateUnDisableAnimation: false,
        disableAnimation: false,
      });
    }
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('mouseleave', this.handleOnMouseUp, false);
    document.documentElement.removeEventListener('mousemove', this.handleOnMouseMove, false);
    document.documentElement.removeEventListener('mouseup', this.handleOnMouseUp, false);
    window.removeEventListener('scroll', this.handleDocumentScroll, false);

    this.stop();
    window.cancelAnimationFrame.call(window, this.moveTimer);
    window.clearTimeout(this.scrollStopTimer);

    this.isDocumentScrolling = null;
    this.moveTimer = null;
    this.scrollStopTimer = null;
  }

  // NOTE: These are the order of touch and mouse events
  // https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
  //
  // 1) touchstart
  // 2) Zero or more touchmove events, depending on movement of the finger(s)
  // 3) touchend
  // 4) mousemove
  // 5) mousedown
  // 6) mouseup
  // 7) click

  getSliderRef(el) {
    this.sliderTrayElement = el;
  }


  fakeOnDragStart({
    screenX,
    screenY,
    touchDrag = false,
    mouseDrag = false,
  }) {
    this.props.carouselStore.setStoreState({
      isPlaying: false,
    });

    window.cancelAnimationFrame.call(window, this.moveTimer);

    if (this.props.orientation === 'vertical') {
      this.props.carouselStore.setStoreState({
        isPageScrollLocked: true,
      });
    }

    this.setState({
      isBeingTouchDragged: touchDrag,
      isBeingMouseDragged: mouseDrag,
      startX: screenX,
      startY: screenY,
    });
  }

  fakeOnDragMove(screenX, screenY) {
    this.moveTimer = window.requestAnimationFrame.call(window, () => {
      this.setState(state => ({
        deltaX: screenX - state.startX,
        deltaY: screenY - state.startY,
      }));
    });
  }

  fakeOnDragEnd() {
    window.cancelAnimationFrame.call(window, this.moveTimer);

    this.computeCurrentSlide();

    if (this.props.orientation === 'vertical') {
      this.props.carouselStore.setStoreState({
        isPageScrollLocked: false,
      });
    }

    this.setState({
      deltaX: 0,
      deltaY: 0,
      isBeingTouchDragged: false,
      isBeingMouseDragged: false,
    });

    this.isDocumentScrolling = this.props.lockOnWindowScroll ? false : null;
  }

  callCallback(propName, ev) {
    const { trayProps } = this.props;
    if (trayProps && typeof trayProps[propName] === 'function') {
      ev.persist();
      trayProps[propName](ev);
    }
  }

  handleOnMouseDown(ev) {
    if (!this.props.dragEnabled) {
      this.callCallback('onMouseDown', ev);
      return;
    }
    ev.preventDefault();
    this.fakeOnDragStart({
      screenX: ev.screenX,
      screenY: ev.screenY,
      mouseDrag: true,
    });
    this.callCallback('onMouseDown', ev);
  }

  handleOnMouseMove(ev) {
    if (!this.state.isBeingMouseDragged) return;
    this.setState({ cancelNextClick: true });
    ev.preventDefault();
    this.fakeOnDragMove(ev.screenX, ev.screenY);
  }

  handleOnMouseUp(ev) {
    if (!this.state.isBeingMouseDragged) return;
    ev.preventDefault();
    this.fakeOnDragEnd();
  }

  handleOnClickCapture(ev) {
    if (!this.state.cancelNextClick) {
      this.callCallback('onClickCapture', ev);
      return;
    }
    ev.preventDefault();
    this.setState({ cancelNextClick: false });
    this.callCallback('onClickCapture', ev);
  }

  handleOnTouchStart(ev) {
    if (!this.props.touchEnabled) {
      this.callCallback('onTouchStart', ev);
      return;
    }

    if (this.props.orientation === 'vertical') {
      ev.preventDefault();
    }

    const touch = ev.targetTouches[0];
    this.fakeOnDragStart({
      screenX: touch.screenX,
      screenY: touch.screenY,
      touchDrag: true,
    });
    this.callCallback('onTouchStart', ev);
  }

  handleDocumentScroll() {
    if (!this.props.touchEnabled) return;
    this.isDocumentScrolling = true;
    window.clearTimeout(this.scrollStopTimer);
    this.scrollStopTimer = window.setTimeout(() => {
      this.isDocumentScrolling = false;
    }, 66);
  }

  handleOnTouchMove(ev) {
    if (
      !this.props.touchEnabled
      || (this.props.lockOnWindowScroll && this.isDocumentScrolling)
    ) {
      this.callCallback('onTouchMove', ev);
      return;
    }

    window.cancelAnimationFrame.call(window, this.moveTimer);

    const touch = ev.targetTouches[0];
    // TODO: This prevents an error case we were seeing internally, but long term we
    //  should evaluate if there's something better we can do to ensure there's not
    //  a different problem that we can address instead.
    if (touch) {
      this.fakeOnDragMove(touch.screenX, touch.screenY);
      this.callCallback('onTouchMove', ev);
    }
  }

  forward() {
    const {
      currentSlide, step, totalSlides, visibleSlides,
    } = this.props;
    return Math.min(currentSlide + step, totalSlides - visibleSlides);
  }

  backward() {
    const { currentSlide, step } = this.props;
    return Math.max(currentSlide - step, 0);
  }

  handleOnKeyDown(ev) {
    const { keyCode } = ev;
    const {
      carouselStore, currentSlide, disableKeyboard, totalSlides, visibleSlides,
    } = this.props;
    const newStoreState = {};

    if ((disableKeyboard === true) || (totalSlides <= visibleSlides)) return;

    // left arrow
    if (keyCode === 37) {
      ev.preventDefault();
      this.focus();
      newStoreState.currentSlide = Math.max(0, currentSlide - 1);
      newStoreState.isPlaying = false;
    }

    // right arrow
    if (keyCode === 39) {
      ev.preventDefault();
      this.focus();
      newStoreState.currentSlide = Math.min(
        totalSlides - visibleSlides,
        currentSlide + 1,
      );
      newStoreState.isPlaying = false;
    }

    carouselStore.setStoreState(newStoreState);
  }

  playForward() {
    const { carouselStore, currentSlide } = this.props;
    carouselStore.setStoreState({
      currentSlide: this.forward() === currentSlide ? 0 : this.forward(),
    });
  }

  playBackward() {
    const {
      carouselStore, currentSlide, totalSlides, visibleSlides,
    } = this.props;
    carouselStore.setStoreState({
      currentSlide: (
        this.backward() === currentSlide ? totalSlides - visibleSlides : this.backward()
      ),
    });
  }

  play() {
    const { playDirection } = this.props;
    this.interval = setInterval(playDirection === 'forward' ? this.playForward : this.playBackward, this.props.interval);
  }

  stop() {
    window.clearInterval(this.interval);
    this.interval = null;
  }

  /**
   * Find the first anscestor dom element that has a scroll bar and sets it's overflow to hidden.
   * this prevents the ancestor from scrolling while the user is doing the pinch-zoom gesture
   * on their touch-enabled device.
   * @return {void}
   */
  lockScroll() {
    const getScrollParent = new GetScrollParent();
    this.scrollParent = getScrollParent.getScrollParent(this.sliderTrayElement);
    if (this.scrollParent) {
      this.originalOverflow = this.originalOverflow || this.scrollParent.style.overflow;
      this.scrollParent.style.overflow = 'hidden';
    }
  }

  /**
   * Restores the original overflow for the ancestor dom element that had scroll bars. This is
   * called when the user releases the pinch-zoom gesture on their touch-enabled device.
   * @return {void}
   */
  unlockScroll() {
    if (this.scrollParent) {
      this.scrollParent.style.overflow = this.originalOverflow;
      this.originalOverflow = null;
      this.scrollParent = null;
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
      this.props.moveThreshold,
      this.props.orientation,
      this.state.deltaX,
      this.state.deltaY,
      slideSizeInPx,
      this.props.dragStep,
    );

    const maxSlide = this.props.totalSlides - Math.min(
      this.props.totalSlides, this.props.visibleSlides,
    );

    let currentSlide = boundedRange({
      min: 0,
      max: maxSlide,
      x: (this.props.currentSlide + slidesMoved),
    });

    if (this.props.infinite) {
      if (this.props.currentSlide >= maxSlide && slidesMoved > 0) {
        currentSlide = 0;
      }
      if (this.props.currentSlide === 0 && slidesMoved < 0) {
        currentSlide = maxSlide;
      }
    }

    this.props.carouselStore.setStoreState({
      currentSlide,
    });
  }

  focus() {
    this.sliderElement.focus();
  }

  handleOnTouchEnd(ev) {
    this.endTouchMove();
    this.callCallback('onTouchEnd', ev);
  }

  handleOnTouchCancel(ev) {
    this.endTouchMove();
    this.callCallback('onTouchCancel', ev);
  }

  endTouchMove() {
    if (!this.props.touchEnabled) return;
    this.fakeOnDragEnd();
  }

  renderMasterSpinner() {
    const { hasMasterSpinner, masterSpinnerFinished, spinner } = this.props;

    if (hasMasterSpinner && (!masterSpinnerFinished)) {
      if (typeof this.props.onMasterSpinner === 'function') this.props.onMasterSpinner();

      return (
        <div
          className={cn([
            s.masterSpinnerContainer,
            'carousel__master-spinner-container',
          ])}
        >
          {spinner && spinner()}
          {!spinner && <Spinner />}
        </div>
      );
    }

    return null;
  }

  render() {
    const {
      ariaLabel,
      carouselStore,
      children,
      className,
      classNameAnimation,
      classNameTray,
      classNameTrayWrap,
      currentSlide,
      disableAnimation,
      disableKeyboard,
      dragEnabled,
      hasMasterSpinner,
      interval,
      isPageScrollLocked,
      isPlaying,
      lockOnWindowScroll,
      masterSpinnerFinished,
      moveThreshold,
      naturalSlideHeight,
      naturalSlideWidth,
      onMasterSpinner,
      orientation,
      playDirection,
      privateUnDisableAnimation,
      slideSize,
      slideTraySize,
      spinner,
      style,
      tabIndex,
      totalSlides,
      touchEnabled,
      trayProps,
      trayTag: TrayTag,
      visibleSlides,
      isIntrinsicHeight,
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

    if (this.state.isBeingTouchDragged || this.state.isBeingMouseDragged || disableAnimation) {
      trayStyle.transition = 'none';
    }

    if (isIntrinsicHeight) {
      trayStyle.display = 'flex';
      trayStyle.alignItems = 'stretch';
    }

    if (orientation === 'vertical') {
      trayStyle.transform = `translateY(${trans}) translateY(${this.state.deltaY}px)`;
      trayStyle.width = pct(100);
      trayStyle.flexDirection = 'column';
    } else {
      trayStyle.width = pct(slideTraySize);
      trayStyle.transform = `translateX(${trans}) translateX(${this.state.deltaX}px)`;
      trayStyle.flexDirection = 'row';
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
      classNameTrayWrap,
    ]);

    const trayClasses = cn([
      s.sliderTray,
      classNameAnimation || s.sliderAnimation,
      'carousel__slider-tray',
      orientation === 'vertical' ? s.verticalTray : s.horizontalTray,
      orientation === 'vertical' ? 'carousel__slider-tray--vertical' : 'carousel__slider-tray--horizontal',
      classNameTray,
    ]);

    const newTabIndex = tabIndex !== null ? tabIndex : 0;

    // remove invalid div attributes
    const {
      dragStep,
      step,
      infinite,
      ...rest
    } = props;

    // filter out some tray props before passing them in.  We will process event handlers in the
    // trayProps object as callbacks to OUR event handlers.  Ref is needed by us. Style and
    // className are in the main props.  Can't merge them into trayProps without causing a breaking
    // change.
    const {
      className: ignoreClassName,
      onClickCapture,
      onMouseDown,
      onTouchCancel,
      onTouchEnd,
      onTouchMove,
      onTouchStart,
      ref: ignoreRef,
      style: ignoreStyle,
      ...filteredTrayProps
    } = trayProps;

    return (
      <div
        ref={(el) => { this.sliderElement = el; }}
        className={sliderClasses}
        aria-live="polite"
        aria-label={ariaLabel}
        style={sliderStyle}
        tabIndex={newTabIndex}
        onKeyDown={this.handleOnKeyDown}
        role="listbox"
        {...rest}
      >
        <div className={trayWrapClasses} style={trayWrapStyle}>
          <TrayTag
            ref={this.getSliderRef}
            className={trayClasses}
            style={trayStyle}
            onTouchStart={this.handleOnTouchStart}
            onTouchMove={this.handleOnTouchMove}
            onTouchEnd={this.handleOnTouchEnd}
            onTouchCancel={this.handleOnTouchCancel}
            onMouseDown={this.handleOnMouseDown}
            onClickCapture={this.handleOnClickCapture}
            {...filteredTrayProps}
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
