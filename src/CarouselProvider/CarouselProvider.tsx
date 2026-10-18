import * as React from "react";
import { useEffect, useRef, useState } from "react";
import Context from "./context";
import { Store } from "../Store/Store";
import { cn } from "../helpers";
import { defaultProps, slideSize, slideTraySize } from "../helpers/component-config";
import type {
  CarouselProviderProps,
  CarouselStoreInterface,
  MutableCarouselStatePatch,
} from "../types";

const CarouselProvider = (props: CarouselProviderProps) => {
  const {
    children,
    className = undefined,
    currentSlide = defaultProps.currentSlide,
    disableAnimation = defaultProps.disableAnimation,
    disableKeyboard = defaultProps.disableKeyboard,
    hasMasterSpinner = defaultProps.hasMasterSpinner,
    infinite = defaultProps.infinite,
    interval = defaultProps.interval,
    isIntrinsicHeight = defaultProps.isIntrinsicHeight,
    isPageScrollLocked = defaultProps.isPageScrollLocked,
    isPlaying = defaultProps.isPlaying,
    lockOnWindowScroll = defaultProps.lockOnWindowScroll,
    naturalSlideHeight,
    naturalSlideWidth,
    orientation = defaultProps.orientation,
    playDirection = defaultProps.playDirection,
    step = defaultProps.step,
    dragStep = defaultProps.dragStep,
    tag: Tag = defaultProps.tag,
    totalSlides,
    touchEnabled = defaultProps.touchEnabled,
    dragEnabled = defaultProps.dragEnabled,
    visibleSlides = defaultProps.visibleSlides,
    ...restProps
  } = props;

  const {
    preventVerticalScrollOnTouch: _preventVerticalScrollOnTouch,
    horizontalPixelThreshold: _horizontalPixelThreshold,
    verticalPixelThreshold: _verticalPixelThreshold,
    ...filteredProps
  } = restProps as typeof restProps & {
    preventVerticalScrollOnTouch?: unknown;
    horizontalPixelThreshold?: unknown;
    verticalPixelThreshold?: unknown;
  };

  if (isIntrinsicHeight && orientation !== "horizontal") {
    throw new Error(
      'isIntrinsicHeight can only be used in "horizontal" orientation. See Readme for more information.',
    );
  }

  const [, setCarouselVersion] = useState(0);
  const [store] = useState(
    () =>
      new Store(
        {
          currentSlide,
          disableAnimation,
          disableKeyboard,
          hasMasterSpinner,
          imageErrorCount: 0,
          imageSuccessCount: 0,
          infinite,
          interval,
          isIntrinsicHeight,
          isPageScrollLocked,
          isPlaying,
          lockOnWindowScroll,
          masterSpinnerFinished: false,
          naturalSlideHeight,
          naturalSlideWidth,
          orientation,
          playDirection,
          privateUnDisableAnimation: false,
          slideSize: slideSize(totalSlides, visibleSlides),
          slideTraySize: slideTraySize(totalSlides, visibleSlides),
          step,
          dragStep,
          totalSlides,
          touchEnabled,
          dragEnabled,
          visibleSlides,
        },
        () => {
          setCarouselVersion((v) => v + 1);
        },
      ),
  );

  const prevPropsRef = useRef({
    currentSlide,
    disableAnimation,
    disableKeyboard,
    hasMasterSpinner,
    infinite,
    interval,
    isIntrinsicHeight,
    isPlaying,
    lockOnWindowScroll,
    naturalSlideHeight,
    naturalSlideWidth,
    orientation,
    playDirection,
    step,
    dragStep,
    totalSlides,
    touchEnabled,
    dragEnabled,
    visibleSlides,
  });

  useEffect(() => {
    const prevProps = prevPropsRef.current;
    const newState: MutableCarouselStatePatch = {};

    if (prevProps.totalSlides !== totalSlides || prevProps.visibleSlides !== visibleSlides) {
      newState.totalSlides = totalSlides;
      newState.visibleSlides = visibleSlides;
      newState.slideSize = slideSize(totalSlides, visibleSlides);
      newState.slideTraySize = slideTraySize(totalSlides, visibleSlides);

      if (store.state.currentSlide + visibleSlides > totalSlides) {
        newState.currentSlide = Math.max(totalSlides - visibleSlides, 0);
      }
    }

    if (prevProps.currentSlide !== currentSlide) {
      newState.currentSlide = Math.min(currentSlide, Math.max(totalSlides - 1, 0));
      newState.disableAnimation = true;
      newState.privateUnDisableAnimation = true;
    }

    const syncedProps = {
      disableAnimation,
      disableKeyboard,
      dragEnabled,
      dragStep,
      hasMasterSpinner,
      infinite,
      interval,
      isIntrinsicHeight,
      isPlaying,
      lockOnWindowScroll,
      naturalSlideHeight,
      naturalSlideWidth,
      orientation,
      playDirection,
      step,
      touchEnabled,
    } as const;

    (Object.keys(syncedProps) as Array<keyof typeof syncedProps>).forEach((propName) => {
      if (prevProps[propName] !== syncedProps[propName]) {
        (newState as Record<string, unknown>)[propName] = syncedProps[propName];
      }
    });

    prevPropsRef.current = {
      currentSlide,
      disableAnimation,
      disableKeyboard,
      hasMasterSpinner,
      infinite,
      interval,
      isIntrinsicHeight,
      isPlaying,
      lockOnWindowScroll,
      naturalSlideHeight,
      naturalSlideWidth,
      orientation,
      playDirection,
      step,
      dragStep,
      totalSlides,
      touchEnabled,
      dragEnabled,
      visibleSlides,
    };

    if (Object.keys(newState).length > 0) {
      store.setStoreState(newState);
    }
  }, [
    currentSlide,
    disableAnimation,
    disableKeyboard,
    dragEnabled,
    dragStep,
    hasMasterSpinner,
    infinite,
    interval,
    isIntrinsicHeight,
    isPlaying,
    lockOnWindowScroll,
    naturalSlideHeight,
    naturalSlideWidth,
    orientation,
    playDirection,
    step,
    store,
    totalSlides,
    touchEnabled,
    visibleSlides,
  ]);

  useEffect(
    () => () => {
      store.unsubscribeAllMasterSpinner();
    },
    [store],
  );

  // Create a fresh context value reference on each render so React Context
  // automatically triggers re-renders on all useContext(CarouselContext) consumers.
  const contextValue: CarouselStoreInterface = {
    get state() {
      return store.state;
    },
    getStoreState: store.getStoreState,
    setStoreState: store.setStoreState,
    subscribe: store.subscribe,
    unsubscribe: store.unsubscribe,
    updateSubscribers: store.updateSubscribers,
    subscribeMasterSpinner: store.subscribeMasterSpinner,
    unsubscribeMasterSpinner: store.unsubscribeMasterSpinner,
    unsubscribeAllMasterSpinner: store.unsubscribeAllMasterSpinner,
    masterSpinnerSuccess: store.masterSpinnerSuccess,
    masterSpinnerError: store.masterSpinnerError,
    isMasterSpinnerFinished: store.isMasterSpinnerFinished,
    get masterSpinnerSubscriptions() {
      return store.masterSpinnerSubscriptions;
    },
    get subscriptions() {
      return store.subscriptions;
    },
    masterStore: store,
  };

  const newClassName = cn(["carousel", className]);
  const ElementTag = Tag as React.ElementType;

  return (
    <ElementTag className={newClassName} {...filteredProps}>
      <Context.Provider value={contextValue}>{children}</Context.Provider>
    </ElementTag>
  );
};

export default CarouselProvider;
