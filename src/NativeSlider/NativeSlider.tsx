import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import Spinner from "../Spinner";
import { cn, pct, slideTraySize as calcSlideTraySize } from "../helpers";
import type { NativeSliderViewProps } from "../types";
import s from "./NativeSlider.scss";

const NativeSlider = React.forwardRef<HTMLDivElement, NativeSliderViewProps>((props, ref) => {
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
    trayWrapProps = {},
    visibleSlides = 1,
    ...restProps
  } = props;

  const sliderElementRef = useRef<HTMLDivElement | null>(null);
  const setSliderElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      sliderElementRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ref],
  );
  const trayWrapRef = useRef<HTMLDivElement | null>(null);
  const trayRef = useRef<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedSlidesRef = useRef<Set<HTMLElement>>(new Set());
  const slideRatiosRef = useRef<Map<Element, number>>(new Map());
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const programmaticTargetRef = useRef<number | null>(null);
  const pendingSnapSlideRef = useRef<number | null>(null);
  const lastObservedSlideRef = useRef<number>(0);
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
    pendingSnapSlideRef.current = null;
  }, []);

  const getSlideElements = useCallback((): HTMLElement[] => {
    const tray = trayRef.current;
    return tray ? Array.from(tray.querySelectorAll<HTMLElement>(".carousel__slide")) : [];
  }, []);

  const getSlideIndexFromElement = useCallback(
    (target: Element | null): number =>
      target ? getSlideElements().findIndex((slide) => slide === target) : -1,
    [getSlideElements],
  );

  const resolveSlideFromRatios = useCallback((): number => {
    const slideRatios = slideRatiosRef.current;
    if (slideRatios.size === 0) return -1;

    const slides = getSlideElements();
    const visibleCount = Math.max(1, latestStateRef.current.visibleSlides);
    let slideIndex = -1;
    let bestRatio = -1;

    slides.forEach((slide, idx) => {
      const ratio = slideRatios.get(slide);
      if (ratio !== undefined && (visibleCount > 1 ? slideIndex < 0 : ratio > bestRatio)) {
        slideIndex = idx;
        bestRatio = ratio;
      }
    });

    return slideIndex;
  }, [getSlideElements]);

  const isCenterSnapAligned = useCallback((slideElement?: Element | null): boolean => {
    if (slideElement) {
      if (slideElement.classList.contains("carousel__slide--snap-align-center")) {
        return true;
      }
      if (
        slideElement.classList.contains("carousel__slide--snap-align-start") ||
        slideElement.classList.contains("carousel__slide--snap-align-end") ||
        slideElement.classList.contains("carousel__slide--snap-align-none")
      ) {
        return false;
      }
    }
    const store = latestStateRef.current.carouselStore;
    const storeSnapAlign =
      typeof store.getStoreState === "function" ? store.getStoreState().snapAlign : undefined;
    return storeSnapAlign === "center";
  }, []);

  const resolveSnapTargetIndex = useCallback(
    (targetElement: Element | null): number => {
      const snappedIndex = getSlideIndexFromElement(targetElement);
      if (snappedIndex < 0 || !targetElement) return -1;

      const visibleCount = Math.max(1, latestStateRef.current.visibleSlides);
      if (visibleCount <= 1) return snappedIndex;

      if (slideRatiosRef.current.has(targetElement)) {
        return resolveSlideFromRatios();
      }

      if (isCenterSnapAligned(targetElement)) {
        return Math.max(0, snappedIndex - Math.floor(visibleCount / 2));
      }
      if (targetElement.classList.contains("carousel__slide--snap-align-end")) {
        return Math.max(0, snappedIndex - (visibleCount - 1));
      }
      return snappedIndex;
    },
    [getSlideIndexFromElement, isCenterSnapAligned, resolveSlideFromRatios],
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
    const storeSlide =
      typeof store.getStoreState === "function" ? store.getStoreState().currentSlide : activeSlide;
    if (clampedIndex !== activeSlide || clampedIndex !== storeSlide) {
      store.setStoreState({ currentSlide: clampedIndex });
    }
  }, []);

  // Primary slide index tracking via IntersectionObserver
  useEffect(() => {
    const trayWrap = trayWrapRef.current;
    if (!trayWrap || typeof IntersectionObserver === "undefined") {
      return undefined;
    }

    const observedSlides = observedSlidesRef.current;
    const slideRatios = slideRatiosRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const slides = getSlideElements();
        const visibleCount = Math.max(1, latestStateRef.current.visibleSlides);
        let hasValidSlideEntry = false;

        for (const entry of entries) {
          const idx = slides.findIndex((slide) => slide === entry.target);
          if (idx < 0) continue;
          hasValidSlideEntry = true;

          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            slideRatios.set(entry.target, entry.intersectionRatio);
            slideRatios.forEach((_, otherTarget) => {
              const otherIdx = slides.findIndex((slide) => slide === otherTarget);
              if (Math.abs(otherIdx - idx) >= visibleCount) {
                slideRatios.delete(otherTarget);
              }
            });
          } else {
            slideRatios.delete(entry.target);
          }
        }

        if (!hasValidSlideEntry) return;
        const slideIndex = resolveSlideFromRatios();
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
        threshold: [0, 0.5, 0.75, 1.0],
      },
    );

    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
      observedSlides.clear();
      slideRatios.clear();
    };
  }, [clearProgrammaticLockout, commitObservedSlide, getSlideElements, resolveSlideFromRatios]);

  // Synchronize observed slide elements when rendered slides change
  useEffect(() => {
    const observer = observerRef.current;
    if (!observer) return;

    const currentSlides = getSlideElements();
    const currentSlideSet = new Set(currentSlides);
    const observedSlides = observedSlidesRef.current;
    const slideRatios = slideRatiosRef.current;

    observedSlides.forEach((slide) => {
      if (!currentSlideSet.has(slide)) {
        observer.unobserve(slide);
        observedSlides.delete(slide);
        slideRatios.delete(slide);
      }
    });

    currentSlides.forEach((slide) => {
      if (!observedSlides.has(slide)) {
        observer.observe(slide);
        observedSlides.add(slide);
      }
    });
  });

  // Progressive enhancement: scrollsnapchange and scrollend listeners
  useEffect(() => {
    const trayWrap = trayWrapRef.current;
    if (!trayWrap) return undefined;

    const handleScrollSnapChange = (ev: Event) => {
      if (snapType === "none") return;
      const snapEvent: Event & {
        snapTargetInline?: Element | null;
        snapTargetBlock?: Element | null;
      } = ev;
      const targetElement =
        orientation === "vertical" ? snapEvent.snapTargetBlock : snapEvent.snapTargetInline;
      const slideIndex = resolveSnapTargetIndex(targetElement ?? null);
      if (slideIndex < 0) return;

      if (isProgrammaticScrollRef.current) {
        if (slideIndex === programmaticTargetRef.current) {
          clearProgrammaticLockout();
          lastObservedSlideRef.current = slideIndex;
        } else {
          pendingSnapSlideRef.current = slideIndex;
        }
        return;
      }

      commitObservedSlide(slideIndex);
    };

    const handleScrollEnd = () => {
      if (isProgrammaticScrollRef.current) {
        const pendingSnapSlide = pendingSnapSlideRef.current;
        clearProgrammaticLockout();
        if (pendingSnapSlide !== null) {
          commitObservedSlide(pendingSnapSlide);
          return;
        }
      }

      const ratioSlideIndex = resolveSlideFromRatios();
      if (ratioSlideIndex >= 0) {
        commitObservedSlide(ratioSlideIndex);
        return;
      }

      const { totalSlides: total, visibleSlides: visible } = latestStateRef.current;
      if (total <= 0) return;
      const visibleCount = Math.max(1, visible);
      const slides = getSlideElements();
      const snapCheckSlide =
        slides[Math.min(Math.floor(visibleCount / 2), slides.length - 1)] ?? slides[0];
      const useEvenCenterOffset =
        snapType !== "none" &&
        visibleCount > 1 &&
        visibleCount % 2 === 0 &&
        isCenterSnapAligned(snapCheckSlide);

      if (orientation === "vertical") {
        const slideHeight = trayWrap.scrollHeight / total;
        if (slideHeight > 0) {
          const adjustedScrollTop =
            useEvenCenterOffset && trayWrap.scrollTop > 0
              ? Math.max(0, trayWrap.scrollTop - 0.5 * slideHeight)
              : trayWrap.scrollTop;
          commitObservedSlide(Math.round(adjustedScrollTop / slideHeight));
        }
      } else {
        const slideWidth = trayWrap.scrollWidth / total;
        if (slideWidth > 0) {
          const adjustedScrollLeft =
            useEvenCenterOffset && trayWrap.scrollLeft > 0
              ? Math.max(0, trayWrap.scrollLeft - 0.5 * slideWidth)
              : trayWrap.scrollLeft;
          commitObservedSlide(Math.round(adjustedScrollLeft / slideWidth));
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
    getSlideElements,
    isCenterSnapAligned,
    resolveSlideFromRatios,
    resolveSnapTargetIndex,
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
    const visibleCount = Math.max(1, visibleSlides);
    const snapTargetSlide =
      slides[Math.min(currentSlide + Math.floor(visibleCount / 2), slides.length - 1)] ??
      targetSlide;
    const useEvenCenterOffset =
      snapType !== "none" &&
      visibleCount > 1 &&
      visibleCount % 2 === 0 &&
      currentSlide > 0 &&
      isCenterSnapAligned(snapTargetSlide);

    const slideWidth = totalSlides > 0 ? trayWrap.scrollWidth / totalSlides : 0;
    const slideHeight = totalSlides > 0 ? trayWrap.scrollHeight / totalSlides : 0;
    const baseLeft =
      (targetSlide?.offsetLeft ?? 0) > 0 ? targetSlide.offsetLeft : slideWidth * currentSlide;
    const baseTop =
      (targetSlide?.offsetTop ?? 0) > 0 ? targetSlide.offsetTop : slideHeight * currentSlide;
    const effectiveSlideWidth = slideWidth > 0 ? slideWidth : baseLeft / Math.max(1, currentSlide);
    const effectiveSlideHeight =
      slideHeight > 0 ? slideHeight : baseTop / Math.max(1, currentSlide);

    const targetLeft =
      orientation === "vertical"
        ? 0
        : baseLeft + (useEvenCenterOffset ? 0.5 * effectiveSlideWidth : 0);
    const targetTop =
      orientation === "vertical"
        ? baseTop + (useEvenCenterOffset ? 0.5 * effectiveSlideHeight : 0)
        : 0;

    slideRatiosRef.current.clear();
    pendingSnapSlideRef.current = null;
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
  }, [
    currentSlide,
    disableAnimation,
    orientation,
    snapType,
    totalSlides,
    visibleSlides,
    getSlideElements,
    isCenterSnapAligned,
  ]);

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
      ev.preventDefault();
      if (currentSlide === 0 && infinite) {
        nextState.currentSlide = maxSlide;
      } else {
        nextState.currentSlide = Math.max(0, currentSlide - 1);
      }
      carouselStore.setStoreState(nextState);
    }

    if (keyCode === forwardKeyCode) {
      ev.preventDefault();
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

  const {
    className: trayWrapPropsClassName,
    onPointerDown: trayWrapOnPointerDown,
    onTouchStart: trayWrapOnTouchStart,
    onWheel: trayWrapOnWheel,
    ref: _trayWrapRefProp,
    style: trayWrapPropsStyle,
    ...filteredTrayWrapProps
  } = trayWrapProps;

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
    trayWrapPropsClassName,
  ]);
  const mergedTrayWrapStyle: React.CSSProperties = {
    ...trayWrapStyle,
    ...trayWrapPropsStyle,
  };

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

  return (
    <div
      ref={setSliderElementRef}
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
        style={mergedTrayWrapStyle}
        onPointerDown={(ev: React.PointerEvent<HTMLDivElement>) => {
          handleUserScrollInteract();
          trayWrapOnPointerDown?.(ev);
        }}
        onTouchStart={(ev: React.TouchEvent<HTMLDivElement>) => {
          handleUserScrollInteract();
          trayWrapOnTouchStart?.(ev);
        }}
        onWheel={(ev: React.WheelEvent<HTMLDivElement>) => {
          handleUserScrollInteract();
          trayWrapOnWheel?.(ev);
        }}
        {...filteredTrayWrapProps}
      >
        {React.createElement(
          TrayTag,
          { ref: trayRef, className: trayClasses, style: trayStyle, ...filteredTrayProps },
          children,
        )}
        {renderMasterSpinner()}
      </div>
    </div>
  );
});

export default NativeSlider;
