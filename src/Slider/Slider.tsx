import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Spinner from "../Spinner";
import GetScrollParent from "./GetScrollParent";
import { cn, pct, boundedRange } from "../helpers";
import type { MutableCarouselStatePatch, Orientation, SliderViewProps } from "../types";
import s from "./Slider.scss";

export function slideSizeInPx(
  orientation: Orientation,
  sliderTrayWidth: number,
  sliderTrayHeight: number,
  totalSlides: number,
): number {
  return (orientation === "horizontal" ? sliderTrayWidth : sliderTrayHeight) / totalSlides;
}

export function slidesMoved(
  threshold: number,
  orientation: Orientation,
  deltaX: number,
  deltaY: number,
  slideSizePx: number,
  dragStep: number,
): number {
  const delta = orientation === "horizontal" ? deltaX : deltaY;
  const bigDrag = Math.abs(Math.round(delta / slideSizePx));
  const smallDrag = Math.abs(delta) >= slideSizePx * threshold ? dragStep : 0;
  const moved = Math.max(smallDrag, bigDrag);
  if (delta < 0) {
    return moved;
  }
  const retval = -moved;
  return retval === 0 ? 0 : retval;
}

interface SliderDragState {
  cancelNextClick: boolean;
  deltaX: number;
  deltaY: number;
  isBeingMouseDragged: boolean;
  isBeingTouchDragged: boolean;
  preventingVerticalScroll: boolean;
  startX: number;
  startY: number;
}

const Slider = (props: SliderViewProps) => {
  const {
    ariaLabel = "slider",
    backwardKeyCode = 37,
    carouselStore,
    children,
    className = null,
    classNameAnimation = null,
    classNameTray = null,
    classNameTrayWrap = null,
    currentSlide,
    disableAnimation = false,
    disableKeyboard = false,
    dragEnabled,
    dragStep = 1,
    forwardKeyCode = 39,
    hasMasterSpinner,
    infinite = false,
    interval = 5000,
    isIntrinsicHeight = false,
    isPageScrollLocked,
    isPlaying,
    lockOnWindowScroll,
    preventVerticalScrollOnTouch = true,
    horizontalPixelThreshold = 15,
    verticalPixelThreshold = 10,
    masterSpinnerFinished,
    moveThreshold = 0.1,
    naturalSlideHeight,
    naturalSlideWidth,
    onMasterSpinner = null,
    orientation,
    playDirection,
    privateUnDisableAnimation = false,
    role = "listbox",
    slideSize,
    slideTraySize,
    spinner = null,
    step,
    style = {},
    totalSlides,
    touchEnabled,
    trayProps = {},
    trayTag: TrayTag = "div",
    visibleSlides = 1,
    ...restProps
  } = props;

  const [dragState, setDragState] = useState<SliderDragState>({
    cancelNextClick: false,
    deltaX: 0,
    deltaY: 0,
    isBeingMouseDragged: false,
    isBeingTouchDragged: false,
    preventingVerticalScroll: false,
    startX: 0,
    startY: 0,
  });

  const dragStateRef = useRef<SliderDragState>(dragState);
  const updateDragState = useCallback(
    (updater: Partial<SliderDragState> | ((prev: SliderDragState) => Partial<SliderDragState>)) => {
      const patch = typeof updater === "function" ? updater(dragStateRef.current) : updater;
      const next = { ...dragStateRef.current, ...patch };
      dragStateRef.current = next;
      setDragState(next);
    },
    [],
  );

  const sliderElementRef = useRef<HTMLDivElement | null>(null);
  const sliderTrayElementRef = useRef<HTMLElement | null>(null);
  const rtlRef = useRef<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDocumentScrollingRef = useRef<boolean | null>(null);
  const moveTimerRef = useRef<number | null>(null);
  const originalOverflowRef = useRef<string | null>(null);
  const scrollParentRef = useRef<HTMLElement | Element | null>(null);
  const scrollStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const latestPropsRef = useRef({
    backwardKeyCode,
    carouselStore,
    currentSlide,
    disableKeyboard,
    dragEnabled,
    dragStep,
    forwardKeyCode,
    horizontalPixelThreshold,
    infinite,
    interval,
    isPageScrollLocked,
    isPlaying,
    lockOnWindowScroll,
    moveThreshold,
    orientation,
    playDirection,
    preventVerticalScrollOnTouch,
    privateUnDisableAnimation,
    step,
    totalSlides,
    touchEnabled,
    trayProps,
    verticalPixelThreshold,
    visibleSlides,
  });
  useEffect(() => {
    latestPropsRef.current = {
      backwardKeyCode,
      carouselStore,
      currentSlide,
      disableKeyboard,
      dragEnabled,
      dragStep,
      forwardKeyCode,
      horizontalPixelThreshold,
      infinite,
      interval,
      isPageScrollLocked,
      isPlaying,
      lockOnWindowScroll,
      moveThreshold,
      orientation,
      playDirection,
      preventVerticalScrollOnTouch,
      privateUnDisableAnimation,
      step,
      totalSlides,
      touchEnabled,
      trayProps,
      verticalPixelThreshold,
      visibleSlides,
    };
  });

  const getSliderRef = useCallback((el: HTMLElement | null) => {
    sliderTrayElementRef.current = el;
    if (el && typeof window !== "undefined") {
      const carouselElement = el.closest(".carousel");
      if (carouselElement) {
        rtlRef.current =
          window.getComputedStyle(carouselElement, null).getPropertyValue("direction") === "rtl";
      }
    }
  }, []);

  const forward = useCallback(() => {
    const {
      currentSlide: cur,
      step: st,
      totalSlides: tot,
      visibleSlides: vis,
    } = latestPropsRef.current;
    return Math.min(cur + st, tot - vis);
  }, []);

  const backward = useCallback(() => {
    const { currentSlide: cur, step: st } = latestPropsRef.current;
    return Math.max(cur - st, 0);
  }, []);

  const playForward = useCallback(() => {
    const { carouselStore: store, currentSlide: cur } = latestPropsRef.current;
    const next = forward();
    store.setStoreState({
      currentSlide: next === cur ? 0 : next,
    });
  }, [forward]);

  const playBackward = useCallback(() => {
    const {
      carouselStore: store,
      currentSlide: cur,
      totalSlides: tot,
      visibleSlides: vis,
    } = latestPropsRef.current;
    const prev = backward();
    store.setStoreState({
      currentSlide: prev === cur ? tot - vis : prev,
    });
  }, [backward]);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    stop();
    const { interval: intv } = latestPropsRef.current;
    intervalRef.current = setInterval(() => {
      if (latestPropsRef.current.playDirection === "forward") {
        playForward();
      } else {
        playBackward();
      }
    }, intv);
  }, [playBackward, playForward, stop]);

  const lockScroll = useCallback(() => {
    const getScrollParent = new GetScrollParent();
    scrollParentRef.current = getScrollParent.getScrollParent(sliderTrayElementRef.current);
    if (
      scrollParentRef.current &&
      "style" in scrollParentRef.current &&
      scrollParentRef.current.style
    ) {
      originalOverflowRef.current =
        originalOverflowRef.current || scrollParentRef.current.style.overflow;
      scrollParentRef.current.style.overflow = "hidden";
    }
  }, []);

  const unlockScroll = useCallback(() => {
    if (
      scrollParentRef.current &&
      "style" in scrollParentRef.current &&
      scrollParentRef.current.style
    ) {
      scrollParentRef.current.style.overflow = originalOverflowRef.current || "";
      originalOverflowRef.current = null;
      scrollParentRef.current = null;
    }
  }, []);

  const computeCurrentSlide = useCallback(() => {
    const {
      orientation: orient,
      totalSlides: tot,
      moveThreshold: thresh,
      dragStep: dStep,
      visibleSlides: vis,
      currentSlide: cur,
      infinite: inf,
      carouselStore: store,
    } = latestPropsRef.current;

    const trayEl = sliderTrayElementRef.current;
    const trayWidth = trayEl ? trayEl.clientWidth : 0;
    const trayHeight = trayEl ? trayEl.clientHeight : 0;

    const sizeInPx = slideSizeInPx(orient, trayWidth, trayHeight, tot);
    const moved = slidesMoved(
      thresh,
      orient,
      dragStateRef.current.deltaX,
      dragStateRef.current.deltaY,
      sizeInPx,
      dStep,
    );

    const maxSlide = tot - Math.min(tot, vis);

    let nextSlide = boundedRange({
      min: 0,
      max: maxSlide,
      x: cur + moved,
    });

    if (inf) {
      if (cur >= maxSlide && moved > 0) {
        nextSlide = 0;
      }
      if (cur === 0 && moved < 0) {
        nextSlide = maxSlide;
      }
    }

    store.setStoreState({
      currentSlide: nextSlide,
    });
  }, []);

  const fakeOnDragStart = useCallback(
    ({
      screenX,
      screenY,
      touchDrag = false,
      mouseDrag = false,
    }: {
      screenX: number;
      screenY: number;
      touchDrag?: boolean;
      mouseDrag?: boolean;
    }) => {
      const { carouselStore: store, orientation: orient } = latestPropsRef.current;

      store.setStoreState({
        isPlaying: false,
      });

      if (moveTimerRef.current !== null) {
        window.cancelAnimationFrame.call(window, moveTimerRef.current);
      }

      if (orient === "vertical") {
        store.setStoreState({
          isPageScrollLocked: true,
        });
      }

      updateDragState({
        isBeingTouchDragged: touchDrag,
        isBeingMouseDragged: mouseDrag,
        startX: screenX,
        startY: screenY,
      });
    },
    [updateDragState],
  );

  const fakeOnDragMove = useCallback(
    (screenX: number, screenY: number) => {
      if (moveTimerRef.current !== null) {
        window.cancelAnimationFrame.call(window, moveTimerRef.current);
      }
      moveTimerRef.current = window.requestAnimationFrame.call(window, () => {
        const { verticalPixelThreshold: vThresh, horizontalPixelThreshold: hThresh } =
          latestPropsRef.current;
        updateDragState((state) => ({
          deltaX: (screenX - state.startX) * (rtlRef.current ? -1 : 1),
          deltaY: screenY - state.startY,
          preventingVerticalScroll:
            Math.abs(screenY - state.startY) <= vThresh &&
            Math.abs(screenX - state.startX) >= hThresh,
        }));
      });
    },
    [updateDragState],
  );

  const fakeOnDragEnd = useCallback(() => {
    if (moveTimerRef.current !== null) {
      window.cancelAnimationFrame.call(window, moveTimerRef.current);
    }

    computeCurrentSlide();

    const {
      orientation: orient,
      carouselStore: store,
      lockOnWindowScroll: lockScrollOnWin,
    } = latestPropsRef.current;

    if (orient === "vertical") {
      store.setStoreState({
        isPageScrollLocked: false,
      });
    }

    updateDragState({
      deltaX: 0,
      deltaY: 0,
      isBeingTouchDragged: false,
      isBeingMouseDragged: false,
    });

    isDocumentScrollingRef.current = lockScrollOnWin ? false : null;
  }, [computeCurrentSlide, updateDragState]);

  const callCallback = useCallback((propName: string, ev: unknown) => {
    const { trayProps: tProps } = latestPropsRef.current;
    const handler = tProps ? (tProps as Record<string, unknown>)[propName] : undefined;
    if (typeof handler === "function") {
      if (
        ev &&
        typeof ev === "object" &&
        "persist" in ev &&
        typeof (ev as { persist?: () => void }).persist === "function"
      ) {
        (ev as { persist: () => void }).persist();
      }
      handler(ev);
    }
  }, []);

  const handleOnMouseDown = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      if (!latestPropsRef.current.dragEnabled) {
        callCallback("onMouseDown", ev);
        return;
      }
      ev.preventDefault();
      fakeOnDragStart({
        screenX: ev.screenX,
        screenY: ev.screenY,
        mouseDrag: true,
      });
      callCallback("onMouseDown", ev);
    },
    [callCallback, fakeOnDragStart],
  );

  const handleOnMouseMove = useCallback(
    (ev: MouseEvent) => {
      if (!dragStateRef.current.isBeingMouseDragged) return;
      updateDragState({ cancelNextClick: true });
      ev.preventDefault();
      fakeOnDragMove(ev.screenX, ev.screenY);
    },
    [fakeOnDragMove, updateDragState],
  );

  const handleOnMouseUp = useCallback(
    (ev: MouseEvent) => {
      if (!dragStateRef.current.isBeingMouseDragged) return;
      ev.preventDefault();
      fakeOnDragEnd();
    },
    [fakeOnDragEnd],
  );

  const handleOnClickCapture = useCallback(
    (ev: React.MouseEvent<HTMLElement>) => {
      if (!dragStateRef.current.cancelNextClick) {
        callCallback("onClickCapture", ev);
        return;
      }
      ev.preventDefault();
      updateDragState({ cancelNextClick: false });
      callCallback("onClickCapture", ev);
    },
    [callCallback, updateDragState],
  );

  const handleOnTouchStart = useCallback(
    (ev: React.TouchEvent<HTMLElement>) => {
      const { touchEnabled: tEnabled, orientation: orient } = latestPropsRef.current;
      if (!tEnabled) {
        callCallback("onTouchStart", ev);
        return;
      }

      if (orient === "vertical") {
        ev.preventDefault();
      }

      const touch = ev.targetTouches[0];
      if (touch) {
        fakeOnDragStart({
          screenX: touch.screenX,
          screenY: touch.screenY,
          touchDrag: true,
        });
      }
      callCallback("onTouchStart", ev);
    },
    [callCallback, fakeOnDragStart],
  );

  const handleDocumentScroll = useCallback(() => {
    if (!latestPropsRef.current.touchEnabled) return;
    isDocumentScrollingRef.current = true;
    if (scrollStopTimerRef.current !== null) {
      clearTimeout(scrollStopTimerRef.current);
    }
    scrollStopTimerRef.current = setTimeout(() => {
      isDocumentScrollingRef.current = false;
    }, 66);
  }, []);

  const handleOnTouchMove = useCallback(
    (ev: React.TouchEvent<HTMLElement>) => {
      const { touchEnabled: tEnabled, lockOnWindowScroll: lockWin } = latestPropsRef.current;
      if (!tEnabled || (lockWin && isDocumentScrollingRef.current)) {
        callCallback("onTouchMove", ev);
        return;
      }

      const touch = ev.targetTouches[0];
      if (touch) {
        fakeOnDragMove(touch.screenX, touch.screenY);
        callCallback("onTouchMove", ev);
      }
    },
    [callCallback, fakeOnDragMove],
  );

  const endTouchMove = useCallback(() => {
    if (!latestPropsRef.current.touchEnabled) return;
    fakeOnDragEnd();
  }, [fakeOnDragEnd]);

  const handleOnTouchEnd = useCallback(
    (ev: React.TouchEvent<HTMLElement>) => {
      endTouchMove();
      callCallback("onTouchEnd", ev);
    },
    [callCallback, endTouchMove],
  );

  const handleOnTouchCancel = useCallback(
    (ev: React.TouchEvent<HTMLElement>) => {
      endTouchMove();
      callCallback("onTouchCancel", ev);
    },
    [callCallback, endTouchMove],
  );

  const focus = useCallback(() => {
    if (sliderElementRef.current) {
      sliderElementRef.current.focus();
    }
  }, []);

  const handleOnKeyDown = useCallback(
    (ev: React.KeyboardEvent<HTMLDivElement>) => {
      const { keyCode } = ev;
      const {
        backwardKeyCode: backKey,
        carouselStore: store,
        currentSlide: cur,
        disableKeyboard: noKb,
        forwardKeyCode: fwdKey,
        totalSlides: tot,
        visibleSlides: vis,
      } = latestPropsRef.current;

      const newStoreState: MutableCarouselStatePatch = {};

      if (noKb === true || tot <= vis) return;

      if (keyCode === backKey) {
        ev.preventDefault();
        focus();
        newStoreState.currentSlide = Math.max(0, cur - 1);
        newStoreState.isPlaying = false;
      }

      if (keyCode === fwdKey) {
        ev.preventDefault();
        focus();
        newStoreState.currentSlide = Math.min(tot - vis, cur + 1);
        newStoreState.isPlaying = false;
      }

      store.setStoreState(newStoreState);
    },
    [focus],
  );

  const blockWindowScroll = useCallback((ev: TouchEvent) => {
    if (dragStateRef.current.preventingVerticalScroll) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
    }
  }, []);

  useEffect(() => {
    if (latestPropsRef.current.lockOnWindowScroll) {
      window.addEventListener("scroll", handleDocumentScroll, false);
    }
    if (
      latestPropsRef.current.touchEnabled ||
      latestPropsRef.current.preventVerticalScrollOnTouch
    ) {
      window.addEventListener("touchmove", blockWindowScroll, false);
    }
    document.documentElement.addEventListener("mouseleave", handleOnMouseUp, false);
    document.documentElement.addEventListener("mousemove", handleOnMouseMove, false);
    document.documentElement.addEventListener("mouseup", handleOnMouseUp, false);

    if (latestPropsRef.current.isPlaying) {
      play();
    }

    return () => {
      document.documentElement.removeEventListener("mouseleave", handleOnMouseUp, false);
      document.documentElement.removeEventListener("mousemove", handleOnMouseMove, false);
      document.documentElement.removeEventListener("mouseup", handleOnMouseUp, false);
      window.removeEventListener("scroll", handleDocumentScroll, false);
      window.removeEventListener("touchmove", blockWindowScroll, false);

      stop();
      if (moveTimerRef.current !== null) {
        window.cancelAnimationFrame.call(window, moveTimerRef.current);
      }
      if (scrollStopTimerRef.current !== null) {
        clearTimeout(scrollStopTimerRef.current);
      }

      isDocumentScrollingRef.current = null;
      moveTimerRef.current = null;
      scrollStopTimerRef.current = null;
    };
  }, [blockWindowScroll, handleDocumentScroll, handleOnMouseMove, handleOnMouseUp, play, stop]);

  const prevEffectsRef = useRef({
    isPlaying,
    playDirection,
    interval,
    isPageScrollLocked,
    privateUnDisableAnimation,
  });

  useEffect(() => {
    const prev = prevEffectsRef.current;
    if (
      (!prev.isPlaying && isPlaying) ||
      (isPlaying && (prev.playDirection !== playDirection || prev.interval !== interval))
    ) {
      play();
    }
    if (prev.isPlaying && !isPlaying) stop();
    if (!prev.isPageScrollLocked && isPageScrollLocked) lockScroll();
    if (prev.isPageScrollLocked && !isPageScrollLocked) unlockScroll();
    if (!prev.privateUnDisableAnimation && privateUnDisableAnimation) {
      carouselStore.setStoreState({
        privateUnDisableAnimation: false,
        disableAnimation: false,
      });
    }
    prevEffectsRef.current = {
      isPlaying,
      playDirection,
      interval,
      isPageScrollLocked,
      privateUnDisableAnimation,
    };
  }, [
    isPlaying,
    playDirection,
    interval,
    isPageScrollLocked,
    privateUnDisableAnimation,
    carouselStore,
    lockScroll,
    play,
    stop,
    unlockScroll,
  ]);

  const renderMasterSpinner = () => {
    if (hasMasterSpinner && !masterSpinnerFinished) {
      if (typeof onMasterSpinner === "function") onMasterSpinner();

      return (
        <div className={cn([s.masterSpinnerContainer, "carousel__master-spinner-container"])}>
          {spinner && spinner()}
          {!spinner && <Spinner />}
        </div>
      );
    }

    return null;
  };

  const sliderStyle: React.CSSProperties = { ...style };

  const trayWrapStyle: React.CSSProperties = {};
  if (orientation === "vertical") {
    trayWrapStyle.height = 0;
    trayWrapStyle.paddingBottom = pct(
      (naturalSlideHeight * 100 * visibleSlides) / naturalSlideWidth,
    );
    trayWrapStyle.width = pct(100);
  }

  const trayStyle: React.CSSProperties = {};
  const trans = pct(slideSize * currentSlide * -1);

  if (dragState.isBeingTouchDragged || dragState.isBeingMouseDragged || disableAnimation) {
    trayStyle.transition = "none";
  }

  if (isIntrinsicHeight) {
    trayStyle.display = "flex";
    trayStyle.alignItems = "stretch";
  }

  if (orientation === "vertical") {
    trayStyle.transform = `translateY(${trans}) translateY(${dragState.deltaY}px)`;
    trayStyle.width = pct(100);
    trayStyle.flexDirection = "column";
  } else {
    trayStyle.width = pct(slideTraySize);
    trayStyle.transform = `translateX(${trans}) translateX(${dragState.deltaX}px)`;
    trayStyle.flexDirection = "row";
  }

  const sliderClasses = cn([
    orientation === "vertical" ? s.verticalSlider : s.horizontalSlider,
    !touchEnabled && s.touchDisabled,
    "carousel__slider",
    orientation === "vertical" ? "carousel__slider--vertical" : "carousel__slider--horizontal",
    className,
  ]);

  const trayWrapClasses = cn([
    s.sliderTrayWrap,
    "carousel__slider-tray-wrapper",
    orientation === "vertical" ? s.verticalSlideTrayWrap : s.horizontalTrayWrap,
    orientation === "vertical"
      ? "carousel__slider-tray-wrap--vertical"
      : "carousel__slider-tray-wrap--horizontal",
    classNameTrayWrap,
  ]);

  const trayClasses = cn([
    s.sliderTray,
    classNameAnimation || s.sliderAnimation,
    "carousel__slider-tray",
    orientation === "vertical" ? s.verticalTray : s.horizontalTray,
    orientation === "vertical"
      ? "carousel__slider-tray--vertical"
      : "carousel__slider-tray--horizontal",
    classNameTray,
  ]);

  const {
    className: _ignoreClassName,
    onClickCapture: _onClickCapture,
    onMouseDown: _onMouseDown,
    onTouchCancel: _onTouchCancel,
    onTouchEnd: _onTouchEnd,
    onTouchMove: _onTouchMove,
    onTouchStart: _onTouchStart,
    ref: _ignoreRef,
    style: _ignoreStyle,
    ...filteredTrayProps
  } = trayProps;

  const TrayElement = TrayTag as React.ElementType;

  return (
    <div
      ref={sliderElementRef}
      className={sliderClasses}
      aria-live="polite"
      aria-label={ariaLabel}
      role={role}
      style={sliderStyle}
      onKeyDown={handleOnKeyDown}
      {...restProps}
    >
      <div className={trayWrapClasses} style={trayWrapStyle}>
        <TrayElement
          ref={getSliderRef}
          className={trayClasses}
          style={trayStyle}
          onTouchStart={handleOnTouchStart}
          onTouchMove={handleOnTouchMove}
          onTouchEnd={handleOnTouchEnd}
          onTouchCancel={handleOnTouchCancel}
          onMouseDown={handleOnMouseDown}
          onClickCapture={handleOnClickCapture}
          {...filteredTrayProps}
        >
          {children}
        </TrayElement>
        {renderMasterSpinner()}
      </div>
    </div>
  );
};

Slider.slideSizeInPx = slideSizeInPx;
Slider.slidesMoved = slidesMoved;

export default Slider;
