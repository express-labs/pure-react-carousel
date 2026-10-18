import type * as React from "react";

export type Orientation = "horizontal" | "vertical";
export type OrientationType = Orientation;
export type PlayDirection = "forward" | "backward";
export type DirectionType = PlayDirection;
export type ImageStatus = "loading" | "success" | "error";
export type Tag = keyof React.JSX.IntrinsicElements;

export type CarouselElement<T extends Tag = "div"> = Omit<React.JSX.IntrinsicElements[T], "ref">;

export interface MasterSpinnerSubscription {
  success: boolean;
  error: boolean;
  complete: boolean;
}

export interface CarouselState {
  readonly currentSlide: number;
  readonly disableAnimation: boolean;
  readonly disableKeyboard: boolean;
  readonly hasMasterSpinner: boolean;
  readonly imageErrorCount: number;
  readonly imageSuccessCount: number;
  readonly infinite: boolean;
  readonly interval?: number;
  readonly isIntrinsicHeight: boolean;
  readonly isPageScrollLocked?: boolean;
  readonly isPlaying: boolean;
  readonly lockOnWindowScroll: boolean;
  readonly masterSpinnerFinished: boolean;
  readonly masterSpinnerThreshold?: number;
  readonly MasterSpinnerThreshold?: number;
  readonly naturalSlideHeight: number;
  readonly naturalSlideWidth: number;
  readonly orientation: Orientation;
  readonly playDirection?: PlayDirection;
  readonly privateUnDisableAnimation?: boolean;
  readonly slideSize: number;
  readonly slideTraySize: number;
  readonly step: number;
  readonly dragStep: number;
  readonly totalSlides: number;
  readonly touchEnabled: boolean;
  readonly dragEnabled: boolean;
  readonly visibleSlides: number;
}

export type CarouselStoreState = CarouselState;

export type MutableCarouselStatePatch = {
  -readonly [K in keyof CarouselState]?: CarouselState[K];
};

export interface CarouselStoreInterface {
  readonly state: CarouselState;
  getStoreState(): CarouselState;
  setStoreState(newState: Partial<CarouselState>, callback?: () => void): void;
  subscribe(callback: () => void): void;
  unsubscribe(callback: () => void): void;
  updateSubscribers(callback?: () => void): void;
  subscribeMasterSpinner(src: string): void;
  unsubscribeMasterSpinner(src: string): false | object | boolean | void;
  unsubscribeAllMasterSpinner(): void;
  masterSpinnerSuccess(src: string): void;
  masterSpinnerError(src: string): void;
  setMasterSpinnerFinished?(): void;
  isMasterSpinnerFinished(): boolean;
  masterSpinnerSubscriptions?: Record<string, MasterSpinnerSubscription>;
  subscriptions?: Array<() => void>;
  masterStore?: CarouselStoreInterface;
}

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

export interface CarouselProviderProps extends Omit<CarouselElement<"div">, "children"> {
  children: React.ReactNode;
  className?: string;
  currentSlide?: CarouselState["currentSlide"];
  disableAnimation?: CarouselState["disableAnimation"];
  disableKeyboard?: CarouselState["disableKeyboard"];
  hasMasterSpinner?: CarouselState["hasMasterSpinner"];
  infinite?: CarouselState["infinite"];
  interval?: CarouselState["interval"];
  isIntrinsicHeight?: CarouselState["isIntrinsicHeight"];
  isPageScrollLocked?: CarouselState["isPageScrollLocked"];
  isPlaying?: CarouselState["isPlaying"];
  lockOnWindowScroll?: CarouselState["lockOnWindowScroll"];
  naturalSlideHeight: CarouselState["naturalSlideHeight"];
  naturalSlideWidth: CarouselState["naturalSlideWidth"];
  orientation?: CarouselState["orientation"];
  playDirection?: CarouselState["playDirection"];
  step?: CarouselState["step"];
  dragStep?: CarouselState["dragStep"];
  tag?: Tag;
  totalSlides: CarouselState["totalSlides"];
  touchEnabled?: CarouselState["touchEnabled"];
  dragEnabled?: CarouselState["dragEnabled"];
  visibleSlides?: CarouselState["visibleSlides"];
}

export interface ButtonBackProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonBackViewProps extends ButtonBackProps, CarouselInjectedProps {
  currentSlide: number;
  infinite?: boolean;
  step: number;
  totalSlides: number;
  visibleSlides: number;
}

export interface ButtonFirstProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonFirstViewProps extends ButtonFirstProps, CarouselInjectedProps {
  currentSlide: number;
  infinite?: boolean;
  totalSlides: number;
}

export interface ButtonLastProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonLastViewProps extends ButtonLastProps, CarouselInjectedProps {
  currentSlide: number;
  infinite?: boolean;
  totalSlides: number;
  visibleSlides: number;
}

export interface ButtonNextProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonNextViewProps extends ButtonNextProps, CarouselInjectedProps {
  currentSlide: number;
  infinite?: boolean;
  step: number;
  totalSlides: number;
  visibleSlides: number;
}

export interface ButtonPlayProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  childrenPaused?: React.ReactNode;
  childrenPlaying?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonPlayViewProps extends ButtonPlayProps, CarouselInjectedProps {
  isPlaying: boolean;
}

export interface DotProps extends CarouselElement<"button"> {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
  slide: number;
}

export interface DotViewProps extends DotProps, CarouselInjectedProps {
  currentSlide: number;
  totalSlides: number;
  visibleSlides: number;
}

export interface RenderDotsProps {
  currentSlide?: number;
  totalSlides?: number;
  visibleSlides?: number;
  disableActiveDots?: boolean;
  showAsSelectedForCurrentSlideOnly?: boolean;
}

export interface DotGroupProps extends CarouselElement<"div"> {
  children?: React.ReactNode;
  className?: string;
  currentSlide?: number;
  dotNumbers?: boolean;
  disableActiveDots?: boolean;
  showAsSelectedForCurrentSlideOnly?: boolean;
  totalSlides?: number;
  visibleSlides?: number;
  renderDots?: (props: DotGroupViewProps) => React.ReactNode;
}

export interface DotGroupViewProps extends DotGroupProps, CarouselInjectedProps {
  currentSlide: number;
  totalSlides: number;
  visibleSlides: number;
}

export interface ImageProps extends Omit<CarouselElement<"img">, "onError" | "onLoad" | "src"> {
  alt?: string;
  bgImageProps?: Omit<CarouselElement<"div">, "onError" | "onLoad"> & {
    hasMasterSpinner?: boolean;
    onError?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
    onLoad?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
    [key: string]: unknown;
  };
  bgImageTag?: Tag;
  children?: React.ReactNode;
  className?: string;
  classNameError?: string;
  classNameLoading?: string;
  classNameSuccess?: string;
  hasMasterSpinner?: boolean;
  isBgImage?: boolean;
  onError?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
  onLoad?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
  renderError?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  src: string;
  style?: React.CSSProperties;
  tag?: Tag;
  width?: number | string;
  height?: number | string;
}

export interface ImageViewProps extends ImageProps, CarouselInjectedProps {
  hasMasterSpinner: boolean;
  orientation?: Orientation;
}

export interface ImageWithZoomProps extends Omit<CarouselElement<"div">, "onError" | "onLoad"> {
  alt?: string;
  bgImageProps?: Omit<CarouselElement<"div">, "onError" | "onLoad"> & {
    hasMasterSpinner?: boolean;
    onError?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
    onLoad?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
    [key: string]: unknown;
  };
  bgImageTag?: Tag;
  className?: string;
  hasMasterSpinner?: boolean;
  imageClassName?: string;
  isPinchZoomEnabled?: boolean;
  isZoomed?: boolean;
  onError?: (ev?: React.SyntheticEvent<HTMLElement> | Event) => void;
  onLoad?: (ev?: React.SyntheticEvent<HTMLElement> | Event) => void;
  overlayClassName?: string;
  src: string;
  srcZoomed?: string;
  tag?: Tag;
  spinner?: () => React.ReactNode;
  width?: number | string;
  height?: number | string;
}

export interface ImageWithZoomViewProps extends ImageWithZoomProps, CarouselInjectedProps {}

export interface SlideProps extends Omit<CarouselElement<"div">, "onBlur" | "onFocus"> {
  ariaLabel?: string;
  children?: React.ReactNode;
  className?: string;
  classNameHidden?: string;
  classNameVisible?: string;
  index: number;
  innerClassName?: string;
  innerTag?: Tag;
  isIntrinsicHeight?: boolean;
  onBlur?: (ev: React.FocusEvent<HTMLElement>) => void;
  onFocus?: (ev: React.FocusEvent<HTMLElement>) => void;
  style?: React.CSSProperties;
  tabIndex?: number;
  tag?: Tag;
}

export interface SlideViewProps extends SlideProps {
  carouselStore?: CarouselInjectedProps["carouselStore"];
  currentSlide: number;
  naturalSlideHeight: number;
  naturalSlideWidth: number;
  orientation: Orientation;
  slideSize: number;
  totalSlides: number;
  visibleSlides: number;
}

export interface SliderProps extends CarouselElement<"div"> {
  ariaLabel?: string;
  backwardKeyCode?: number;
  children: React.ReactNode;
  className?: string;
  classNameAnimation?: string;
  classNameTray?: string;
  classNameTrayWrap?: string;
  disableAnimation?: boolean;
  disableKeyboard?: boolean;
  forwardKeyCode?: number;
  moveThreshold?: number;
  preventVerticalScrollOnTouch?: boolean;
  horizontalPixelThreshold?: number;
  verticalPixelThreshold?: number;
  onMasterSpinner?: () => React.ReactNode;
  spinner?: () => React.ReactNode;
  style?: React.CSSProperties;
  tabIndex?: number;
  trayProps?: CarouselElement<"div"> & { ref?: never };
  trayTag?: Tag;
}

export interface SliderViewProps extends SliderProps, CarouselInjectedProps {
  currentSlide: number;
  dragEnabled: boolean;
  dragStep?: number;
  hasMasterSpinner: boolean;
  infinite?: boolean;
  interval?: number;
  isIntrinsicHeight?: boolean;
  isPageScrollLocked?: boolean;
  isPlaying: boolean;
  lockOnWindowScroll: boolean;
  masterSpinnerFinished: boolean;
  naturalSlideHeight: number;
  naturalSlideWidth: number;
  orientation: Orientation;
  playDirection?: PlayDirection;
  privateUnDisableAnimation?: boolean;
  slideSize: number;
  slideTraySize: number;
  step: number;
  totalSlides: number;
  touchEnabled: boolean;
  visibleSlides?: number;
}

export interface SpinnerProps extends CarouselElement<"div"> {
  className?: string;
}

export type SpinnerViewProps = SpinnerProps;

export type MapStateToProps<TStateProps = Record<never, never>> = (
  state: CarouselState,
) => TStateProps;

export type WithStoreProps<P, T = Record<never, never>> = Omit<
  P,
  keyof (T & CarouselInjectedProps)
> &
  Partial<T & CarouselInjectedProps>;

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
