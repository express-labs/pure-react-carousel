import React from 'react';
import PropTypes from 'prop-types';
import { cn } from '../helpers';
import s from './Image.css';

const LOADING = 'loading';
const SUCCESS = 'success';
const ERROR = 'error';

class Image extends React.Component {
  static propTypes = {
    alt: PropTypes.string,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    renderError: PropTypes.func,
    renderLoading: PropTypes.func,
    responsive: PropTypes.bool,
    src: PropTypes.string.isRequired,
  }

  static defaultProps = {
    alt: '',
    onError: null,
    onLoad: null,
    renderError: null,
    renderLoading: null,
    responsive: false,
  }

  constructor(props) {
    super(props);
    this.mounted = false;
    this.state = { imageStatus: LOADING };
    this.image = document.createElement('img');
    this.handleImageLoad = this.handleImageLoad.bind(this);
    this.handleImageError = this.handleImageError.bind(this);
  }

  componentDidMount() {
    this.image.onload = this.handleImageLoad;
    this.image.onerror = this.handleImageError;
    this.image.src = this.props.src;
  }

  handleImageLoad(ev) {
    this.setState({ imageStatus: SUCCESS });
    if (this.props.onLoad) this.props.onLoad(ev);
  }

  handleImageError(ev) {
    this.setState({ imageStatus: ERROR });
    if (this.props.onError) this.props.onError(ev);
  }

  renderLoading() {
    if (this.props.renderLoading) return this.props.renderLoading();
    return <span>Loading</span>;
  }

  renderSuccess() {
    const {
      alt, onError, onLoad, responsive, renderError, renderLoading, src, ...props
    } = this.props;
    const cssClass = cn([
      s.image,
      responsive && s.responsive,
      'carousel__image',
    ]);
    return <img className={cssClass} src={src} alt={alt} {...props} />;
  }

  renderError() {
    if (this.props.renderError) return this.props.renderError();
    return <span>Error</span>;
  }

  render() {
    switch (this.state.imageStatus) {
      case LOADING:
        return this.renderLoading();
      case SUCCESS:
        return this.renderSuccess();
      case ERROR:
        return this.renderError();
      default:
        throw new Error('unknown value for this.state.imageStatus');
    }
  }
}

export default Image;
