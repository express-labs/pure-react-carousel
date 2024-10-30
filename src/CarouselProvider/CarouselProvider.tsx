import React, { useEffect, useMemo, useReducer } from 'react';

import {
  type CarouselStore,
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
  type CarouselActionContextProps,
} from './CarouselContext';
import { reducer } from './CarouselState';

export type CarouselProviderProps = React.ComponentPropsWithoutRef<'div'> & {
  animations?: boolean;
  children?: React.ReactNode;
  className?: string;
  dragStep?: number;
  infinite?: boolean;
  infiniteSlideShow?: boolean;
  interval?: number;
  keyboard?: boolean;
  naturalSlideHeight?: number;
  naturalSlideWidth?: number;
  play?: boolean;
  playDirection?: 'right' | 'left' | 'up' | 'down';
  orientation?: 'horizontal' | 'vertical';
  responsive?: boolean;
  scrollLockParent?: boolean;
  scrollLockWindow?: boolean;
  slide?: number;
  step?: number;
  totalSlides: number;
  visibleSlides: number;
};

const CarouselProvider = (props: CarouselProviderProps) => {
  const {
    children,
    className,
    dragStep = 1,
    infinite: isInfinite = false,
    interval = 5000,
    play: isPlaying = false,
    playDirection = 'right',
    scrollLockWindow: isScrollLockWindow = true,
    scrollLockParent: isScrollLockParent = true,
    slide: currentSlide = 0,
    step = 1,
    totalSlides = 0,
    visibleSlides = 0,
    orientation = 'horizontal',
    ...restProps
  } = props;

  const initialStoreState: CarouselStore = useMemo(
    (): CarouselStore => ({
      currentSlide,
      currentVisibleSlides: [],
      dragStep,
      interval,
      isInfinite,
      isPlaying,
      isScrolling: false,
      isScrollLockParent,
      isScrollLockWindow,
      orientation,
      playDirection,
      step,
      totalSlides,
      visibleSlides,
    }),
    [
      currentSlide,
      dragStep,
      interval,
      isInfinite,
      isPlaying,
      isScrollLockParent,
      isScrollLockWindow,
      orientation,
      playDirection,
      step,
      totalSlides,
      visibleSlides,
    ]
  );

  const [state, dispatch] = useReducer(reducer, initialStoreState);

  const initialActionsState: CarouselActionContextProps =
    useMemo((): CarouselActionContextProps => {
      return {
        dispatch,
      };
    }, [dispatch]);

  if (!totalSlides || !visibleSlides) {
    return null;
  }

  useEffect(() => {
    dispatch({
      log: 'CarouselProvider',
      type: ActionTypes.FIRST_RENDER,
      payload: {
        className,
        currentSlide,
        dragStep,
        interval,
        isInfinite,
        isPlaying,
        isScrollLockParent,
        isScrollLockWindow,
        orientation,
        playDirection,
        step,
        totalSlides,
        visibleSlides,
      },
    });
  }, [
    className,
    currentSlide,
    dragStep,
    interval,
    isInfinite,
    isPlaying,
    isScrollLockParent,
    isScrollLockWindow,
    orientation,
    playDirection,
    step,
    totalSlides,
    visibleSlides,
  ]);

  return (
    <div className={className} {...restProps}>
      <CarouselStoreContext.Provider value={state}>
        <CarouselActionContext.Provider value={initialActionsState}>
          {children}
        </CarouselActionContext.Provider>
      </CarouselStoreContext.Provider>
    </div>
  );
};

export default CarouselProvider;
