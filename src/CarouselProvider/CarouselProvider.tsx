import React, { useMemo, useReducer } from 'react';
import {
  computeSlidesRemaining,
  computeCurrentVisibleSlides,
} from '../helpers';
import {
  type CarouselStore,
  type ActionDispatch,
  ActionTypes,
  CarouselActionContext,
  CarouselStoreContext,
  type CarouselActionContextProps,
} from './CarouselContext';

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
  responsive?: boolean;
  scrollLockParent?: boolean;
  scrollLockWindow?: boolean;
  slide?: number;
  step?: number;
  totalSlides: number;
  visibleSlides: number;
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

  console.log(payload.currentSlide, state.visibleSlides, state.totalSlides);

  const currentVisibleSlides = computeCurrentVisibleSlides(
    payload.currentSlide,
    state.visibleSlides,
    state.totalSlides
  );

  console.log({
    slidesRemainingBackward,
    slidesRemainingForward,
    currentVisibleSlides,
  });

  return [
    slidesRemainingBackward,
    slidesRemainingForward,
    currentVisibleSlides,
  ];
}

function reducer(state: CarouselStore, action: ActionDispatch): CarouselStore {
  Object.freeze(state);
  const { type, payload = {} } = action;
  console.log(`Action "${type}":`, payload);

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
        isScrolling: true,
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
        isScrolling: false,
      };
    }
    case ActionTypes.UPDATE_SIZES: {
      return {
        ...state,
        slideSize: payload.slideSize,
        slideTraySize: payload.slideTraySize,
        orientation: payload.orientation,
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
    play: isPlaying = false,
    playDirection = 'right',
    responsive: isResponsive = false,
    scrollLockWindow: isScrollLockWindow = true,
    scrollLockParent: isScrollLockParent = true,
    slide: currentSlide = 0,
    step = 1,
    totalSlides = 0,
    visibleSlides = 0,
  } = props;

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
      isScrolling: false,
      isScrollLockParent,
      isScrollLockWindow,
      orientation: 'horizontal',
      playDirection,
      slideSize: 0,
      slideTraySize: 0,
      step,
      totalSlides,
      visibleSlides,
    }),
    Object.keys(props)
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
