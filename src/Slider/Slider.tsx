import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Spinner from "../Spinner";
import GetScrollParent from "./GetScrollParent";
import { cn, isInteractiveDescendant, pct, boundedRange } from "../helpers";
import type {
  MutableCarouselStatePatch,
  Orientation,
  SliderDragState,
  SliderViewProps,
} from "../types";
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

function hasPersist(value: unknown): value is { persist: () => void } {
  return (
    typeof value === "object" &&
    value !== null &&
    "persist" in value &&
    typeof value.persist === "function"
  );
}

const DEFAULT_DRAG_CLICK_THRESHOLD = 5;
const TOUCH_COMPAT_TAP_SLOP_PX = 10;
const TOUCH_COMPAT_MAX_DELAY_MS = 500;

const Slider = Object.assign(
  React.forwardRef<HTMLDivElement, SliderViewProps>((props, ref) => {
    const {
      ariaLabel,
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
      dragClickThreshold = DEFAULT_DRAG_CLICK_THRESHOLD,
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
      onKeyDown = null,
      onMasterSpinner = null,
      orientation,
      pauseOnInteract = true,
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
      trayWrapProps = {},
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
      (
        updater: Partial<SliderDragState> | ((prev: SliderDragState) => Partial<SliderDragState>),
      ) => {
        const patch = typeof updater === "function" ? updater(dragStateRef.current) : updater;
        const next = { ...dragStateRef.current, ...patch };
        dragStateRef.current = next;
        setDragState(next);
      },
      [],
    );

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
    const sliderTrayElementRef = useRef<HTMLElement | null>(null);
    const rtlRef = useRef<boolean>(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const isDocumentScrollingRef = useRef<boolean | null>(null);
    const moveTimerRef = useRef<number | null>(null);
    const originalOverflowRef = useRef<string | null>(null);
    const originalPaddingLeftRef = useRef<string | null>(null);
    const originalPaddingRightRef = useRef<string | null>(null);
    const originalWidthRef = useRef<string | null>(null);
    const originalMinWidthRef = useRef<string | null>(null);
    const scrollParentRef = useRef<HTMLElement | Element | null>(null);
    const scrollStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const clickGuardRef = useRef<{
      pendingTouchCompat: {
        screenX: number;
        screenY: number;
        timestamp: number;
      } | null;
      lastTouchPoint: { screenX: number; screenY: number };
      maxTouchDistance: number;
      touchPointerActive: boolean;
      keyboardActivation: boolean;
      lastMouseDownDetail: number;
      lastMouseDownWasTouchCompat: boolean;
    }>({
      pendingTouchCompat: null,
      lastTouchPoint: { screenX: 0, screenY: 0 },
      maxTouchDistance: 0,
      touchPointerActive: false,
      keyboardActivation: false,
      lastMouseDownDetail: 0,
      lastMouseDownWasTouchCompat: false,
    });

    const latestPropsRef = useRef({
      backwardKeyCode,
      carouselStore,
      currentSlide,
      disableKeyboard,
      dragClickThreshold,
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
      onKeyDown,
      orientation,
      pauseOnInteract,
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
        dragClickThreshold,
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
        onKeyDown,
        orientation,
        pauseOnInteract,
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
      const el = sliderTrayElementRef.current;
      if (el && typeof window !== "undefined") {
        const carouselElement = el.closest(".carousel");
        if (carouselElement) {
          rtlRef.current =
            window.getComputedStyle(carouselElement, null).getPropertyValue("direction") === "rtl";
        }
      }
    });

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
      const scrollParent = getScrollParent.getScrollParent(sliderTrayElementRef.current);
      scrollParentRef.current = scrollParent;
      if (scrollParent && "style" in scrollParent && scrollParent.style) {
        originalOverflowRef.current = scrollParent.style.overflow;
        const prevClientWidth = scrollParent.clientWidth;
        const prevClientLeft = scrollParent.clientLeft;
        scrollParent.style.overflow = "hidden";
        const scrollbarWidth = scrollParent.clientWidth - prevClientWidth;
        if (scrollbarWidth > 0) {
          const computedStyle = window.getComputedStyle(scrollParent, null);
          const widthBeforePadding = parseFloat(computedStyle.getPropertyValue("width")) || 0;
          const isLeftScrollbar = scrollParent.clientLeft < prevClientLeft;
          if (isLeftScrollbar) {
            originalPaddingLeftRef.current = scrollParent.style.paddingLeft;
            const computedPaddingLeft =
              parseFloat(computedStyle.getPropertyValue("padding-left")) || 0;
            scrollParent.style.paddingLeft = `${computedPaddingLeft + scrollbarWidth}px`;
          } else {
            originalPaddingRightRef.current = scrollParent.style.paddingRight;
            const computedPaddingRight =
              parseFloat(computedStyle.getPropertyValue("padding-right")) || 0;
            scrollParent.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`;
          }
          const widthAfterPadding = parseFloat(computedStyle.getPropertyValue("width")) || 0;
          const targetWidth = widthBeforePadding - scrollbarWidth;
          if (
            computedStyle.getPropertyValue("box-sizing") !== "border-box" &&
            targetWidth > 0 &&
            widthAfterPadding > targetWidth
          ) {
            originalWidthRef.current = scrollParent.style.width;
            scrollParent.style.width = `${targetWidth}px`;
            const minWidthValue = computedStyle.getPropertyValue("min-width");
            const shouldAdjustMinWidth = minWidthValue.endsWith("px")
              ? parseFloat(minWidthValue) > targetWidth
              : Boolean(minWidthValue && minWidthValue !== "auto");
            if (shouldAdjustMinWidth) {
              originalMinWidthRef.current = scrollParent.style.minWidth;
              scrollParent.style.minWidth = `${targetWidth}px`;
            }
          }
        }
      }
    }, []);

    const unlockScroll = useCallback(() => {
      if (
        scrollParentRef.current &&
        "style" in scrollParentRef.current &&
        scrollParentRef.current.style
      ) {
        scrollParentRef.current.style.overflow = originalOverflowRef.current || "";
        if (originalPaddingLeftRef.current !== null) {
          scrollParentRef.current.style.paddingLeft = originalPaddingLeftRef.current;
        }
        if (originalPaddingRightRef.current !== null) {
          scrollParentRef.current.style.paddingRight = originalPaddingRightRef.current;
        }
        if (originalWidthRef.current !== null) {
          scrollParentRef.current.style.width = originalWidthRef.current;
        }
        if (originalMinWidthRef.current !== null) {
          scrollParentRef.current.style.minWidth = originalMinWidthRef.current;
        }
        originalOverflowRef.current = null;
        originalPaddingLeftRef.current = null;
        originalPaddingRightRef.current = null;
        originalWidthRef.current = null;
        originalMinWidthRef.current = null;
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
        preserveCancelClick = false,
      }: {
        screenX: number;
        screenY: number;
        touchDrag?: boolean;
        mouseDrag?: boolean;
        preserveCancelClick?: boolean;
      }) => {
        const {
          carouselStore: store,
          isPlaying: playing,
          orientation: orient,
          pauseOnInteract: pauseOnInt,
        } = latestPropsRef.current;

        if (pauseOnInt) {
          store.setStoreState({
            isPlaying: false,
          });
        } else if (playing) {
          stop();
        }

        if (moveTimerRef.current !== null) {
          window.cancelAnimationFrame.call(window, moveTimerRef.current);
        }

        if (orient === "vertical") {
          store.setStoreState({
            isPageScrollLocked: true,
          });
        }

        clickGuardRef.current.keyboardActivation = false;

        updateDragState({
          cancelNextClick: preserveCancelClick ? dragStateRef.current.cancelNextClick : false,
          isBeingTouchDragged: touchDrag,
          isBeingMouseDragged: mouseDrag,
          startX: screenX,
          startY: screenY,
        });
      },
      [stop, updateDragState],
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
        isPlaying: playing,
        lockOnWindowScroll: lockScrollOnWin,
        pauseOnInteract: pauseOnInt,
      } = latestPropsRef.current;

      if (orient === "vertical") {
        store.setStoreState({
          isPageScrollLocked: false,
        });
      }

      if (!pauseOnInt && playing) {
        play();
      }

      updateDragState({
        deltaX: 0,
        deltaY: 0,
        isBeingTouchDragged: false,
        isBeingMouseDragged: false,
      });

      isDocumentScrollingRef.current = lockScrollOnWin ? false : null;
    }, [computeCurrentSlide, play, updateDragState]);

    const callCallback = useCallback(
      (propName: keyof NonNullable<SliderViewProps["trayProps"]>, ev: unknown) => {
        const { trayProps: tProps } = latestPropsRef.current;
        const handler: unknown = tProps ? tProps[propName] : undefined;
        if (typeof handler === "function") {
          if (hasPersist(ev)) {
            ev.persist();
          }
          handler(ev);
        }
      },
      [],
    );

    const classifyTouchCompatMouseDown = useCallback((ev: React.MouseEvent<HTMLElement>) => {
      const nativeMouseEv:
        | (MouseEvent & {
            sourceCapabilities?: { firesTouchEvents?: boolean };
          })
        | undefined = ev.nativeEvent;
      if (nativeMouseEv?.sourceCapabilities?.firesTouchEvents === false) {
        clickGuardRef.current.pendingTouchCompat = null;
      }
      const pendingTouchCompat = clickGuardRef.current.pendingTouchCompat;
      const isTouchCompatMouseDown =
        pendingTouchCompat !== null &&
        Date.now() - pendingTouchCompat.timestamp < TOUCH_COMPAT_MAX_DELAY_MS &&
        (nativeMouseEv?.sourceCapabilities?.firesTouchEvents === true ||
          Math.hypot(
            ev.screenX - pendingTouchCompat.screenX,
            ev.screenY - pendingTouchCompat.screenY,
          ) <= 1);
      clickGuardRef.current.pendingTouchCompat = null;
      return isTouchCompatMouseDown;
    }, []);

    const handleOnMouseDownCapture = useCallback(
      (ev: React.MouseEvent<HTMLElement>) => {
        clickGuardRef.current.lastMouseDownDetail = ev.detail;
        clickGuardRef.current.keyboardActivation = false;
        const isTouchCompatMouseDown = classifyTouchCompatMouseDown(ev);
        clickGuardRef.current.lastMouseDownWasTouchCompat = isTouchCompatMouseDown;
        if (!isTouchCompatMouseDown && dragStateRef.current.cancelNextClick) {
          updateDragState({ cancelNextClick: false });
        }
        callCallback("onMouseDownCapture", ev);
      },
      [callCallback, classifyTouchCompatMouseDown, updateDragState],
    );

    const handleOnMouseDown = useCallback(
      (ev: React.MouseEvent<HTMLElement>) => {
        clickGuardRef.current.lastMouseDownDetail = ev.detail;
        clickGuardRef.current.keyboardActivation = false;
        const isTouchCompatMouseDown =
          clickGuardRef.current.pendingTouchCompat !== null
            ? classifyTouchCompatMouseDown(ev)
            : clickGuardRef.current.lastMouseDownWasTouchCompat;
        clickGuardRef.current.lastMouseDownWasTouchCompat = false;

        if (!latestPropsRef.current.dragEnabled) {
          callCallback("onMouseDown", ev);
          return;
        }
        if (!isInteractiveDescendant(ev.target, ev.currentTarget)) {
          ev.preventDefault();
        }
        fakeOnDragStart({
          screenX: ev.screenX,
          screenY: ev.screenY,
          mouseDrag: true,
          preserveCancelClick: isTouchCompatMouseDown,
        });
        callCallback("onMouseDown", ev);
      },
      [callCallback, classifyTouchCompatMouseDown, fakeOnDragStart],
    );

    const handleOnMouseMove = useCallback(
      (ev: MouseEvent) => {
        if (!dragStateRef.current.isBeingMouseDragged) {
          const mouseEvWithCap: MouseEvent & {
            sourceCapabilities?: { firesTouchEvents?: boolean };
          } = ev;
          const pendingTouchCompat = clickGuardRef.current.pendingTouchCompat;
          if (
            pendingTouchCompat !== null &&
            mouseEvWithCap.sourceCapabilities?.firesTouchEvents !== true &&
            Math.hypot(
              ev.screenX - pendingTouchCompat.screenX,
              ev.screenY - pendingTouchCompat.screenY,
            ) > 1
          ) {
            clickGuardRef.current.pendingTouchCompat = null;
          }
          return;
        }
        if (
          Math.hypot(
            ev.screenX - dragStateRef.current.startX,
            ev.screenY - dragStateRef.current.startY,
          ) > latestPropsRef.current.dragClickThreshold
        ) {
          updateDragState({ cancelNextClick: true });
        }
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
        const isKeyboardClick =
          clickGuardRef.current.keyboardActivation ||
          (ev.detail === 0 && clickGuardRef.current.lastMouseDownDetail > 0);
        clickGuardRef.current.keyboardActivation = false;
        clickGuardRef.current.pendingTouchCompat = null;
        clickGuardRef.current.lastMouseDownWasTouchCompat = false;

        if (!dragStateRef.current.cancelNextClick || isKeyboardClick) {
          if (dragStateRef.current.cancelNextClick) {
            updateDragState({ cancelNextClick: false });
          }
          callCallback("onClickCapture", ev);
          return;
        }
        ev.preventDefault();
        ev.stopPropagation();
        updateDragState({ cancelNextClick: false });
        callCallback("onClickCapture", ev);
      },
      [callCallback, updateDragState],
    );

    const handleOnTouchStart = useCallback(
      (ev: React.TouchEvent<HTMLElement>) => {
        clickGuardRef.current.pendingTouchCompat = null;
        clickGuardRef.current.maxTouchDistance = 0;
        clickGuardRef.current.lastMouseDownDetail = 0;
        clickGuardRef.current.lastMouseDownWasTouchCompat = false;
        const { touchEnabled: tEnabled, orientation: orient } = latestPropsRef.current;
        if (!tEnabled) {
          if (dragStateRef.current.cancelNextClick) {
            updateDragState({ cancelNextClick: false });
          }
          callCallback("onTouchStart", ev);
          return;
        }

        if (orient === "vertical") {
          ev.preventDefault();
        }

        const touch = ev.targetTouches[0];
        if (touch) {
          clickGuardRef.current.lastTouchPoint = {
            screenX: touch.screenX,
            screenY: touch.screenY,
          };
          fakeOnDragStart({
            screenX: touch.screenX,
            screenY: touch.screenY,
            touchDrag: true,
          });
        }
        callCallback("onTouchStart", ev);
      },
      [callCallback, fakeOnDragStart, updateDragState],
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
          const distance = Math.hypot(
            touch.screenX - dragStateRef.current.startX,
            touch.screenY - dragStateRef.current.startY,
          );
          clickGuardRef.current.maxTouchDistance = Math.max(
            clickGuardRef.current.maxTouchDistance,
            distance,
          );
          clickGuardRef.current.lastTouchPoint = {
            screenX: touch.screenX,
            screenY: touch.screenY,
          };
          if (distance > latestPropsRef.current.dragClickThreshold) {
            updateDragState({ cancelNextClick: true });
          }
          fakeOnDragMove(touch.screenX, touch.screenY);
          callCallback("onTouchMove", ev);
        }
      },
      [callCallback, fakeOnDragMove, updateDragState],
    );

    const endTouchMove = useCallback(() => {
      if (!latestPropsRef.current.touchEnabled) return;
      fakeOnDragEnd();
    }, [fakeOnDragEnd]);

    const handleOnTouchEnd = useCallback(
      (ev: React.TouchEvent<HTMLElement>) => {
        const compatSlopLimit = clickGuardRef.current.touchPointerActive
          ? TOUCH_COMPAT_TAP_SLOP_PX
          : DEFAULT_DRAG_CLICK_THRESHOLD;
        clickGuardRef.current.touchPointerActive = false;

        const changedTouch = ev.changedTouches?.[0];
        if (
          changedTouch &&
          typeof changedTouch.screenX === "number" &&
          typeof changedTouch.screenY === "number"
        ) {
          clickGuardRef.current.lastTouchPoint = {
            screenX: changedTouch.screenX,
            screenY: changedTouch.screenY,
          };
          if (dragStateRef.current.isBeingTouchDragged) {
            const endDistance = Math.hypot(
              changedTouch.screenX - dragStateRef.current.startX,
              changedTouch.screenY - dragStateRef.current.startY,
            );
            clickGuardRef.current.maxTouchDistance = Math.max(
              clickGuardRef.current.maxTouchDistance,
              endDistance,
            );
            if (
              endDistance > latestPropsRef.current.dragClickThreshold &&
              !dragStateRef.current.cancelNextClick
            ) {
              updateDragState({ cancelNextClick: true });
            }
          }
        }

        if (
          latestPropsRef.current.touchEnabled &&
          dragStateRef.current.cancelNextClick &&
          clickGuardRef.current.maxTouchDistance <= compatSlopLimit
        ) {
          clickGuardRef.current.pendingTouchCompat = {
            screenX: clickGuardRef.current.lastTouchPoint.screenX,
            screenY: clickGuardRef.current.lastTouchPoint.screenY,
            timestamp: Date.now(),
          };
        } else {
          clickGuardRef.current.pendingTouchCompat = null;
        }
        endTouchMove();
        callCallback("onTouchEnd", ev);
      },
      [callCallback, endTouchMove, updateDragState],
    );

    const handleOnTouchCancel = useCallback(
      (ev: React.TouchEvent<HTMLElement>) => {
        clickGuardRef.current.touchPointerActive = false;
        clickGuardRef.current.pendingTouchCompat = null;
        clickGuardRef.current.lastMouseDownWasTouchCompat = false;
        if (dragStateRef.current.cancelNextClick) {
          updateDragState({ cancelNextClick: false });
        }
        endTouchMove();
        callCallback("onTouchCancel", ev);
      },
      [callCallback, endTouchMove, updateDragState],
    );

    const handleDocumentPointerDown = useCallback(
      (ev: PointerEvent) => {
        if (ev.pointerType === "touch") {
          clickGuardRef.current.touchPointerActive = true;
          clickGuardRef.current.pendingTouchCompat = null;
          clickGuardRef.current.lastMouseDownWasTouchCompat = false;
        } else if (ev.pointerType === "mouse" || ev.pointerType === "pen") {
          clickGuardRef.current.touchPointerActive = false;
          clickGuardRef.current.pendingTouchCompat = null;
          clickGuardRef.current.lastMouseDownWasTouchCompat = false;
          if (
            !dragStateRef.current.isBeingMouseDragged &&
            !dragStateRef.current.isBeingTouchDragged &&
            dragStateRef.current.cancelNextClick
          ) {
            updateDragState({ cancelNextClick: false });
          }
        }
      },
      [updateDragState],
    );

    const handleDocumentKeyDown = useCallback(
      (ev: KeyboardEvent) => {
        if (dragStateRef.current.isBeingMouseDragged || dragStateRef.current.isBeingTouchDragged) {
          return;
        }
        if (
          ev.key === "Enter" ||
          ev.key === " " ||
          ev.key === "Spacebar" ||
          ev.key === "Tab" ||
          ev.keyCode === 13 ||
          ev.keyCode === 32 ||
          ev.keyCode === 9
        ) {
          clickGuardRef.current.keyboardActivation = true;
          clickGuardRef.current.pendingTouchCompat = null;
          clickGuardRef.current.lastMouseDownWasTouchCompat = false;
          if (dragStateRef.current.cancelNextClick) {
            updateDragState({ cancelNextClick: false });
          }
        }
      },
      [updateDragState],
    );

    const handleOnKeyDown = useCallback(
      (ev: React.KeyboardEvent<HTMLDivElement>) => {
        const { keyCode } = ev;
        const {
          backwardKeyCode: backKey,
          carouselStore: store,
          currentSlide: cur,
          disableKeyboard: noKb,
          forwardKeyCode: fwdKey,
          isPlaying: playing,
          onKeyDown: userOnKeyDown,
          pauseOnInteract: pauseOnInt,
          totalSlides: tot,
          visibleSlides: vis,
        } = latestPropsRef.current;

        const isInteractiveTarget = isInteractiveDescendant(ev.target, ev.currentTarget);

        if (!ev.defaultPrevented && !isInteractiveTarget && noKb !== true && tot > vis) {
          const newStoreState: MutableCarouselStatePatch = {};

          if (keyCode === backKey) {
            ev.preventDefault();
            newStoreState.currentSlide = Math.max(0, cur - 1);
            if (pauseOnInt) {
              newStoreState.isPlaying = false;
            } else if (playing) {
              play();
            }
            store.setStoreState(newStoreState);
          }

          if (keyCode === fwdKey) {
            ev.preventDefault();
            newStoreState.currentSlide = Math.min(tot - vis, cur + 1);
            if (pauseOnInt) {
              newStoreState.isPlaying = false;
            } else if (playing) {
              play();
            }
            store.setStoreState(newStoreState);
          }
        }

        if (typeof userOnKeyDown === "function") {
          userOnKeyDown(ev);
        }
      },
      [play],
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
      document.documentElement.addEventListener("pointerdown", handleDocumentPointerDown, true);
      document.documentElement.addEventListener("keydown", handleDocumentKeyDown, true);
      document.documentElement.addEventListener("mouseleave", handleOnMouseUp, false);
      document.documentElement.addEventListener("mousemove", handleOnMouseMove, false);
      document.documentElement.addEventListener("mouseup", handleOnMouseUp, false);

      if (latestPropsRef.current.isPlaying) {
        play();
      }

      return () => {
        document.documentElement.removeEventListener(
          "pointerdown",
          handleDocumentPointerDown,
          true,
        );
        document.documentElement.removeEventListener("keydown", handleDocumentKeyDown, true);
        document.documentElement.removeEventListener("mouseleave", handleOnMouseUp, false);
        document.documentElement.removeEventListener("mousemove", handleOnMouseMove, false);
        document.documentElement.removeEventListener("mouseup", handleOnMouseUp, false);
        window.removeEventListener("scroll", handleDocumentScroll, false);
        window.removeEventListener("touchmove", blockWindowScroll, false);

        stop();
        unlockScroll();
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
    }, [
      blockWindowScroll,
      handleDocumentKeyDown,
      handleDocumentPointerDown,
      handleDocumentScroll,
      handleOnMouseMove,
      handleOnMouseUp,
      play,
      stop,
      unlockScroll,
    ]);

    const prevEffectsRef = useRef({
      currentSlide,
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
        (isPlaying &&
          (prev.playDirection !== playDirection ||
            prev.interval !== interval ||
            prev.currentSlide !== currentSlide))
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
        currentSlide,
        isPlaying,
        playDirection,
        interval,
        isPageScrollLocked,
        privateUnDisableAnimation,
      };
    }, [
      currentSlide,
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

    const dragX = disableAnimation ? 0 : dragState.deltaX;
    const dragY = disableAnimation ? 0 : dragState.deltaY;

    if (orientation === "vertical") {
      trayStyle.transform = `translateY(${trans}) translateY(${dragY}px)`;
      trayStyle.width = pct(100);
      trayStyle.flexDirection = "column";
    } else {
      trayStyle.width = pct(slideTraySize);
      trayStyle.transform = `translateX(${trans}) translateX(${dragX}px)`;
      trayStyle.flexDirection = "row";
    }

    const sliderClasses = cn([
      orientation === "vertical" ? s.verticalSlider : s.horizontalSlider,
      !touchEnabled && s.touchDisabled,
      "carousel__slider",
      orientation === "vertical" ? "carousel__slider--vertical" : "carousel__slider--horizontal",
      className,
    ]);

    const {
      className: trayWrapPropsClassName,
      ref: _ignoreTrayWrapRef,
      style: trayWrapPropsStyle,
      ...filteredTrayWrapProps
    } = trayWrapProps;

    const trayWrapClasses = cn([
      "carousel__slider-tray-wrapper",
      orientation === "vertical" && s.verticalSlideTrayWrap,
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
      onMouseDownCapture: _onMouseDownCapture,
      onTouchCancel: _onTouchCancel,
      onTouchEnd: _onTouchEnd,
      onTouchMove: _onTouchMove,
      onTouchStart: _onTouchStart,
      ref: _ignoreRef,
      style: _ignoreStyle,
      ...filteredTrayProps
    } = trayProps;

    const defaultAriaLive = isPlaying ? "off" : "polite";
    const resolvedAriaLabel =
      ariaLabel !== undefined
        ? ariaLabel
        : restProps["aria-labelledby"] !== undefined
          ? undefined
          : "slider";

    return (
      <div
        ref={setSliderElementRef}
        className={sliderClasses}
        aria-live={defaultAriaLive}
        aria-label={resolvedAriaLabel}
        role={role}
        style={sliderStyle}
        onKeyDown={handleOnKeyDown}
        {...restProps}
      >
        <div className={trayWrapClasses} style={mergedTrayWrapStyle} {...filteredTrayWrapProps}>
          {React.createElement(
            TrayTag,
            {
              ref: sliderTrayElementRef,
              className: trayClasses,
              style: trayStyle,
              onTouchStart: handleOnTouchStart,
              onTouchMove: handleOnTouchMove,
              onTouchEnd: handleOnTouchEnd,
              onTouchCancel: handleOnTouchCancel,
              onMouseDownCapture: handleOnMouseDownCapture,
              onMouseDown: handleOnMouseDown,
              onClickCapture: handleOnClickCapture,
              ...filteredTrayProps,
            },
            children,
          )}
          {renderMasterSpinner()}
        </div>
      </div>
    );
  }),
  {
    slideSizeInPx,
    slidesMoved,
  },
);

export default Slider;
