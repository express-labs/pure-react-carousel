import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { cn } from '../helpers';
import s from './StaticViewport.scss';
import {
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type StaticViewportProps = React.ComponentPropsWithoutRef<'div'> & {
  children?: React.ReactNode;
  className?: string;
  behavior?: ScrollOptions;
} & (
    | { orientation: 'horizontal'; slideWidth: number; slideHeight?: never }
    | { orientation: 'vertical'; slideWidth?: never; slideHeight: number }
  );

const SliderViewport = ({
  children,
  className,
  style,
  slideWidth,
  slideHeight,
  orientation: initOrientation,
}: StaticViewportProps) => {
  const {
    orientation,
    currentSlide = 0,
    isScrolling = false,
    slideSize = 0,
    slideTraySize = 0,
    totalSlides = 0,
    visibleSlides = 0,
  } = useContext(CarouselStoreContext);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);

  const { dispatch } = useContext(CarouselActionContext);

  useEffect(() => {
    const slideSize =
      initOrientation === 'horizontal' ? slideWidth : slideHeight;
    const slideTraySize = slideSize * totalSlides;
    dispatch({
      type: ActionTypes.UPDATE_SIZES,
      payload: { slideSize, slideTraySize, orientation: initOrientation },
    });
  }, []);

  useEffect(() => {
    const scrollOptions: ScrollToOptions = {
      [orientation === 'horizontal' ? 'left' : 'top']: slideSize * currentSlide,
      behavior: 'smooth',
    };
    viewportRef?.current?.scrollTo(scrollOptions);
  }, [currentSlide, trayRef]);

  useEffect(() => {
    const handleScrollStart = () => {
      if (!isScrolling) {
        dispatch({ type: ActionTypes.SCROLL_START });
      }
    };
    const el = viewportRef.current;
    if (el) el.addEventListener('scroll', handleScrollStart);
    return () => {
      el?.removeEventListener('scroll', handleScrollStart);
    };
  }, [viewportRef, dispatch, isScrolling]);

  useEffect(() => {
    const handleScrollEnd = () => {
      const { width, height } =
        viewportRef.current?.getBoundingClientRect() ?? {};
      const { scrollLeft, scrollTop } = viewportRef.current ?? {};
      dispatch({
        type: ActionTypes.SCROLL_END,
        payload: {
          viewportWidth: width,
          viewportHeight: height,
          scrollLeft,
          scrollTop,
        },
      });
    };
    const el = viewportRef.current;
    if (el) el.addEventListener('scrollend', handleScrollEnd);
    return () => {
      el?.removeEventListener('scrollend', handleScrollEnd);
    };
  }, []);

  // viewport styles
  const viewportStyle = useMemo<React.CSSProperties>(() => {
    const x: React.CSSProperties = {};
    x[orientation === 'horizontal' ? 'width' : 'height'] =
      slideSize * visibleSlides;
    return { ...x, ...style };
  }, [style, orientation, slideTraySize]);

  // tray styles
  const trayStyle: React.CSSProperties = {};
  trayStyle[orientation === 'horizontal' ? 'width' : 'height'] = slideTraySize;

  return (
    <div
      ref={viewportRef}
      className={cn(
        orientation === 'vertical' ? s.vertical : s.horizontal,
        'carousel__slider',
        orientation === 'vertical'
          ? 'carousel__slider--vertical'
          : 'carousel__slider--horizontal',
        className
      )}
      style={viewportStyle}
    >
      <div ref={trayRef} style={trayStyle}>
        {children}
      </div>
    </div>
  );
};

export default SliderViewport;
