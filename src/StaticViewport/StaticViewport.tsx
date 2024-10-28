import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { cn } from '../helpers';
import s from './SliderViewport.scss';
import {
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type StaticViewportProps<C extends React.ElementType> =
  React.ComponentPropsWithoutRef<C> & {
    as?: C;
    children?: React.ReactElement;
    className: string;
  };

const SliderViewport = <C extends React.ElementType = 'div'>({
  as,
  children,
  className,
  style,
}: StaticViewportProps<C>) => {
  const { orientation, slideTraySize = 0 } = useContext(CarouselStoreContext);

  const containerRef = useRef(null);

  const Tag = as || 'div';

  const { dispatch } = useContext(CarouselActionContext);

  useEffect(() => {
    const handleScrollStart = () => {
      dispatch({ type: ActionTypes.SCROLL_START });
    };
    const el = containerRef.current as React.ComponentProps<C>;
    el.addEventListener('scrollstart', handleScrollStart);
    return () => {
      el?.removeEventListener('scrollstart', handleScrollStart);
    };
  }, [containerRef, dispatch]);

  useEffect(() => {
    const handleScrollEnd = () => {
      dispatch({ type: ActionTypes.SCROLL_END });
    };
    const el = containerRef.current as React.ComponentProps<C>;
    el.addEventListener('scrollend', handleScrollEnd);
    return () => {
      el?.removeEventListener('scrollend', handleScrollEnd);
    };
  }, []);

  // viewport styles
  const viewportStyle = useMemo<React.CSSProperties>(() => {
    const x: React.CSSProperties = {};
    x[orientation === 'horizontal' ? 'width' : 'height'] = slideTraySize;
    return { ...x, ...style };
  }, [style, orientation, slideTraySize]);

  return (
    <Tag
      ref={containerRef}
      className={cn(
        orientation === 'vertical' ? s.verticalSlider : s.horizontalSlider,
        'carousel__slider',
        orientation === 'vertical'
          ? 'carousel__slider--vertical'
          : 'carousel__slider--horizontal',
        className
      )}
      style={viewportStyle}
    >
      {children}
    </Tag>
  );
};

export default SliderViewport;
