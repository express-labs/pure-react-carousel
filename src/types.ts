import type * as React from "react";

/** Axis along which carousel slides are laid out and scrolled. */
export type Orientation = "horizontal" | "vertical";
/** Legacy type alias for {@link Orientation} preserved for backward compatibility. */
export type OrientationType = Orientation;
/** Direction of automatic slide progression when `isPlaying` is enabled. */
export type PlayDirection = "forward" | "backward";
/** Legacy type alias for {@link PlayDirection} preserved for backward compatibility. */
export type DirectionType = PlayDirection;
/** Lifecycle status of an image managed by {@link Image}. */
export type ImageStatus = "loading" | "success" | "error";
/** CSS `scroll-snap-type` strictness mode used by {@link NativeSlider}. */
export type ScrollSnapType = "mandatory" | "proximity" | "none";
/** CSS `scroll-snap-align` alignment applied to each {@link Slide}. */
export type ScrollSnapAlign = "start" | "center" | "end" | "none";
/** CSS `scroll-snap-stop` behavior applied to each {@link Slide}. */
export type ScrollSnapStop = "normal" | "always";
/** Any valid HTML or SVG intrinsic element tag name supported by React JSX. */
export type Tag = keyof React.JSX.IntrinsicElements;

/**
 * Intrinsic JSX element attributes for tag `T` with `ref` normalized to `React.Ref<React.ComponentRef<T>>`
 * so components can forward or manage DOM refs cleanly across React versions.
 */
export type CarouselElement<T extends Tag = "div"> = Omit<React.JSX.IntrinsicElements[T], "ref"> & {
  ref?: React.Ref<React.ComponentRef<T>>;
};

/**
 * Accepted input value for the internal `cn()` class name utility.
 * Falsiness (`false`, `null`, `undefined`, `0`, `""`) is ignored when joining classes.
 */
export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | ClassValue[]
  | { [key: string]: unknown };

/** Default configuration values used to initialize {@link CarouselProvider} and {@link Store}. */
export interface DefaultCarouselConfig {
  currentSlide: number;
  disableAnimation: boolean;
  disableKeyboard: boolean;
  dragEnabled: boolean;
  hasMasterSpinner: boolean;
  infinite: boolean;
  /** Autoplay interval in milliseconds. */
  interval: number;
  isIntrinsicHeight: boolean;
  isPageScrollLocked: boolean;
  isPlaying: boolean;
  lockOnWindowScroll: boolean;
  orientation: Orientation;
  pauseOnInteract: boolean;
  playDirection: PlayDirection;
  /** @internal */
  privateUnDisableAnimation: boolean;
  snapAlign: ScrollSnapAlign;
  snapStop: ScrollSnapStop;
  snapType: ScrollSnapType;
  step: number;
  dragStep: number;
  tag: "div";
  touchEnabled: boolean;
  visibleSlides: number;
}

/** Two-finger touch coordinates (in CSS pixels) used for pinch-zoom geometry calculations. */
export interface TouchCoordinates {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

/** Cached active touch pointer coordinates (in viewport `clientX`/`clientY` CSS pixels). */
export interface TouchPointCacheEntry {
  clientX: number;
  clientY: number;
}

/** Internal pointer/touch drag state tracked by {@link Slider}. */
export interface SliderDragState {
  /** Whether the subsequent `click` capture event should be suppressed after a drag gesture. */
  cancelNextClick: boolean;
  /** Horizontal drag offset in CSS pixels from `startX`. */
  deltaX: number;
  /** Vertical drag offset in CSS pixels from `startY`. */
  deltaY: number;
  isBeingMouseDragged: boolean;
  isBeingTouchDragged: boolean;
  /** Whether vertical page scrolling is currently suppressed due to horizontal touch movement. */
  preventingVerticalScroll: boolean;
  /** Initial pointer `screenX` coordinate in pixels when the drag gesture started. */
  startX: number;
  /** Initial pointer `screenY` coordinate in pixels when the drag gesture started. */
  startY: number;
}

/** Props passed to the internal memoized presenter inside {@link WithStore}. */
export interface MemoizedPresenterProps<T = Record<string, unknown>> {
  ownProps: Record<string, unknown>;
  stateProps: T;
  carouselStore: CarouselStoreInterface;
  forwardedRef?: React.ForwardedRef<unknown>;
}

/** Subscription entry tracking load status for a single image registered with the master spinner. */
export interface MasterSpinnerSubscription {
  success: boolean;
  error: boolean;
  complete: boolean;
}

/**
 * Immutable carousel store state snapshot.
 * All properties are `readonly` and deep-frozen at runtime via `deepFreeze`.
 */
export interface CarouselState {
  /** Zero-based index of the currently active (leading) slide. @default 0 */
  readonly currentSlide: number;
  /** Disables CSS transition animations on the slide tray. @default false */
  readonly disableAnimation: boolean;
  /** Disables keyboard arrow-key navigation on the slider. @default false */
  readonly disableKeyboard: boolean;
  /** Enables the master loading spinner until registered `<Image>` components finish loading. @default false */
  readonly hasMasterSpinner: boolean;
  /** Count of master-spinner-subscribed images that failed to load. */
  readonly imageErrorCount: number;
  /** Count of master-spinner-subscribed images that loaded successfully. */
  readonly imageSuccessCount: number;
  /** Loops navigation between the first and last slides when reaching either end. @default false */
  readonly infinite: boolean;
  /** Autoplay interval in milliseconds between slide advances when `isPlaying` is `true`. @default 5000 */
  readonly interval?: number;
  /** Sizes slides from their natural DOM content height instead of a fixed aspect-ratio box. @default false */
  readonly isIntrinsicHeight: boolean;
  /** Locks document/page scrolling while a pinch-zoom or touch gesture is active. @default false */
  readonly isPageScrollLocked?: boolean;
  /** Whether autoplay timer progression is currently active. @default false */
  readonly isPlaying: boolean;
  /** Locks horizontal slider dragging while the user is actively scrolling the window vertically. @default false */
  readonly lockOnWindowScroll: boolean;
  /** Whether all images registered with the master spinner have completed (loaded or errored). */
  readonly masterSpinnerFinished: boolean;
  /** Optional minimum number of images required before the master spinner is considered finished. */
  readonly masterSpinnerThreshold?: number;
  /** Legacy PascalCase alias for {@link CarouselState.masterSpinnerThreshold}. */
  readonly MasterSpinnerThreshold?: number;
  /** Aspect-ratio reference height of a single slide (unitless ratio denominator, e.g. `500`). */
  readonly naturalSlideHeight: number;
  /** Aspect-ratio reference width of a single slide (unitless ratio numerator, e.g. `400`). */
  readonly naturalSlideWidth: number;
  /** Layout and scroll axis of the carousel. @default "horizontal" */
  readonly orientation: Orientation;
  /** Pauses autoplay (`isPlaying: false`) when the user interacts with controls or drags the slider. @default true */
  readonly pauseOnInteract?: boolean;
  /** Direction in which autoplay advances slides. @default "forward" */
  readonly playDirection?: PlayDirection;
  /**
   * Internal flag used to re-enable tray animation on the frame after a programmatic jump.
   *
   * @internal
   * @default false
   */
  readonly privateUnDisableAnimation?: boolean;
  /** Computed size of each slide as a percentage (`0`–`100`) of the slide tray (`100 / totalSlides`). */
  readonly slideSize: number;
  /** Computed size of the slide tray as a percentage of the viewport (`(100 * totalSlides) / visibleSlides`). */
  readonly slideTraySize: number;
  /** CSS `scroll-snap-align` value applied to each `<Slide>`. @default "start" */
  readonly snapAlign?: ScrollSnapAlign;
  /** CSS `scroll-snap-stop` value applied to each `<Slide>`. @default "normal" */
  readonly snapStop?: ScrollSnapStop;
  /** CSS `scroll-snap-type` mode applied to `<NativeSlider>`. @default "mandatory" */
  readonly snapType?: ScrollSnapType;
  /** Number of slides to advance or rewind when clicking navigation buttons or pressing arrow keys. @default 1 */
  readonly step: number;
  /** Number of slides to snap by when releasing a mouse or touch drag gesture. @default 1 */
  readonly dragStep: number;
  /** Total number of `<Slide>` elements in the carousel. */
  readonly totalSlides: number;
  /** Enables single-finger touch dragging on `<Slider>`. @default true */
  readonly touchEnabled: boolean;
  /** Enables mouse pointer dragging on `<Slider>`. @default true */
  readonly dragEnabled: boolean;
  /** Number of slides simultaneously visible within the carousel viewport (supports fractional values). @default 1 */
  readonly visibleSlides: number;
}

/** Legacy type alias for {@link CarouselState} preserved for backward compatibility. */
export type CarouselStoreState = CarouselState;

/**
 * Mutable partial state patch used when constructing state updates for
 * {@link CarouselStoreInterface.setStoreState}.
 */
export type MutableCarouselStatePatch = {
  -readonly [K in keyof CarouselState]?: CarouselState[K];
};

/** Public store API exposed via {@link CarouselContext} and injected by {@link WithStore}. */
export interface CarouselStoreInterface {
  /** Current immutable state snapshot of the carousel store. */
  readonly state: CarouselState;
  /** Returns the current immutable {@link CarouselState} snapshot. */
  getStoreState(): CarouselState;
  /** Merges `newState` into the store, freezes the updated state, and notifies subscribers. */
  setStoreState(newState: Partial<CarouselState>, callback?: () => void): void;
  /** Registers a listener callback invoked whenever the store state changes. */
  subscribe(callback: () => void): void;
  /** Removes a previously registered state change listener callback. */
  unsubscribe(callback: () => void): void;
  /** Notifies all registered subscriber callbacks and runs `callback` if provided. */
  updateSubscribers(callback?: () => void): void;
  /** Registers an image `src` URL with the master spinner before it finishes loading. */
  subscribeMasterSpinner(src: string): void;
  /** Unregisters a single image `src` URL from the master spinner. */
  unsubscribeMasterSpinner(src: string): false | object | boolean | void;
  /** Clears all pending master spinner image subscriptions. */
  unsubscribeAllMasterSpinner(): void;
  /** Marks the given image `src` as successfully loaded in the master spinner registry. */
  masterSpinnerSuccess(src: string): void;
  /** Marks the given image `src` as failed in the master spinner registry. */
  masterSpinnerError(src: string): void;
  /** Evaluates whether all subscribed images have completed and updates `masterSpinnerFinished`. */
  setMasterSpinnerFinished?(): void;
  /** Returns `true` once every image subscribed to the master spinner has either succeeded or errored. */
  isMasterSpinnerFinished(): boolean;
  masterSpinnerSubscriptions?: Record<string, MasterSpinnerSubscription>;
  subscriptions?: Array<() => void>;
  /** Reference to the underlying root `Store` instance when wrapped by context. */
  masterStore?: CarouselStoreInterface;
}

/** Store subset injected into connected view components by {@link WithStore}. */
export interface CarouselInjectedProps {
  readonly carouselStore: Pick<
    CarouselStoreInterface,
    | "getStoreState"
    | "masterSpinnerError"
    | "masterSpinnerSuccess"
    | "setStoreState"
    | "subscribeMasterSpinner"
    | "unsubscribeAllMasterSpinner"
    | "unsubscribeMasterSpinner"
  >;
}

/** Props for the root `<CarouselProvider>` component that initializes and synchronizes carousel state. */
export interface CarouselProviderProps extends Omit<CarouselElement<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  /** Zero-based index of the active (leading) slide. @default 0 */
  currentSlide?: CarouselState["currentSlide"];
  /** Disables CSS transition animations on the slide tray. @default false */
  disableAnimation?: CarouselState["disableAnimation"];
  /** Disables keyboard arrow-key navigation on the slider. @default false */
  disableKeyboard?: CarouselState["disableKeyboard"];
  /** Enables the master loading spinner until all subscribed `<Image>` components complete. @default false */
  hasMasterSpinner?: CarouselState["hasMasterSpinner"];
  /** Loops navigation between the first and last slides when reaching either end. @default false */
  infinite?: CarouselState["infinite"];
  /** Autoplay interval in milliseconds between slide advances when `isPlaying` is `true`. @default 5000 */
  interval?: CarouselState["interval"];
  /** Sizes slides from their natural DOM content height instead of a fixed aspect-ratio box. @default false */
  isIntrinsicHeight?: CarouselState["isIntrinsicHeight"];
  /** Locks document/page scrolling while a pinch-zoom or touch gesture is active. @default false */
  isPageScrollLocked?: CarouselState["isPageScrollLocked"];
  /** Enables automatic timer-driven slide progression. @default false */
  isPlaying?: CarouselState["isPlaying"];
  /** Locks horizontal slider dragging while the user is actively scrolling the window vertically. @default false */
  lockOnWindowScroll?: CarouselState["lockOnWindowScroll"];
  /** Aspect-ratio reference height of a single slide (unitless ratio denominator, e.g. `500`). */
  naturalSlideHeight: CarouselState["naturalSlideHeight"];
  /** Aspect-ratio reference width of a single slide (unitless ratio numerator, e.g. `400`). */
  naturalSlideWidth: CarouselState["naturalSlideWidth"];
  /** Layout and scroll axis of the carousel. @default "horizontal" */
  orientation?: CarouselState["orientation"];
  /** Pauses autoplay (`isPlaying: false`) when the user interacts with controls or drags the slider. @default true */
  pauseOnInteract?: CarouselState["pauseOnInteract"];
  /** Direction in which autoplay advances slides. @default "forward" */
  playDirection?: CarouselState["playDirection"];
  /** CSS `scroll-snap-align` value applied to each `<Slide>`. @default "start" */
  snapAlign?: CarouselState["snapAlign"];
  /** CSS `scroll-snap-stop` value applied to each `<Slide>`. @default "normal" */
  snapStop?: CarouselState["snapStop"];
  /** CSS `scroll-snap-type` mode applied to `<NativeSlider>`. @default "mandatory" */
  snapType?: CarouselState["snapType"];
  /** Number of slides to advance or rewind when clicking navigation buttons or pressing arrow keys. @default 1 */
  step?: CarouselState["step"];
  /** Number of slides to snap by when releasing a mouse or touch drag gesture. @default 1 */
  dragStep?: CarouselState["dragStep"];
  /** HTML or SVG tag rendered for the provider wrapper element. @default "div" */
  tag?: Tag;
  /** Total number of `<Slide>` elements in the carousel. */
  totalSlides: CarouselState["totalSlides"];
  /** Enables single-finger touch dragging on `<Slider>`. @default true */
  touchEnabled?: CarouselState["touchEnabled"];
  /** Enables mouse pointer dragging on `<Slider>`. @default true */
  dragEnabled?: CarouselState["dragEnabled"];
  /** Number of slides simultaneously visible within the carousel viewport (supports fractional values). @default 1 */
  visibleSlides?: CarouselState["visibleSlides"];
}

/** Props for the connected `<ButtonBack>` component that rewinds the carousel by `step` slides. */
export interface ButtonBackProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Props for the unconnected `<ButtonBackView>` component. */
export interface ButtonBackViewProps extends ButtonBackProps, CarouselInjectedProps {
  currentSlide: number;
  infinite?: boolean;
  pauseOnInteract?: boolean;
  step: number;
  totalSlides: number;
  visibleSlides: number;
}

/** Props for the connected `<ButtonFirst>` component that jumps to slide index `0`. */
export interface ButtonFirstProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Props for the unconnected `<ButtonFirstView>` component. */
export interface ButtonFirstViewProps extends ButtonFirstProps, CarouselInjectedProps {
  currentSlide: number;
  infinite?: boolean;
  pauseOnInteract?: boolean;
  totalSlides: number;
}

/** Props for the connected `<ButtonLast>` component that jumps to the last visible slide page. */
export interface ButtonLastProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Props for the unconnected `<ButtonLastView>` component. */
export interface ButtonLastViewProps extends ButtonLastProps, CarouselInjectedProps {
  currentSlide: number;
  infinite?: boolean;
  pauseOnInteract?: boolean;
  totalSlides: number;
  visibleSlides: number;
}

/** Props for the connected `<ButtonNext>` component that advances the carousel by `step` slides. */
export interface ButtonNextProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Props for the unconnected `<ButtonNextView>` component. */
export interface ButtonNextViewProps extends ButtonNextProps, CarouselInjectedProps {
  currentSlide: number;
  infinite?: boolean;
  pauseOnInteract?: boolean;
  step: number;
  totalSlides: number;
  visibleSlides: number;
}

/** Props for the connected `<ButtonPlay>` component that toggles autoplay (`isPlaying`). */
export interface ButtonPlayProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  /** Content rendered inside the button when autoplay is paused (`isPlaying === false`). */
  childrenPaused?: React.ReactNode;
  /** Content rendered inside the button when autoplay is active (`isPlaying === true`). */
  childrenPlaying?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

/** Props for the unconnected `<ButtonPlayView>` component. */
export interface ButtonPlayViewProps extends ButtonPlayProps, CarouselInjectedProps {
  isPlaying: boolean;
}

/** Props for the connected `<Dot>` slide indicator button component. */
export interface DotProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  className?: string;
  /**
   * Overrides the automatic disabled state. By default, a dot is disabled when its target
   * slide is currently within the visible slide range.
   */
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  /**
   * Overrides the automatic selected state. By default, a dot is selected when `slide` falls
   * within `[currentSlide, currentSlide + visibleSlides)`.
   */
  selected?: boolean;
  /** Zero-based slide index that clicking this dot navigates to. */
  slide: number;
}

/** Props for the unconnected `<DotView>` component. */
export interface DotViewProps extends DotProps, CarouselInjectedProps {
  currentSlide: number;
  /** @default true */
  pauseOnInteract?: boolean;
  totalSlides: number;
  visibleSlides: number;
}

/** Subset of dot group configuration passed when rendering custom dots. */
export interface RenderDotsProps {
  currentSlide?: number;
  totalSlides?: number;
  visibleSlides?: number;
  /** @default true */
  disableActiveDots?: boolean;
  /** @default false */
  showAsSelectedForCurrentSlideOnly?: boolean;
}

/** Props for the connected `<DotGroup>` component that renders a set of `<Dot>` indicators. */
export interface DotGroupProps extends CarouselElement<"div"> {
  children?: React.ReactNode;
  className?: string;
  currentSlide?: number;
  /** Renders the 1-based slide number inside each generated `<Dot>`. @default false */
  dotNumbers?: boolean;
  /** Additional props forwarded to every `<Dot>` rendered by the default dot list. */
  dotProps?: Partial<DotProps>;
  /** Callback returning per-dot props merged onto each `<Dot>` rendered by the default dot list. */
  getDotProps?: (index: number, selected: boolean, slideIndex: number) => Partial<DotProps>;
  /** Disables `<Dot>` buttons that correspond to currently visible slides. @default true */
  disableActiveDots?: boolean;
  /**
   * Marks only the dot matching `currentSlide` as selected instead of all dots within the
   * `visibleSlides` window.
   *
   * @default false
   */
  showAsSelectedForCurrentSlideOnly?: boolean;
  totalSlides?: number;
  visibleSlides?: number;
  /** Custom render callback replacing the default `<Dot>` list generation. */
  renderDots?: (props: DotGroupViewProps) => React.ReactNode;
}

/** Props for the unconnected `<DotGroupView>` component. */
export interface DotGroupViewProps extends DotGroupProps, CarouselInjectedProps {
  currentSlide: number;
  totalSlides: number;
  visibleSlides: number;
}

/** Props for the connected `<Image>` component with master spinner integration and background-image mode. */
export interface ImageProps extends Omit<CarouselElement<"img">, "onError" | "onLoad" | "src"> {
  alt?: string;
  /** Additional props forwarded when rendering a background image container (`isBgImage`). */
  bgImageProps?: Omit<CarouselElement<"div">, "onError" | "onLoad" | "ref"> & {
    hasMasterSpinner?: boolean;
    onError?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
    onLoad?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
    [key: string]: unknown;
  };
  /** Tag used when rendering in background-image mode. */
  bgImageTag?: Tag;
  children?: React.ReactNode;
  className?: string;
  /** Additional CSS class applied when the image fails to load. */
  classNameError?: string;
  /** Additional CSS class applied while the image is loading. */
  classNameLoading?: string;
  /** Additional CSS class applied once the image has loaded successfully. */
  classNameSuccess?: string;
  /** Subscribes this image to the carousel's master loading spinner. @default false */
  hasMasterSpinner?: boolean;
  /**
   * Renders the image as a CSS `background-image` (`background-size: cover`) on a non-`<img>`
   * `tag` (e.g., `tag="div"`).
   *
   * @default false
   */
  isBgImage?: boolean;
  onError?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
  onLoad?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
  /** Custom fallback renderer invoked when the image fails to load. */
  renderError?: () => React.ReactNode;
  /** Custom placeholder renderer invoked while the image is loading. */
  renderLoading?: () => React.ReactNode;
  src: string;
  style?: React.CSSProperties;
  /** HTML tag rendered once loading finishes (`"div"` is used while loading/errored if `tag === "img"`). @default "img" */
  tag?: Tag;
  width?: number | string;
  height?: number | string;
}

/** Props for the unconnected `<ImageView>` component. */
export interface ImageViewProps extends ImageProps, CarouselInjectedProps {
  hasMasterSpinner: boolean;
  orientation?: Orientation;
}

/** Props for the connected `<ImageWithZoom>` component supporting hover and pinch-to-zoom. */
export interface ImageWithZoomProps extends Omit<CarouselElement<"div">, "onError" | "onLoad"> {
  alt?: string;
  /** Additional props forwarded to the underlying base `<Image>` element. */
  bgImageProps?: Omit<CarouselElement<"div">, "onError" | "onLoad" | "ref"> & {
    hasMasterSpinner?: boolean;
    onError?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
    onLoad?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
    [key: string]: unknown;
  };
  /** HTML tag used for the base background `<Image>`. @default "div" */
  bgImageTag?: Tag;
  className?: string;
  hasMasterSpinner?: boolean;
  /** Additional CSS class applied to the base `<Image>` element. */
  imageClassName?: string;
  /** Enables two-finger touch pinch-to-zoom on touch devices. @default true */
  isPinchZoomEnabled?: boolean;
  /** Controlled zoom state flag. */
  isZoomed?: boolean;
  onError?: (ev?: React.SyntheticEvent<HTMLElement> | Event) => void;
  onLoad?: (ev?: React.SyntheticEvent<HTMLElement> | Event) => void;
  /** Additional CSS class applied to the zoomed overlay `<Image>` element. */
  overlayClassName?: string;
  /** Additional props forwarded to the zoomed overlay `<Image>` element. */
  overlayProps?: Partial<ImageProps>;
  src: string;
  /** Optional higher-resolution image URL used for the zoomed overlay; falls back to `src`. */
  srcZoomed?: string;
  /** HTML tag rendered for the outer zoom wrapper element. @default "div" */
  tag?: Tag;
  /** Custom loading spinner renderer displayed while the image is loading and `hasMasterSpinner` is `false`. */
  spinner?: () => React.ReactNode;
  width?: number | string;
  height?: number | string;
}

/** Props for the unconnected `<ImageWithZoomView>` component. */
export interface ImageWithZoomViewProps extends ImageWithZoomProps, CarouselInjectedProps {}

/** Props for the connected `<Slide>` component representing a single carousel item. */
export interface SlideProps extends Omit<CarouselElement<"div">, "onBlur" | "onFocus"> {
  /** Accessible `aria-label` applied to the outer slide element. @default "slide" */
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  /** Additional CSS class applied when the slide is outside the visible `[currentSlide, currentSlide + visibleSlides)` window. */
  classNameHidden?: string;
  /** Additional CSS class applied when the slide is within the visible `[currentSlide, currentSlide + visibleSlides)` window. */
  classNameVisible?: string;
  /** Zero-based position index of this slide within the carousel (`0` to `totalSlides - 1`). */
  index: number;
  /** Additional CSS class applied to the inner slide wrapper element. */
  innerClassName?: string;
  /**
   * Additional HTML attributes forwarded to the inner slide wrapper element.
   * Note: `ref` is intentionally excluded.
   */
  innerProps?: Omit<CarouselElement<"div">, "ref"> & { ref?: never };
  /** HTML tag rendered for the inner slide wrapper element. @default "div" */
  innerTag?: Tag;
  /** Sizes the slide from its natural DOM content height instead of a fixed aspect-ratio box. @default false */
  isIntrinsicHeight?: boolean;
  onBlur?: (ev: React.FocusEvent<HTMLElement>) => void;
  onFocus?: (ev: React.FocusEvent<HTMLElement>) => void;
  /** CSS `scroll-snap-align` alignment for this slide inside `<NativeSlider>`. @default "start" */
  snapAlign?: ScrollSnapAlign;
  /** CSS `scroll-snap-stop` behavior for this slide inside `<NativeSlider>`. @default "normal" */
  snapStop?: ScrollSnapStop;
  style?: React.CSSProperties;
  tabIndex?: number;
  /** HTML tag rendered for the outer slide element. @default "div" */
  tag?: Tag;
}

/** Props for the unconnected `<SlideView>` component. */
export interface SlideViewProps extends SlideProps {
  carouselStore?: CarouselInjectedProps["carouselStore"];
  currentSlide: number;
  naturalSlideHeight: number;
  naturalSlideWidth: number;
  orientation: Orientation;
  /** Computed size of each slide as a percentage (`0`–`100`) of the slide tray. */
  slideSize: number;
  totalSlides: number;
  visibleSlides: number;
}

/**
 * Props for the connected `<NativeSlider>` component using native browser CSS overflow scrolling
 * and CSS Scroll Snap synchronized with the carousel store via `IntersectionObserver`,
 * `scrollsnapchange`, and `scrollend`.
 */
export interface NativeSliderProps extends CarouselElement<"div"> {
  /** Accessible `aria-label` applied to the slider element. @default "slider" */
  ariaLabel?: string;
  /** `KeyboardEvent.keyCode` that navigates backward by one slide. @default 37 (ArrowLeft) */
  backwardKeyCode?: number;
  children: React.ReactNode;
  className?: string;
  /** Additional CSS class applied to the scrollable slide tray element. */
  classNameTray?: string;
  /** Additional CSS class applied to the outer tray wrapper element. */
  classNameTrayWrap?: string;
  /** Uses instant (`behavior: "instant"`) scrolling instead of smooth (`behavior: "smooth"`) programmatic scrolling. @default false */
  disableAnimation?: boolean;
  /** Disables keyboard arrow-key navigation on the slider. @default false */
  disableKeyboard?: boolean;
  /** `KeyboardEvent.keyCode` that navigates forward by one slide. @default 39 (ArrowRight) */
  forwardKeyCode?: number;
  /** Hides native browser scrollbars on the scroll-snap tray. @default true */
  hideScrollbar?: boolean;
  /** Deprecated callback prop preserved for parity with `<Slider>`; use `spinner` to customize the master spinner. */
  onMasterSpinner?: () => React.ReactNode;
  /** ARIA `role` attribute applied to the slider element. @default "listbox" */
  role?: string;
  /** CSS `scroll-snap-type` strictness mode; pass `"none"` for free-momentum scrolling without snapping. @default "mandatory" */
  snapType?: ScrollSnapType;
  /** Custom loading spinner renderer displayed while `hasMasterSpinner` is `true` and images are still loading. */
  spinner?: () => React.ReactNode;
  style?: React.CSSProperties;
  tabIndex?: number;
  /**
   * Additional HTML attributes forwarded to the inner slide tray element.
   * Note: `ref` is intentionally excluded because `NativeSlider` manages the tray ref internally.
   */
  trayProps?: Omit<CarouselElement<"div">, "ref"> & { ref?: never };
  /** HTML tag rendered for the inner slide tray element. @default "div" */
  trayTag?: Tag;
  /**
   * Additional HTML attributes forwarded to the outer tray wrapper element.
   * Note: `ref` is intentionally excluded because `NativeSlider` manages the tray wrapper ref internally.
   */
  trayWrapProps?: Omit<CarouselElement<"div">, "ref"> & { ref?: never };
}

/** Props for the unconnected `<NativeSliderView>` component. */
export interface NativeSliderViewProps extends NativeSliderProps, CarouselInjectedProps {
  currentSlide: number;
  hasMasterSpinner: boolean;
  infinite?: boolean;
  /** Autoplay interval in milliseconds. */
  interval?: number;
  isIntrinsicHeight?: boolean;
  isPageScrollLocked?: boolean;
  isPlaying: boolean;
  lockOnWindowScroll: boolean;
  masterSpinnerFinished: boolean;
  naturalSlideHeight: number;
  naturalSlideWidth: number;
  orientation: Orientation;
  pauseOnInteract?: boolean;
  playDirection?: PlayDirection;
  /** @internal */
  privateUnDisableAnimation?: boolean;
  /** Computed size of each slide as a percentage (`0`–`100`) of the slide tray. */
  slideSize: number;
  /** Computed size of the slide tray as a percentage of the viewport. */
  slideTraySize: number;
  snapType?: ScrollSnapType;
  step: number;
  totalSlides: number;
  touchEnabled: boolean;
  visibleSlides?: number;
}

/** Props for the connected `<Slider>` component using CSS transform-based tray positioning and pointer/touch drag physics. */
export interface SliderProps extends CarouselElement<"div"> {
  /** Accessible `aria-label` applied to the slider element. @default "slider" */
  ariaLabel?: string;
  /** `KeyboardEvent.keyCode` that navigates backward by one slide. @default 37 (ArrowLeft) */
  backwardKeyCode?: number;
  children: React.ReactNode;
  className?: string;
  /** Custom CSS class applied to the tray when transition animation is enabled (replaces the default transition class). */
  classNameAnimation?: string;
  /** Additional CSS class applied to the inner slide tray element. */
  classNameTray?: string;
  /** Additional CSS class applied to the outer tray wrapper element. */
  classNameTrayWrap?: string;
  /** Disables CSS transition animations on the slide tray. @default false */
  disableAnimation?: boolean;
  /** Disables keyboard arrow-key navigation on the slider. @default false */
  disableKeyboard?: boolean;
  /**
   * Maximum pointer movement in pixels before a press is treated as a drag gesture
   * and child click events are suppressed. Pass `0` to disable click suppression.
   *
   * @default 5
   */
  dragClickThreshold?: number;
  /** `KeyboardEvent.keyCode` that navigates forward by one slide. @default 39 (ArrowRight) */
  forwardKeyCode?: number;
  /**
   * Fraction of a single slide's width or height (`0` to `1`) that a drag must exceed
   * to advance to the next or previous slide on release.
   *
   * @default 0.1
   */
  moveThreshold?: number;
  /** Prevents vertical page scrolling during horizontal touch drags once `horizontalPixelThreshold` is exceeded. @default true */
  preventVerticalScrollOnTouch?: boolean;
  /** Minimum horizontal touch movement in pixels required before locking vertical page scroll. @default 15 */
  horizontalPixelThreshold?: number;
  /** Minimum vertical touch movement in pixels before allowing native vertical page scroll. @default 10 */
  verticalPixelThreshold?: number;
  /** Deprecated callback prop; use `spinner` to customize the master loading spinner. */
  onMasterSpinner?: () => React.ReactNode;
  /** Custom loading spinner renderer displayed while `hasMasterSpinner` is `true` and images are still loading. */
  spinner?: () => React.ReactNode;
  style?: React.CSSProperties;
  tabIndex?: number;
  /**
   * Additional HTML attributes forwarded to the inner slide tray element.
   * Note: `ref` is intentionally excluded because `Slider` manages the tray ref internally.
   */
  trayProps?: Omit<CarouselElement<"div">, "ref"> & { ref?: never };
  /** HTML tag rendered for the inner slide tray element. @default "div" */
  trayTag?: Tag;
  /**
   * Additional HTML attributes forwarded to the outer tray wrapper element.
   * Note: `ref` is intentionally excluded.
   */
  trayWrapProps?: Omit<CarouselElement<"div">, "ref"> & { ref?: never };
}

/** Props for the unconnected `<SliderView>` component. */
export interface SliderViewProps extends SliderProps, CarouselInjectedProps {
  currentSlide: number;
  dragEnabled: boolean;
  /** Number of slides to snap by when releasing a drag gesture. @default 1 */
  dragStep?: number;
  hasMasterSpinner: boolean;
  infinite?: boolean;
  /** Autoplay interval in milliseconds. @default 5000 */
  interval?: number;
  isIntrinsicHeight?: boolean;
  isPageScrollLocked?: boolean;
  isPlaying: boolean;
  lockOnWindowScroll: boolean;
  masterSpinnerFinished: boolean;
  naturalSlideHeight: number;
  naturalSlideWidth: number;
  orientation: Orientation;
  pauseOnInteract?: boolean;
  playDirection?: PlayDirection;
  /** @internal */
  privateUnDisableAnimation?: boolean;
  /** Computed size of each slide as a percentage (`0`–`100`) of the slide tray. */
  slideSize: number;
  /** Computed size of the slide tray as a percentage of the viewport. */
  slideTraySize: number;
  step: number;
  totalSlides: number;
  touchEnabled: boolean;
  visibleSlides?: number;
}

/** Props for the `<Spinner>` loading indicator component. */
export interface SpinnerProps extends CarouselElement<"div"> {
  className?: string;
}

/** Props for the unconnected `<SpinnerView>` component. */
export type SpinnerViewProps = SpinnerProps;

/** Selector function mapping the immutable {@link CarouselState} to a component's subscribed state props. */
export type MapStateToProps<TStateProps = Record<never, never>> = (
  state: CarouselState,
) => TStateProps;

/**
 * Computes the external prop contract of a component wrapped with {@link WithStore}:
 * state-mapped props `T` and injected `carouselStore` become optional overrides on `P`.
 */
export type WithStoreProps<P, T = Record<never, never>> = Omit<
  P,
  keyof (T & CarouselInjectedProps)
> &
  Partial<T & CarouselInjectedProps>;

/** Call signature interface for the {@link WithStore} higher-order component. */
export interface WithStoreInterface {
  <P extends object, T = Record<never, never>>(
    component: React.ComponentType<P>,
    mapStateToProps?: MapStateToProps<T>,
  ): React.ComponentType<WithStoreProps<P, T>>;
  <CustomProps, CustomStateProps = Record<never, never>>(
    component: React.ComponentType<CustomProps & CustomStateProps & CarouselInjectedProps>,
    mapStateToProps?: MapStateToProps<CustomStateProps>,
  ): React.ComponentType<CustomProps>;
}
