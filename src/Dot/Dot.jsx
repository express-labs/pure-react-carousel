import React from 'react';
import PropTypes from 'prop-types';
import { CarouselPropTypes, cn } from '../helpers';
import s from './Dot.scss';

const Dot = class Dot extends React.Component {
  static propTypes = {
    carouselStore: PropTypes.object.isRequired,
    children: CarouselPropTypes.children.isRequired,
    className: PropTypes.string,
    currentSlide: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    selected: PropTypes.bool,
    slide: PropTypes.number.isRequired,
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
    const {
      carouselStore, onClick, slide, totalSlides, visibleSlides,
    } = this.props;
    const newSlide = slide >= totalSlides - visibleSlides ? totalSlides - visibleSlides : slide;

    carouselStore.setStoreState({
      currentSlide: newSlide,
    }, onClick !== null && onClick.call(this, ev));
  }

  render() {
    const {
      carouselStore, children, className, currentSlide, disabled, onClick, selected, slide,
      totalSlides, visibleSlides, ...props
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
        type="button"
        onClick={this.handleOnClick}
        className={newClassName}
        disabled={newDisabled}
        {...props}
      >
        {this.props.children}
      </button>
    );
  }
};

export default Dot;
