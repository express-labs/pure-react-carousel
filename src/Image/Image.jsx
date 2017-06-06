import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn, LOADING, SUCCESS, ERROR } from '../helpers';
import s from './Image.css';

class Image extends React.Component {
  static propTypes = {
    alt: PropTypes.string,
    children: CarouselPropTypes.children,
    className: PropTypes.string,
    hasMasterSpinner: PropTypes.bool.isRequired,
    height: CarouselPropTypes.height,
    isBgImage: PropTypes.bool,
    isResponsive: PropTypes.bool,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    orientation: CarouselPropTypes.orientation.isRequired,
    renderError: PropTypes.func,
    renderLoading: PropTypes.func,
    src: PropTypes.string.isRequired,
    store: PropTypes.object.isRequired,
    style: PropTypes.object,
    tag: PropTypes.string,
  }

  static defaultProps = {
    alt: '',
    children: null,
    className: null,
    height: null,
    isBgImage: false,
    isResponsive: false,
    onError: null,
    onLoad: null,
    renderError: null,
    renderLoading: null,
    tag: 'img',
    style: null,
  }

  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = { imageStatus: LOADING };
    this.image = document.createElement('img');
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.handleImageError = this.handleImageError.bind(this);

    if (props.hasMasterSpinner) {
      props.store.subscribeMasterSpinner();
    }
  }

  componentDidMount() {
    this.image.onload = this.handleImageLoad;
    this.image.onerror = this.handleImageError;
    this.image.src = this.props.src;
  }

  handleImageLoad(ev) {
    this.setState({ imageStatus: SUCCESS });
    this.props.store.masterSpinnerSuccess();
    if (this.props.onLoad) this.props.onLoad(ev);
  }

  handleImageError(ev) {
    this.setState({ imageStatus: ERROR });
    this.props.store.masterSpinnerError();
    if (this.props.onError) this.props.onError(ev);
  }

  tempTag() {
    return this.props.tag === 'img' ? 'div' : this.props.tag;
  }

  customRender(propName) {
    if (this.props[propName]) return this.props[propName]();
    return this.props.children;
  }

  renderLoading(props) {
    const Tag = this.tempTag();

    const newClassName = cn([
      s.image,
      s.imageLoading,
      this.props.isResponsive && s.responsive,
      'carousel__image',
      'carousel__image--loading',
      this.props.className,
    ]);

    return <Tag className={newClassName} {...props}>{this.customRender('renderLoading')}</Tag>;
  }

  renderError(props) {
    if (this.props.renderError) return this.props.renderError();

    const Tag = this.tempTag();

    const newClassName = cn([
      s.image,
      s.imageError,
      this.props.isResponsive && s.responsive,
      'carousel__image',
      'carousel__image--error',
      this.props.className,
    ]);

    return <Tag className={newClassName} {...props}>{this.customRender('renderError')}</Tag>;
  }

  renderSuccess(props) {
    const { style, src, alt, tag: Tag } = this.props;
    const newClassName = cn([
      s.image,
      this.props.isResponsive && s.responsive,
      'carousel__image',
      this.props.isBgImage && 'carousel__image--with-background',
      'carousel__image--success',
      this.props.className,
    ]);

    let newStyle = Object.assign({}, style);

    let filterdProps = props;

    if (Tag !== 'img') {
      filterdProps = { src, ...props };
      newStyle = Object.assign({}, style, {
        backgroundImage: `url("${src}")`,
        backgroundSize: 'cover',
      });
    }

    return (
      <Tag {...filterdProps} className={newClassName} style={newStyle} alt={alt}>
        {this.props.children}
      </Tag>
    );
  }

  render() {
    const {
      children, className, hasMasterSpinner, height, isBgImage, isResponsive, onError, onLoad,
      orientation, renderError, renderLoading, store, tag,
      ...props
    } = this.props;

    switch (this.state.imageStatus) {
      case LOADING:
        return this.renderLoading(props);
      case SUCCESS:
        return this.renderSuccess(props);
      case ERROR:
        return this.renderError(props);
      default:
        throw new Error('unknown value for this.state.imageStatus');
    }
  }
}

export default Image;
