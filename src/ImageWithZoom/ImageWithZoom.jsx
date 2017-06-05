import React from 'react';
import PropTypes from 'prop-types';
import { Image } from '../';
import { cn } from '../helpers';
import s from './ImageWithZoom.css';

const ImageWithZoom = class ImageWithZoom extends React.Component {
  static propTypes = {
    // alt: PropTypes.string,
    // onError: PropTypes.func,
    // onLoad: PropTypes.func,
    src: PropTypes.string.isRequired,
    tag: PropTypes.string,
  }

  static defaultProps = {
    tag: 'div',
  }

  constructor() {
    super();
    this.state = {
      hovering: false,
      style: {},
    };
    this.handleOnMouseOver = this.handleOnMouseOver.bind(this);
    this.handleOnMouseOut = this.handleOnMouseOut.bind(this);
    this.handleOnMouseMove = this.handleOnMouseMove.bind(this);
  }

  handleOnMouseOver() {
    this.setState({
      hovering: true,
    });
  }

  handleOnMouseOut() {
    this.setState({
      hovering: false,
    });
  }

  handleOnMouseMove(ev) {
    const x = (ev.nativeEvent.offsetX / ev.target.offsetWidth) * 100;
    const y = (ev.nativeEvent.offsetY / ev.target.offsetHeight) * 100;
    this.setState({ x, y });
  }

  render() {
    const { tag: Tag, src } = this.props;

    const imageClassName = cn([
      s.image,
      'carousel__zoom-image',
    ]);

    const overlayClassName = cn([
      s.overlay,
      'carousel__zoom-image-overlay',
      this.state.hovering && s.hover,
    ]);

    const overlayStyle = {};
    overlayStyle.transformOrigin = `${this.state.x}% ${this.state.y}%`;

    return (
      <Tag className={s.container}>
        <Image
          className={imageClassName}
          src={src}
          isResponsive
        />
        <Image
          className={overlayClassName}
          tag="div"
          src={src}
          style={overlayStyle}
          isBgImage
          isResponsive
          onMouseOver={this.handleOnMouseOver}
          onMouseOut={this.handleOnMouseOut}
          onMouseMove={this.handleOnMouseMove}
        />
      </Tag>
    );
  }
};

export default ImageWithZoom;
