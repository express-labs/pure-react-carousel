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
    isBgImage: CarouselPropTypes.isBgImage,
    naturalSlideHeight: PropTypes.number.isRequired,
    naturalSlideWidth: PropTypes.number.isRequired,
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
    onError: null,
    onLoad: null,
    renderError: null,
    renderLoading: null,
    tag: 'img',
    style: null,
  }

  static subscribeMasterSpinner(props) {
    if (props.hasMasterSpinner) {
      props.store.subscribeMasterSpinner();
    }
  }

  constructor(props) {
    super(props);
    this.state = { imageStatus: LOADING };
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
    this.image = null;
  }

  componentDidMount() {
    Image.subscribeMasterSpinner(this.props);
    this.initImage();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.src !== this.props.src) {
      Image.subscribeMasterSpinner(nextProps);
      this.initImage();
    }
  }

  componentWillUnmount() {
    this.image.removeEventListener('load', this.hamdleImageLoad);
    this.image.removeEventListener('error', this.handleImageError);
    this.image.remove();
  }

  initImage() {
    if (this.image !== null) {
      this.image.removeEventListener('load', this.hamdleImageLoad);
      this.image.removeEventListener('error', this.handleImageError);
      this.image.remove();
    }
    this.image = document.createElement('img');
    this.image.addEventListener('load', this.handleImageLoad, false);
    this.image.addEventListener('error', this.handleImageError, false);
    this.image.src = this.props.src;
  }

  handleImageLoad(ev) {
    this.setState({ imageStatus: SUCCESS });
    if (this.props.hasMasterSpinner) this.props.store.masterSpinnerSuccess();
    if (this.props.onLoad) this.props.onLoad(ev);
  }

  handleImageError(ev) {
    this.setState({ imageStatus: ERROR });
    if (this.props.hasMasterSpinner) this.props.store.masterSpinnerError();
    if (this.props.onError) this.props.onError(ev);
  }

  tempTag() {
    return this.props.tag === 'img' ? 'div' : this.props.tag;
  }

  customRender(propName) {
    if (typeof this.props[propName] === 'function') return this.props[propName]();
    return this.props.children;
  }

  renderLoading(filteredProps) {
    const Tag = this.tempTag();

    const newClassName = cn([
      s.image,
      s.imageLoading,
      'carousel__image',
      this.props.isBgImage && 'carousel__image--with-background',
      'carousel__image--loading',
      this.props.className,
    ]);

    return <Tag className={newClassName} {...filteredProps}>{this.customRender('renderLoading')}</Tag>;
  }

  renderError(filteredProps) {
    const Tag = this.tempTag();

    const newClassName = cn([
      s.image,
      s.imageError,
      'carousel__image',
      this.props.isBgImage && 'carousel__image--with-background',
      'carousel__image--error',
      this.props.className,
    ]);

    return <Tag className={newClassName} {...filteredProps}>{this.customRender('renderError')}</Tag>;
  }

  renderSuccess(filteredProps) {
    const { style, tag: Tag } = this.props;
    const newClassName = cn([
      s.image,
      'carousel__image',
      this.props.isBgImage && 'carousel__image--with-background',
      'carousel__image--success',
      this.props.className,
    ]);

    let newStyle = Object.assign({}, style);

    let newFilteredProps = filteredProps;

    if (Tag !== 'img') {
      const { src, alt, ...tempFilteredProps } = filteredProps;
      newFilteredProps = tempFilteredProps;
      newStyle = Object.assign({}, style, {
        backgroundImage: `url("${src}")`,
        backgroundSize: 'cover',
      });
    }

    return (
      <Tag className={newClassName} style={newStyle} {...newFilteredProps}>
        {this.props.children}
      </Tag>
    );
  }

  render() {
    const {
      children, className, hasMasterSpinner, isBgImage, naturalSlideHeight, naturalSlideWidth,
      onError, onLoad, orientation, renderError, renderLoading, store, style, tag,
      ...filteredProps
    } = this.props;

    switch (this.state.imageStatus) {
      case LOADING:
        return this.renderLoading(filteredProps);
      case SUCCESS:
        return this.renderSuccess(filteredProps);
      case ERROR:
        return this.renderError(filteredProps);
      default:
        throw new Error('unknown value for this.state.imageStatus');
    }
  }
}

export default Image;
