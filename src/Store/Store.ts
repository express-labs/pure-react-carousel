import { defaultProps, slideSize, slideTraySize } from "../helpers/component-config";
import { deepFreeze } from "../helpers";
import type { CarouselState, CarouselStoreInterface, MasterSpinnerSubscription } from "../types";

const DEFAULT_TOTAL_SLIDES = 1;
const DEFAULT_NATURAL_SLIDE_WIDTH = 100;
const DEFAULT_NATURAL_SLIDE_HEIGHT = 100;

export function createInitialState(initial: Partial<CarouselState> = {}): CarouselState {
  const totalSlides = initial.totalSlides ?? DEFAULT_TOTAL_SLIDES;
  const visibleSlides = initial.visibleSlides ?? defaultProps.visibleSlides;

  const baseState: CarouselState = {
    currentSlide: initial.currentSlide ?? defaultProps.currentSlide,
    disableAnimation: initial.disableAnimation ?? defaultProps.disableAnimation,
    disableKeyboard: initial.disableKeyboard ?? defaultProps.disableKeyboard,
    dragEnabled: initial.dragEnabled ?? defaultProps.dragEnabled,
    dragStep: initial.dragStep ?? defaultProps.dragStep,
    hasMasterSpinner: initial.hasMasterSpinner ?? defaultProps.hasMasterSpinner,
    imageErrorCount: initial.imageErrorCount ?? 0,
    imageSuccessCount: initial.imageSuccessCount ?? 0,
    infinite: initial.infinite ?? defaultProps.infinite,
    interval: initial.interval ?? defaultProps.interval,
    isIntrinsicHeight: initial.isIntrinsicHeight ?? defaultProps.isIntrinsicHeight,
    isPageScrollLocked: initial.isPageScrollLocked ?? defaultProps.isPageScrollLocked,
    isPlaying: initial.isPlaying ?? defaultProps.isPlaying,
    lockOnWindowScroll: initial.lockOnWindowScroll ?? defaultProps.lockOnWindowScroll,
    masterSpinnerFinished: initial.masterSpinnerFinished ?? false,
    MasterSpinnerThreshold: initial.MasterSpinnerThreshold ?? 0,
    naturalSlideHeight: initial.naturalSlideHeight ?? DEFAULT_NATURAL_SLIDE_HEIGHT,
    naturalSlideWidth: initial.naturalSlideWidth ?? DEFAULT_NATURAL_SLIDE_WIDTH,
    orientation: initial.orientation ?? defaultProps.orientation,
    pauseOnInteract: initial.pauseOnInteract ?? defaultProps.pauseOnInteract,
    playDirection: initial.playDirection ?? defaultProps.playDirection,
    privateUnDisableAnimation:
      initial.privateUnDisableAnimation ?? defaultProps.privateUnDisableAnimation,
    slideSize: initial.slideSize ?? slideSize(totalSlides, visibleSlides),
    slideTraySize: initial.slideTraySize ?? slideTraySize(totalSlides, visibleSlides),
    snapAlign: initial.snapAlign ?? defaultProps.snapAlign,
    snapStop: initial.snapStop ?? defaultProps.snapStop,
    snapType: initial.snapType ?? defaultProps.snapType,
    step: initial.step ?? defaultProps.step,
    totalSlides,
    touchEnabled: initial.touchEnabled ?? defaultProps.touchEnabled,
    visibleSlides,
  };

  return deepFreeze({ ...baseState, ...initial });
}

export class Store implements CarouselStoreInterface {
  state: CarouselState;
  subscriptions: Array<() => void>;
  masterSpinnerSubscriptions: Record<string, MasterSpinnerSubscription>;
  private onStateChange?: (nextState: CarouselState) => void;

  constructor(
    initial: Partial<CarouselState> = {},
    onStateChange?: (nextState: CarouselState) => void,
  ) {
    this.state = createInitialState(initial);
    this.subscriptions = [];
    this.masterSpinnerSubscriptions = {};
    this.onStateChange = onStateChange;

    this.setStoreState = this.setStoreState.bind(this);
    this.getStoreState = this.getStoreState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.subscribeMasterSpinner = this.subscribeMasterSpinner.bind(this);
    this.unsubscribeMasterSpinner = this.unsubscribeMasterSpinner.bind(this);
    this.unsubscribeAllMasterSpinner = this.unsubscribeAllMasterSpinner.bind(this);
    this.masterSpinnerSuccess = this.masterSpinnerSuccess.bind(this);
    this.masterSpinnerError = this.masterSpinnerError.bind(this);
    this.setMasterSpinnerFinished = this.setMasterSpinnerFinished.bind(this);
    this.isMasterSpinnerFinished = this.isMasterSpinnerFinished.bind(this);
  }

  setStoreState(newState: Partial<CarouselState>, callback?: () => void): void {
    this.state = deepFreeze({ ...this.state, ...newState });
    this.onStateChange?.(this.state);
    this.updateSubscribers(callback);
  }

  getStoreState(): CarouselState {
    return deepFreeze({ ...this.state });
  }

  subscribe(func: () => void): void {
    this.subscriptions.push(func);
  }

  unsubscribe(func: () => void): void {
    const index = this.subscriptions.indexOf(func);
    if (index !== -1) {
      this.subscriptions.splice(index, 1);
    }
  }

  updateSubscribers(callback?: () => void): void {
    this.subscriptions.forEach((func) => func());
    if (typeof callback === "function") {
      callback();
    }
  }

  subscribeMasterSpinner(src: string): void {
    const index = Object.keys(this.masterSpinnerSubscriptions).indexOf(src);
    if (index === -1) {
      this.masterSpinnerSubscriptions[src] = {
        success: false,
        error: false,
        complete: false,
      };
    }
  }

  unsubscribeMasterSpinner(src: string): boolean | void {
    const index = Object.keys(this.masterSpinnerSubscriptions).indexOf(src);
    if (index === -1) {
      return false;
    }
    this.setMasterSpinnerFinished();
    return delete this.masterSpinnerSubscriptions[src];
  }

  unsubscribeAllMasterSpinner(): void {
    this.masterSpinnerSubscriptions = {};
    this.setMasterSpinnerFinished();
  }

  masterSpinnerSuccess(src: string): void {
    this.masterSpinnerSubscriptions[src].success = true;
    this.masterSpinnerSubscriptions[src].complete = true;
    this.setStoreState({
      imageSuccessCount: this.state.imageSuccessCount + 1,
      masterSpinnerFinished: this.isMasterSpinnerFinished(),
    });
  }

  masterSpinnerError(src: string): void {
    this.masterSpinnerSubscriptions[src].error = true;
    this.masterSpinnerSubscriptions[src].complete = true;
    this.setStoreState({
      imageErrorCount: this.state.imageErrorCount + 1,
      masterSpinnerFinished: this.isMasterSpinnerFinished(),
    });
  }

  setMasterSpinnerFinished(): void {
    this.setStoreState({
      masterSpinnerFinished: this.isMasterSpinnerFinished(),
    });
  }

  isMasterSpinnerFinished(): boolean {
    if (Object.keys(this.masterSpinnerSubscriptions).length === 0) return false;
    return Object.keys(this.masterSpinnerSubscriptions).every(
      (src) => this.masterSpinnerSubscriptions[src].complete,
    );
  }
}

export default Store;
