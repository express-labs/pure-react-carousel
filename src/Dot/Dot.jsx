import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn } from '../helpers';
import s from './Dot.css';

const Dot = class Dot extends React.Component {
  static propTypes = {
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    slide: PropTypes.number.isRequired,
    carouselStore: PropTypes.object.isRequired,
    totalSlides: PropTypes.number.isRequired,
    visibleSlides: PropTypes.number.isRequired,
  }

  static defaultProps = {
    className: null,
    disabled: null,
    onClick: null,
    selected: null,
  }

  constructor(props) {
    super(props);
    this.handleOnClick = this.handleOnClick.bind(this);
  }

  handleOnClick(ev) {
    const { onClick, slide, carouselStore, totalSlides, visibleSlides } = this.props;
    const newSlide = slide >= totalSlides - visibleSlides ? totalSlides - visibleSlides : slide;

    carouselStore.setStoreState({
      currentSlide: newSlide,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      children, className, currentSlide, disabled, onClick, selected, slide, carouselStore, totalSlides,
      visibleSlides, ...props
    } = this.props;
    const defaultSelected = slide >= currentSlide && slide < (currentSlide + visibleSlides);
    const newSelected = typeof selected === 'boolean' ? selected : defaultSelected;
    const defaultDisabled = defaultSelected === true;
    const newDisabled = typeof disabled === 'boolean' ? disabled : defaultDisabled;

    const newClassName = cn([
      s.dot,
      newSelected && s.dotSelected,
      'carousel__dot',
      `carousel__dot--${slide}`,
      newSelected && 'carousel__dot--selected',
      className,
    ]);

    return (
      <button
        onClick={this.handleOnClick}
        className={newClassName}
        disabled={newDisabled}
        {...props}
      >{this.props.children}</button>
    );
  }
};

export default Dot;
