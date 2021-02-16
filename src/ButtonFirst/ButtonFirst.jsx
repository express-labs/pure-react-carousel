import React from 'react';
import PropTypes from 'prop-types';
import s from './ButtonFirst.scss';
import { CarouselPropTypes, cn } from '../helpers';

const ButtonFirst = class ButtonFirst extends React.Component {
  static propTypes = {
    carouselStore: PropTypes.object.isRequired,
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    totalSlides: PropTypes.number.isRequired,
    tag: PropTypes.elementType,
  }

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
    tag: 'button',
  }

  constructor() {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(ev) {
    const { carouselStore, onClick } = this.props;
    carouselStore.setStoreState({
      currentSlide: 0,
      isPlaying: false,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      carouselStore,
      className,
      currentSlide,
      disabled,
      onClick,
      totalSlides,
      tag: Tag,
      ...props
    } = this.props;

    const newClassName = cn([
      s.buttonFirst,
      'carousel__first-button',
      className,
    ]);

    const newDisabled = disabled !== null ? disabled : currentSlide === 0;

    return (
      <Tag
        type="button"
        aria-label="first"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={newDisabled}
        {...props}
      >
        {this.props.children}
      </Tag>
    );
  }
};

export default ButtonFirst;
