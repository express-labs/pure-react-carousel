import React from 'react';
import PropTypes from 'prop-types';
import Image from '../Image';
import Spinner from '../Spinner';
import { boundedRange, cn, pct } from '../helpers';
import s from './ImageWithZoom.scss';

const MOUSE_SCALE = 2;

const MAX_TOUCH_SCALE = 3;

const ImageWithZoom = class ImageWithZoom extends React.Component {
  static propTypes = {
    // alt: PropTypes.string,
    carouselStore: PropTypes.object.isRequired,
    spinner: PropTypes.func,
    src: PropTypes.string.isRequired,
    srcZoomed: PropTypes.string,
    tag: PropTypes.string,
    isPinchZoomEnabled: PropTypes.bool,
  }

  static defaultProps = {
    isPinchZoomEnabled: true,
    spinner: null,
    srcZoomed: null,
    tag: 'div',
  }

  /**
   * Find the midpoint between two touches.
   * @param  {number} x1 Touch #1 x coordinate.
   * @param  {number} y1 Touch #1 y coordinate.
   * @param  {number} x2 Touch #2 x coordinate.
   * @param  {number} y2 Touch #2 y coordinate.
   * @return {Object}    An object describing the midpoint as two properties: x and y.
   */
  static midpointBetweenTwoTouches({
    x1, y1, x2, y2,
  }) {
    // hint: make the two points the diameter of a circle. The center of the circle is the midpoint.
    return {
      x: (x1 + x2) / 2,
      y: (y1 + y2) / 2,
    };
  }

  /**
   * Find the distance between two touches.
   * @param  {number} x1 Touch #1 x coordinate.
   * @param  {number} y1 Touch #1 y coordinate.
   * @param  {number} x2 Touch #2 x coordinate.
   * @param  {number} y2 Touch #2 y coordinate.
   * @return {number}    The distance.
   */
  static distanceBetweenTwoTouches({
    x1, y1, x2, y2,
  }) {
    // hint: make a right triangle that joins the two points.  The distance is the hypotenuce.
    return Math.sqrt(((x2 - x1) ** 2) + ((y2 - y1) ** 2));
  }

  constructor(props) {
    super(props);

    // state changes that require a re-render
    this.state = {
      // tracks the status via image element's onload, onerror events.
      isImageLoading: true,

      // the mouse is currently hovering over the image.
      isHovering: false,

      // the user is doing the pinch-zoom gesture on the image on a touch device.
      isZooming: false,

      // the x coordinate of the mouse or pinch-zoom
      x: null,

      // the y coordinate of the mouse or pinch-zoom`
      y: null,

      // the zoom level.  1 means no zoom. > 1 = zoomed in.
      scale: 1,
    };

    // state that doesn't require a re-render
    this.tpCache = {}; // stores the original touch points, uses them to calculate touch deltas.

    // event handlers
    this.handleImageComplete = this.handleImageComplete.bind(this);
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnTouchEnd = this.handleOnTouchEnd.bind(this);
    this.handleOnTouchMove = this.handleOnTouchMove.bind(this);
    this.handleOnTouchStart = this.handleOnTouchStart.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isZooming === false && this.state.isZooming === true) {
      this.props.carouselStore.setStoreState({
        isPageScrollLocked: true,
      });
    }
    if (prevState.isZooming === true && this.state.isZooming === false) {
      this.props.carouselStore.setStoreState({
        isPageScrollLocked: false,
      });
    }
  }

  handleImageComplete() {
    this.setState({
      isImageLoading: false,
    });
  }

  handleOnMouseOver() {
    if (this.state.isZooming) return;
    this.setState({
      isHovering: true,
      scale: MOUSE_SCALE,
    });
  }

  handleOnMouseOut() {
    if (this.state.isZooming) return;
    this.setState({
      isHovering: false,
      scale: 1,
    });
  }

  handleOnMouseMove(ev) {
    if (this.state.isZooming) return;
    const x = pct((ev.nativeEvent.offsetX / ev.target.offsetWidth) * 100);
    const y = pct((ev.nativeEvent.offsetY / ev.target.offsetHeight) * 100);
    this.setState({ x, y });
  }

  handleOnTouchStart(ev) {
    if (!this.props.isPinchZoomEnabled) return;
    [...ev.targetTouches].forEach((touchPoint) => {
      this.tpCache[touchPoint.identifier] = {
        clientX: touchPoint.clientX,
        clientY: touchPoint.clientY,
      };
    });

    // once zoom is on, it's only off if they stop touching everything.  This is done because
    // sometimes one of the two fingers doesn't move enough to register as a touch point and
    // it will start scrolling the carousel, which made for a jerky experience.
    this.setState(state => ({
      isZooming: state.isZooming || Object.keys(this.tpCache).length > 1,
    }));
  }

  handleOnTouchMove(ev) {
    if (!this.state.isZooming) return;

    ev.persist();

    const touches = [...ev.targetTouches].filter(
      touch => this.tpCache[touch.identifier],
    ).slice(0, 2);

    if (touches.length === 2) {
      ev.stopPropagation();

      const clientRect = ev.target.getBoundingClientRect();

      const id0 = touches[0].identifier;
      const id1 = touches[1].identifier;

      // coordinates of the starting touch points.
      const start = {
        x1: this.tpCache[id0].clientX,
        y1: this.tpCache[id0].clientY,
        x2: this.tpCache[id1].clientX,
        y2: this.tpCache[id1].clientY,
      };

      // length of the line connecting the starting touch points
      start.distance = ImageWithZoom.distanceBetweenTwoTouches({ ...start });

      // midpoint between the two starting touch points
      const startMidpoint = ImageWithZoom.midpointBetweenTwoTouches({ ...start });
      start.cx = startMidpoint.x;
      start.cy = startMidpoint.y;

      // coordinates of the ending touch points.
      const end = {
        x1: touches[0].clientX,
        y1: touches[0].clientY,
        x2: touches[1].clientX,
        y2: touches[1].clientY,
      };

      // length of the line connecting the ending touch points
      end.distance = ImageWithZoom.distanceBetweenTwoTouches({ ...end });

      // midpoint between the two ending touch points
      const endMidpoint = ImageWithZoom.midpointBetweenTwoTouches({ ...end });
      end.cx = endMidpoint.x;
      end.cy = endMidpoint.y;

      // find the left% and top% of the midpoint between the two ending touches
      const x = pct(boundedRange({
        min: 0,
        max: 100,
        x: ((end.cx - clientRect.left) / clientRect.width) * 100,
      }));
      const y = pct(boundedRange({
        min: 0,
        max: 100,
        x: ((end.cy - clientRect.top) / clientRect.height) * 100,
      }));
      const scale = state => boundedRange({
        min: 1,
        max: MAX_TOUCH_SCALE,
        x: (state.scale + ((end.distance - start.distance) / 100)),
      });

      this.setState(state => ({
        isZooming: scale(state) !== 1,
        scale: scale(state),
        x,
        y,
      }));
    }
  }

  handleOnTouchEnd(ev) {
    if (!this.props.isPinchZoomEnabled) return;

    [...ev.changedTouches].forEach((touchPoint) => {
      delete this.tpCache[touchPoint.identifier];
    });

    // zoom mode only ends once they let go of all touch points
    if (Object.keys(this.tpCache).length === 0) {
      this.setState({ isZooming: false });
    }
  }

  renderLoading() {
    if (this.state.isImageLoading) {
      const { spinner } = this.props;
      return (
        <div
          className={cn([s.imageLoadingSpinnerContainer, 'carousel__image-loading-spinner-container'])}
        >
          { spinner && spinner() }
          { !spinner && <Spinner />}
        </div>
      );
    }

    return null;
  }


  render() {
    const {
      carouselStore,
      isPinchZoomEnabled,
      spinner,
      src,
      srcZoomed,
      tag: Tag,
      ...filteredProps
    } = this.props;

    const imageClassName = cn([
      s.image,
      'carousel__zoom-image',
    ]);

    const overlayClassName = cn([
      s.overlay,
      'carousel__zoom-image-overlay',
      this.state.isHovering && s.hover,
      this.state.isZooming && s.zoom,
      this.state.isHovering && 'carousel__zoom-image-overlay--hovering',
      this.state.isZooming && 'carousel__zoom-image-overlay--zooming',
    ]);

    const overlayStyle = {};
    if (this.state.isHovering || this.state.isZooming) {
      overlayStyle.transformOrigin = `${this.state.x} ${this.state.y}`;
      overlayStyle.transform = `scale(${this.state.scale})`;
    }

    return (
      <Tag className={s.container} {...filteredProps}>
        <Image
          className={imageClassName}
          tag="div"
          src={src}
          isBgImage
          onLoad={this.handleImageComplete}
          onError={this.handleImageComplete}
        />
        <Image
          className={overlayClassName}
          tag="div"
          src={srcZoomed || src}
          style={overlayStyle}
          isBgImage
          onFocus={this.handleOnMouseOver}
          onMouseOver={this.handleOnMouseOver}
          onBlur={this.handleOnMouseOut}
          onMouseOut={this.handleOnMouseOut}
          onMouseMove={this.handleOnMouseMove}
          onTouchStart={this.handleOnTouchStart}
          onTouchEnd={this.handleOnTouchEnd}
          onTouchMove={this.handleOnTouchMove}
        />
        {this.renderLoading()}
      </Tag>
    );
  }
};

export default ImageWithZoom;
