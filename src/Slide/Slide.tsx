import React, { useCallback, useContext } from 'react';
import { cn, pct } from '../helpers';
import s from './Slide.scss';
import {
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type SlideProps<C extends React.ElementType> =
  React.ComponentPropsWithoutRef<C> & {
    // required
    index: number;

    // optional
    as?: C;
    className?: string;
    classNameHidden?: string;
    classNameVisible?: string;
  };

const Slide = <C extends React.ElementType = 'div'>({
  // required
  index,

  // optional
  as,
  children,
  className,
  classNameHidden,
  classNameVisible,
  style,
}: SlideProps<C>) => {
  const {
    currentVisibleSlides = [],
    orientation,
    slideSize = 0,
  } = useContext(CarouselStoreContext);

  const Tag = as || 'div';

  const { dispatch } = useContext(CarouselActionContext);

  const isVisible = currentVisibleSlides?.[index];

  // compute the "size" of the slide (width for horizontal, height for vertical)
  const newStyle: React.CSSProperties = { ...style };
  newStyle[orientation === 'horizontal' ? 'width' : 'height'] = slideSize;

  return (
    <Tag
      className={cn([
        s.slide,
        orientation === 'horizontal' && s.horizontal,
        orientation === 'vertical' && s.vertical,
        'carousel__slide',
        isVisible && classNameVisible,
        isVisible && 'carousel__slide--visible',
        !isVisible && classNameHidden,
        !isVisible && 'carousel__slide--hidden',
        className,
      ])}
      style={newStyle}
    >
      {children}
    </Tag>
  );
};

export default Slide;
