import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import Spinner from "../Spinner";
import { cn, pct, slideTraySize as calcSlideTraySize } from "../helpers";
import type { NativeSliderViewProps } from "../types";
import s from "./NativeSlider.scss";

const NativeSlider = (props: NativeSliderViewProps) => {
  const {
    ariaLabel = "slider",
    backwardKeyCode = 37,
    carouselStore,
    children,
    className = null,
    classNameTray = null,
    classNameTrayWrap = null,
    currentSlide,
    disableAnimation = false,
    disableKeyboard = false,
    forwardKeyCode = 39,
    hasMasterSpinner = false,
    hideScrollbar = true,
    infinite = false,
    interval,
    isIntrinsicHeight = false,
    isPageScrollLocked: _isPageScrollLocked = false,
    isPlaying = false,
    lockOnWindowScroll: _lockOnWindowScroll = false,
    masterSpinnerFinished = false,
    naturalSlideHeight,
    naturalSlideWidth,
    onKeyDown = null,
    onMasterSpinner = null,
    orientation = "horizontal",
    pauseOnInteract = false,
    playDirection = "forward",
    privateUnDisableAnimation = false,
    role = "listbox",
    slideSize: _slideSize,
    slideTraySize: _slideTraySize,
    snapType = "mandatory",
    spinner = null,
    step,
    style = {},
    tabIndex = null,
    totalSlides,
    touchEnabled = true,
    trayProps = {},
    trayTag: TrayTag = "div",
    visibleSlides = 1,
    ...restProps
  } = props;

  const sliderElementRef = useRef<HTMLDivElement | null>(null);
  const trayWrapRef = useRef<HTMLDivElement | null>(null);
  const trayRef = useRef<HTMLElement | null>(null);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const programmaticTargetRef = useRef<number | null>(null);
  const lastObservedSlideRef = useRef<number>(currentSlide);
  const latestStateRef = useRef({
    carouselStore,
    currentSlide,
    isPlaying,
    pauseOnInteract,
    totalSlides,
    visibleSlides,
  });

  useEffect(() => {
    latestStateRef.current = {
      carouselStore,
      currentSlide,
      isPlaying,
      pauseOnInteract,
      totalSlides,
      visibleSlides,
    };
  }, [carouselStore, currentSlide, isPlaying, pauseOnInteract, totalSlides, visibleSlides]);

  const clearProgrammaticLockout = useCallback(() => {
    isProgrammaticScrollRef.current = false;
    programmaticTargetRef.current = null;
  }, []);

  const getSlideElements = useCallback((): HTMLElement[] => {
    const tray = trayRef.current;
    return tray ? Array.from(tray.querySelectorAll<HTMLElement>(".carousel__slide")) : [];
  }, []);

  const getSlideIndexFromElement = useCallback(
    (target: Element | null): number =>
      target ? getSlideElements().indexOf(target as HTMLElement) : -1,
    [getSlideElements],
  );

  const commitObservedSlide = useCallback((rawIndex: number) => {
    const {
      carouselStore: store,
      currentSlide: activeSlide,
      totalSlides: total,
      visibleSlides: visible,
    } = latestStateRef.current;
    const maxSlide = Math.max(0, total - visible);
    const clampedIndex = Math.min(Math.max(0, rawIndex), maxSlide);
    lastObservedSlideRef.current = clampedIndex;
    if (clampedIndex !== activeSlide) {
      store.setStoreState({ currentSlide: clampedIndex });
    }
  }, []);

  // Primary slide index tracking via IntersectionObserver
  useEffect(() => {
    const trayWrap = trayWrapRef.current;
    if (!trayWrap || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const slides = getSlideElements();
    const observer = new IntersectionObserver(
      (entries) => {
        let bestEntry: IntersectionObserverEntry | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        }
        if (!bestEntry) return;

        const slideIndex = getSlideIndexFromElement(bestEntry.target);
        if (slideIndex < 0) return;

        if (isProgrammaticScrollRef.current) {
          if (slideIndex === programmaticTargetRef.current) {
            clearProgrammaticLockout();
            lastObservedSlideRef.current = slideIndex;
          }
          return;
        }

        commitObservedSlide(slideIndex);
      },
      {
        root: trayWrap,
        threshold: [0.5, 0.75, 1.0],
      },
    );

    slides.forEach((slide) => observer.observe(slide));

    return () => {
      observer.disconnect();
    };
  }, [clearProgrammaticLockout, commitObservedSlide, getSlideElements, getSlideIndexFromElement]);

  // Progressive enhancement: scrollsnapchange and scrollend listeners
  useEffect(() => {
    const trayWrap = trayWrapRef.current;
    if (!trayWrap) return undefined;

    const handleScrollSnapChange = (ev: Event) => {
      if (snapType === "none") return;
      const snapEvent = ev as Event & {
        snapTargetInline?: Element | null;
        snapTargetBlock?: Element | null;
      };
      const targetElement =
        orientation === "vertical" ? snapEvent.snapTargetBlock : snapEvent.snapTargetInline;
      const slideIndex = getSlideIndexFromElement(targetElement ?? null);
      if (slideIndex < 0) return;

      if (isProgrammaticScrollRef.current) {
        if (slideIndex === programmaticTargetRef.current) {
          clearProgrammaticLockout();
          lastObservedSlideRef.current = slideIndex;
        }
        return;
      }

      commitObservedSlide(slideIndex);
    };

    const handleScrollEnd = () => {
      if (isProgrammaticScrollRef.current) {
        clearProgrammaticLockout();
        return;
      }

      const { totalSlides: total } = latestStateRef.current;
      if (total <= 0) return;

      if (orientation === "vertical") {
        const slideHeight = trayWrap.scrollHeight / total;
        if (slideHeight > 0) {
          commitObservedSlide(Math.round(trayWrap.scrollTop / slideHeight));
        }
      } else {
        const slideWidth = trayWrap.scrollWidth / total;
        if (slideWidth > 0) {
          commitObservedSlide(Math.round(trayWrap.scrollLeft / slideWidth));
        }
      }
    };

    trayWrap.addEventListener("scrollsnapchange", handleScrollSnapChange);
    trayWrap.addEventListener("scrollend", handleScrollEnd);

    return () => {
      trayWrap.removeEventListener("scrollsnapchange", handleScrollSnapChange);
      trayWrap.removeEventListener("scrollend", handleScrollEnd);
    };
  }, [
    orientation,
    snapType,
    clearProgrammaticLockout,
    commitObservedSlide,
    getSlideIndexFromElement,
  ]);

  // Two-way store sync: scroll natively when currentSlide changes externally
  useEffect(() => {
    if (currentSlide === lastObservedSlideRef.current) {
      return;
    }
    lastObservedSlideRef.current = currentSlide;

    const trayWrap = trayWrapRef.current;
    if (!trayWrap) return;

    const slides = getSlideElements();
    const targetSlide = slides[currentSlide];

    const targetLeft =
      orientation === "vertical"
        ? 0
        : (targetSlide?.offsetLeft ?? 0) > 0
          ? targetSlide.offsetLeft
          : (trayWrap.scrollWidth / totalSlides) * currentSlide;
    const targetTop =
      orientation === "vertical"
        ? (targetSlide?.offsetTop ?? 0) > 0
          ? targetSlide.offsetTop
          : (trayWrap.scrollHeight / totalSlides) * currentSlide
        : 0;

    isProgrammaticScrollRef.current = true;
    programmaticTargetRef.current = currentSlide;

    const behavior: ScrollBehavior = disableAnimation ? "instant" : "smooth";
    if (typeof trayWrap.scrollTo === "function") {
      trayWrap.scrollTo({
        top: targetTop,
        left: targetLeft,
        behavior,
      });
    } else {
      trayWrap.scrollTop = targetTop;
      trayWrap.scrollLeft = targetLeft;
    }
  }, [currentSlide, disableAnimation, orientation, totalSlides, getSlideElements]);

  // Reset privateUnDisableAnimation flag when set by store
  useEffect(() => {
    if (privateUnDisableAnimation) {
      carouselStore.setStoreState({
        disableAnimation: false,
        privateUnDisableAnimation: false,
      });
    }
  }, [privateUnDisableAnimation, carouselStore]);

  // Invoke onMasterSpinner callback while waiting for master spinner
  useEffect(() => {
    if (typeof onMasterSpinner === "function" && hasMasterSpinner && !masterSpinnerFinished) {
      onMasterSpinner();
    }
  }, [onMasterSpinner, hasMasterSpinner, masterSpinnerFinished]);

  // Autoplay timer
  useEffect(() => {
    if (isPlaying) {
      playTimerRef.current = setTimeout(() => {
        const maxSlide = Math.max(0, totalSlides - visibleSlides);
        if (playDirection === "forward") {
          if (currentSlide >= maxSlide) {
            carouselStore.setStoreState({ currentSlide: 0 });
          } else {
            carouselStore.setStoreState({
              currentSlide: Math.min(currentSlide + step, maxSlide),
            });
          }
        } else if (currentSlide === 0) {
          carouselStore.setStoreState({ currentSlide: maxSlide });
        } else {
          carouselStore.setStoreState({
            currentSlide: Math.max(currentSlide - step, 0),
          });
        }
      }, interval);
    }
    return () => {
      if (playTimerRef.current !== null) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
    };
  }, [
    isPlaying,
    currentSlide,
    interval,
    playDirection,
    totalSlides,
    visibleSlides,
    step,
    carouselStore,
  ]);

  const handleUserScrollInteract = () => {
    clearProgrammaticLockout();
    if (pauseOnInteract && isPlaying) {
      carouselStore.setStoreState({ isPlaying: false });
    }
  };

  const handleOnKeyDown = (ev: React.KeyboardEvent<HTMLDivElement>) => {
    if (disableKeyboard) return;
    const { keyCode } = ev;
    const maxSlide = Math.max(0, totalSlides - visibleSlides);
    const nextState: { currentSlide?: number; isPlaying?: boolean } = {};

    if (pauseOnInteract) {
      nextState.isPlaying = false;
    }

    if (keyCode === backwardKeyCode) {
      if (currentSlide === 0 && infinite) {
        nextState.currentSlide = maxSlide;
      } else {
        nextState.currentSlide = Math.max(0, currentSlide - 1);
      }
      carouselStore.setStoreState(nextState);
    }

    if (keyCode === forwardKeyCode) {
      if (currentSlide >= maxSlide && infinite) {
        nextState.currentSlide = 0;
      } else {
        nextState.currentSlide = Math.min(maxSlide, currentSlide + 1);
      }
      carouselStore.setStoreState(nextState);
    }

    if (typeof onKeyDown === "function") {
      onKeyDown(ev);
    }
  };

  const renderMasterSpinner = () => {
    if (!hasMasterSpinner || masterSpinnerFinished) return null;
    return (
      <div className={cn([s.masterSpinnerContainer, "carousel__master-spinner-container"])}>
        {spinner ? spinner() : <Spinner />}
      </div>
    );
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
  const trayWidthRatio = calcSlideTraySize(totalSlides, visibleSlides);
  if (isIntrinsicHeight) {
    trayStyle.display = "flex";
    trayStyle.alignItems = "stretch";
  }
  if (orientation === "vertical") {
    trayStyle.width = pct(100);
    trayStyle.flexDirection = "column";
  } else {
    trayStyle.width = pct(trayWidthRatio);
    trayStyle.flexDirection = "row";
  }

  const sliderClasses = cn([
    orientation === "vertical" ? s.verticalSlider : s.horizontalSlider,
    !touchEnabled && s.touchDisabled,
    "carousel__slider",
    "carousel__native-slider",
    orientation === "vertical" ? "carousel__slider--vertical" : "carousel__slider--horizontal",
    orientation === "vertical"
      ? "carousel__native-slider--vertical"
      : "carousel__native-slider--horizontal",
    className,
  ]);

  const snapTypeClasses =
    snapType === "proximity"
      ? [s.snapProximity, "carousel__native-slider-tray-wrapper--snap-proximity"]
      : snapType === "none"
        ? [s.snapNone, "carousel__native-slider-tray-wrapper--snap-none"]
        : [s.snapMandatory, "carousel__native-slider-tray-wrapper--snap-mandatory"];

  const trayWrapClasses = cn([
    s.trayWrap,
    orientation === "vertical" ? s.verticalSlideTrayWrap : s.horizontalSlideTrayWrap,
    ...snapTypeClasses,
    hideScrollbar && s.hideScrollbar,
    hideScrollbar && "carousel__native-slider-tray-wrapper--hide-scrollbar",
    disableAnimation ? s.instantScroll : s.smoothScroll,
    disableAnimation
      ? "carousel__native-slider-tray-wrapper--instant-scroll"
      : "carousel__native-slider-tray-wrapper--smooth-scroll",
    !touchEnabled && s.touchDisabled,
    "carousel__slider-tray-wrapper",
    "carousel__native-slider-tray-wrapper",
    orientation === "vertical"
      ? "carousel__slider-tray-wrap--vertical"
      : "carousel__slider-tray-wrap--horizontal",
    classNameTrayWrap,
  ]);

  const trayClasses = cn([
    s.sliderTray,
    "carousel__slider-tray",
    "carousel__native-slider-tray",
    orientation === "vertical" ? s.verticalTray : s.horizontalTray,
    orientation === "vertical"
      ? "carousel__slider-tray--vertical"
      : "carousel__slider-tray--horizontal",
    classNameTray,
  ]);

  const {
    className: _trayClassName,
    ref: _trayRefProp,
    style: _trayStyleProp,
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
      tabIndex={tabIndex ?? undefined}
      onKeyDown={handleOnKeyDown}
      {...restProps}
    >
      <div
        ref={trayWrapRef}
        className={trayWrapClasses}
        style={trayWrapStyle}
        onPointerDown={handleUserScrollInteract}
        onTouchStart={handleUserScrollInteract}
        onWheel={handleUserScrollInteract}
      >
        <TrayElement ref={trayRef} className={trayClasses} style={trayStyle} {...filteredTrayProps}>
          {children}
        </TrayElement>
        {renderMasterSpinner()}
      </div>
    </div>
  );
};

export default NativeSlider;
