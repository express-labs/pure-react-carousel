import React from 'react';
import PropTypes from 'prop-types';
import omit from 'object.omit';

const LOADING = 'loading';
const SUCCESS = 'success';
const ERROR = 'error';

class Image extends React.Component {
  static propTypes = {
    alt: PropTypes.string,
    onError: PropTypes.func,
    onLoad: PropTypes.func,
    renderLoading: PropTypes.func,
    renderError: PropTypes.func,
    src: PropTypes.string.isRequired,
  }

  static defaultProps = {
    alt: '',
    onError: null,
    onLoad: null,
    renderLoading: null,
    renderError: null,
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
    const filteredProps = omit(this.props, ['children', 'src', 'alt', 'onLoad', 'onError', 'renderLoading', 'renderError']);
    return <img src={this.props.src} alt={this.props.alt} {...filteredProps} />;
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
