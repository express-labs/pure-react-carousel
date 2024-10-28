import React, { useMemo, useReducer } from 'react';
import {
  computeSlidesRemaining,
  computeCurrentVisibleSlides,
  responsiveSlideSize,
  responsiveSlideTraySize,
} from '../helpers';
import {
  type CarouselStore,
  type ActionDispatch,
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
  CarouselActionContextProps,
} from './CarouselContext';

export type CarouselProviderProps = React.ComponentPropsWithoutRef<'div'> & {
  animations?: boolean;
  children?: React.ReactElement;
  className?: string;
  dragStep?: number;
  infinite?: boolean;
  infiniteSlideShow?: boolean;
  interval?: number;
  keyboard?: boolean;
  naturalSlideHeight?: number;
  naturalSlideWidth?: number;
  orientation?: 'horizontal' | 'vertical';
  play?: boolean;
  playDirection?: 'right' | 'left' | 'up' | 'down';
  responsive?: boolean;
  scrollLockParent?: boolean;
  scrollLockWindow?: boolean;
  slide?: number;
  slideHeight?: number;
  slideWidth?: number;
  step?: number;
  totalSlides?: number;
  visibleSlides?: number;
};

function updateSlidePosition(
  state: CarouselStore,
  payload: Partial<CarouselStore>
): [number, number, number[]] {
  const [slidesRemainingBackward, slidesRemainingForward] =
    computeSlidesRemaining(
      payload.currentSlide,
      state.totalSlides,
      state.visibleSlides
    );

  const currentVisibleSlides = computeCurrentVisibleSlides(
    payload.currentSlide,
    state.totalSlides,
    state.visibleSlides
  );

  return [
    slidesRemainingBackward,
    slidesRemainingForward,
    currentVisibleSlides,
  ];
}

function reducer(state: CarouselStore, action: ActionDispatch): CarouselStore {
  Object.freeze(state);
  const { type, payload = {} } = action;
  switch (type) {
    case ActionTypes.BTN_ONCLICK: {
      const [
        slidesRemainingBackward,
        slidesRemainingForward,
        currentVisibleSlides,
      ] = updateSlidePosition(state, payload);
      return {
        ...state,
        currentSlide: payload.currentSlide,
        currentVisibleSlides,
        isPlaying: false,
        slidesRemainingForward,
        slidesRemainingBackward,
      };
    }
    case ActionTypes.BTN_PLAY: {
      return {
        ...state,
        isPlaying: true,
      };
    }
    case ActionTypes.SCROLL_START: {
      return {
        ...state,
        isPlaying: false,
      };
    }
    case ActionTypes.SCROLL_END: {
      const [
        slidesRemainingBackward,
        slidesRemainingForward,
        currentVisibleSlides,
      ] = updateSlidePosition(state, payload);
      return {
        ...state,
        slidesRemainingBackward,
        slidesRemainingForward,
        currentVisibleSlides,
      };
    }
    default:
      return { ...state };
  }
}

const CarouselProvider = (props: CarouselProviderProps) => {
  const {
    animations: isAnimationEnabled = true,
    children,
    className,
    dragStep = 1,
    infinite: isInfinite = false,
    interval = 5000,
    keyboard: isKeyboardEnabled = true,
    orientation = 'horizontal',
    play: isPlaying = false,
    playDirection = 'right',
    responsive: isResponsive = false,
    scrollLockWindow: isScrollLockWindow = true,
    scrollLockParent: isScrollLockParent = true,
    slide: currentSlide = 0,
    slideHeight = 0,
    slideWidth = 0,
    step = 1,
    totalSlides = 0,
    visibleSlides = 0,
  } = props;

  let slideSize: number, slideTraySize: number;

  if (isResponsive) {
    slideSize = responsiveSlideSize(totalSlides, visibleSlides);
    slideTraySize = responsiveSlideTraySize(totalSlides, visibleSlides);
  } else {
    slideSize = orientation === 'horizontal' ? slideWidth : slideHeight;
    slideTraySize = slideSize * totalSlides;
  }

  const currentVisibleSlides = computeCurrentVisibleSlides(
    currentSlide,
    visibleSlides,
    totalSlides
  );

  const initialStoreState: CarouselStore = useMemo(
    (): CarouselStore => ({
      currentSlide,
      currentVisibleSlides,
      dragStep,
      interval,
      isAnimationEnabled,
      isInfinite,
      isKeyboardEnabled,
      isPlaying,
      isResponsive,
      isScrollLockParent,
      isScrollLockWindow,
      orientation,
      playDirection,
      slideSize,
      slideTraySize,
      step,
      totalSlides,
      visibleSlides,
    }),
    Object.keys(props)
  );

  const [state, dispatch] = useReducer(reducer, initialStoreState);

  const initialActionsState: CarouselActionContextProps = useMemo(
    (): CarouselActionContextProps => ({
      dispatch,
    }),
    [dispatch]
  );

  if (!totalSlides || !visibleSlides) {
    return null;
  }

  return (
    <div className={className}>
      <CarouselStoreContext.Provider value={state}>
        <CarouselActionContext.Provider value={initialActionsState}>
          {children}
        </CarouselActionContext.Provider>
      </CarouselStoreContext.Provider>
    </div>
  );
};

export default CarouselProvider;
