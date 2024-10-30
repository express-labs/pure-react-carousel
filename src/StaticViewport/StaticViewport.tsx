import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { cn, computeCurrentVisibleSlides } from '../helpers';
import s from './StaticViewport.scss';
import {
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
} from '../CarouselProvider/CarouselContext';

export type StaticViewportProps = React.ComponentPropsWithoutRef<'div'> & {
  behavior?: ScrollOptions;
  children?: React.ReactNode;
  className?: string;
  styleTray?: React.CSSProperties;
} & (
    | { orientation: 'horizontal'; slideWidth: number; slideHeight?: never }
    | { orientation: 'vertical'; slideWidth?: never; slideHeight: number }
  );

const SliderViewport = ({
  children,
  className,
  slideHeight = 0,
  slideWidth = 0,
  style = {},
  styleTray = {},
}: StaticViewportProps) => {
  const {
    currentSlide,
    isScrolling,
    orientation,
    slideSize,
    slideTraySize,
    totalSlides,
    visibleSlides,
  } = useContext(CarouselStoreContext);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useContext(CarouselActionContext);

  // initialize after first mount
  useEffect(() => {
    const slideSize = orientation === 'horizontal' ? slideWidth : slideHeight;
    const slideTraySize = slideSize * (totalSlides ?? 0);
    const currentVisibleSlides = computeCurrentVisibleSlides({
      currentSlide,
      totalSlides,
      visibleSlides,
    });

    dispatch({
      log: 'StaticViewport - on mount & update for totalSlides, visibleSlides',
      type: ActionTypes.FIRST_RENDER,
      payload: {
        slideSize,
        slideTraySize,
        currentVisibleSlides,
      },
    });
  }, [totalSlides, visibleSlides]);

  // currentSlide changed
  useEffect(() => {
    const scrollOptions: ScrollToOptions = {
      [orientation === 'horizontal' ? 'left' : 'top']:
        (slideSize ?? 0) * (currentSlide ?? 0),
      behavior: 'smooth',
    };
    viewportRef?.current?.scrollTo(scrollOptions);
  }, [currentSlide, trayRef]);

  // scroll start
  useEffect(() => {
    const handleScrollStart = () => {
      if (!isScrolling) {
        dispatch({
          log: 'StaticViewport - scroll start',
          type: ActionTypes.SCROLL_START,
        });
      }
    };
    const el = viewportRef.current;
    if (el) el.addEventListener('scroll', handleScrollStart);
    return () => {
      el?.removeEventListener('scroll', handleScrollStart);
    };
  }, [viewportRef, dispatch, isScrolling]);

  // scroll end
  useEffect(() => {
    const handleScrollEnd = () => {
      const { scrollLeft, scrollTop } = viewportRef.current ?? {};
      dispatch({
        log: 'StaticViewport - scroll end',
        type: ActionTypes.SCROLL_END,
        payload: {
          orientation,
          scrollLeft,
          scrollTop,
          slideSize,
          visibleSlides,
        },
      });
    };
    const el = viewportRef.current;
    if (el) el.addEventListener('scrollend', handleScrollEnd);
    return () => {
      el?.removeEventListener('scrollend', handleScrollEnd);
    };
  }, [viewportRef, orientation, slideSize, visibleSlides]);

  // viewport styles
  const viewportStyle = useMemo<React.CSSProperties>(() => {
    const x: React.CSSProperties = {};
    x[orientation === 'horizontal' ? 'width' : 'height'] =
      (slideSize ?? 0) * (visibleSlides ?? 0);
    return { ...x, ...style };
  }, [orientation, slideSize, visibleSlides, style]);

  // tray styles
  const trayStyle = useMemo<React.CSSProperties>(() => {
    return {
      [orientation === 'horizontal' ? 'width' : 'height']: slideTraySize,
      ...styleTray,
    };
  }, [orientation, slideTraySize]);

  // html
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
