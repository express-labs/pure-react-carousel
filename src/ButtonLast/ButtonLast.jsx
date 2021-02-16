import React from 'react';
import PropTypes from 'prop-types';
import s from './ButtonLast.scss';
import { CarouselPropTypes, cn } from '../helpers';

const ButtonLast = class ButtonLast extends React.Component {
  static propTypes = {
    carouselStore: PropTypes.object.isRequired,
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
    tag: PropTypes.elementType,
  };

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
    tag: 'button',
  };

  constructor() {
    super();
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(ev) {
    const {
      carouselStore, onClick, totalSlides, visibleSlides,
    } = this.props;
    carouselStore.setStoreState(
      {
        currentSlide: totalSlides - visibleSlides,
        isPlaying: false,
      },
      onClick !== null && onClick.call(this, ev),
    );
  }

  render() {
    const {
      carouselStore,
      className,
      currentSlide,
      disabled,
      onClick,
      totalSlides,
      visibleSlides,
      tag: Tag,
      ...props
    } = this.props;

    const newClassName = cn([s.buttonLast, 'carousel__last-button', className]);

    const isDisabled = disabled !== null ? disabled : currentSlide >= totalSlides - visibleSlides;

    return (
      <Tag
        type="button"
        aria-label="last"
        className={newClassName}
        onClick={this.handleOnClick}
        disabled={isDisabled}
        {...props}
      >
        {this.props.children}
      </Tag>
    );
  }
};

export default ButtonLast;
