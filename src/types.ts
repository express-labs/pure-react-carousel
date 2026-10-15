import type React from "react";

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
  currentSlide: number;
  disableAnimation: boolean;
  disableKeyboard: boolean;
  hasMasterSpinner: boolean;
  imageErrorCount: number;
  imageSuccessCount: number;
  infinite: boolean;
  interval: number;
  isIntrinsicHeight: boolean;
  isPageScrollLocked: boolean;
  isPlaying: boolean;
  lockOnWindowScroll: boolean;
  masterSpinnerFinished: boolean;
  MasterSpinnerThreshold: number;
  naturalSlideHeight: number;
  naturalSlideWidth: number;
  orientation: Orientation;
  playDirection: PlayDirection;
  privateUnDisableAnimation: boolean;
  slideSize: number;
  slideTraySize: number;
  step: number;
  dragStep: number;
  totalSlides: number;
  touchEnabled: boolean;
  dragEnabled: boolean;
  visibleSlides: number;
}

export type CarouselStoreState = CarouselState;

export interface CarouselStoreInterface {
  readonly state: CarouselState;
  getStoreState(): CarouselState;
  setStoreState(newState: Partial<CarouselState>, callback?: () => void): void;
  subscribe(callback: () => void): void;
  unsubscribe(callback: () => void): void;
  updateSubscribers(callback?: () => void): void;
  subscribeMasterSpinner(src: string): void;
  unsubscribeMasterSpinner(src: string): boolean | void;
  unsubscribeAllMasterSpinner(): void;
  masterSpinnerSuccess(src: string): void;
  masterSpinnerError(src: string): void;
  isMasterSpinnerFinished(): boolean;
  masterSpinnerSubscriptions: Record<string, MasterSpinnerSubscription>;
  subscriptions: Array<() => void>;
  masterStore?: CarouselStoreInterface;
}

export interface CarouselInjectedProps {
  carouselStore: CarouselStoreInterface;
}

export interface CarouselProviderProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  children: React.ReactNode;
  className?: string;
  currentSlide?: number;
  disableAnimation?: boolean;
  disableKeyboard?: boolean;
  hasMasterSpinner?: boolean;
  infinite?: boolean;
  interval?: number;
  isIntrinsicHeight?: boolean;
  isPageScrollLocked?: boolean;
  isPlaying?: boolean;
  lockOnWindowScroll?: boolean;
  naturalSlideHeight: number;
  naturalSlideWidth: number;
  orientation?: Orientation;
  playDirection?: PlayDirection;
  step?: number;
  dragStep?: number;
  tag?: Tag;
  totalSlides: number;
  touchEnabled?: boolean;
  dragEnabled?: boolean;
  visibleSlides?: number;
}

export interface ButtonBackProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, CarouselInjectedProps {
  children?: React.ReactNode;
  className?: string;
  currentSlide: number;
  disabled?: boolean;
  infinite?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  step: number;
  totalSlides: number;
  visibleSlides: number;
}

export interface ButtonFirstProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, CarouselInjectedProps {
  children?: React.ReactNode;
  className?: string;
  currentSlide: number;
  disabled?: boolean;
  infinite?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  totalSlides: number;
}

export interface ButtonLastProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, CarouselInjectedProps {
  children?: React.ReactNode;
  className?: string;
  currentSlide: number;
  disabled?: boolean;
  infinite?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  totalSlides: number;
  visibleSlides: number;
}

export interface ButtonNextProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, CarouselInjectedProps {
  children?: React.ReactNode;
  className?: string;
  currentSlide: number;
  disabled?: boolean;
  infinite?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  step: number;
  totalSlides: number;
  visibleSlides: number;
}

export interface ButtonPlayProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, CarouselInjectedProps {
  children?: React.ReactNode;
  childrenPaused?: React.ReactNode;
  childrenPlaying?: React.ReactNode;
  className?: string;
  isPlaying: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface DotProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, CarouselInjectedProps {
  children?: React.ReactNode;
  className?: string;
  currentSlide: number;
  disabled?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  selected?: boolean;
  slide: number;
  totalSlides: number;
  visibleSlides: number;
}

export interface DotGroupProps extends React.HTMLAttributes<HTMLElement>, CarouselInjectedProps {
  children?: React.ReactNode;
  className?: string;
  currentSlide: number;
  dotNumbers?: boolean;
  disableActiveDots?: boolean;
  showAsSelectedForCurrentSlideOnly?: boolean;
  totalSlides: number;
  visibleSlides: number;
  renderDots?: (props: DotGroupProps) => React.ReactNode;
}

export interface ImageProps
  extends
    Omit<React.ImgHTMLAttributes<HTMLImageElement>, "onError" | "onLoad" | "src">,
    CarouselInjectedProps {
  alt?: string;
  bgImageProps?: Omit<React.HTMLAttributes<HTMLElement>, "onError" | "onLoad">;
  bgImageTag?: Tag;
  children?: React.ReactNode;
  className?: string;
  classNameError?: string;
  classNameLoading?: string;
  classNameSuccess?: string;
  hasMasterSpinner: boolean;
  isBgImage?: boolean;
  onError?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
  onLoad?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
  renderError?: () => React.ReactNode;
  renderLoading?: () => React.ReactNode;
  src: string;
  style?: React.CSSProperties;
  tag?: Tag;
}

export interface ImageWithZoomProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "onError" | "onLoad">, CarouselInjectedProps {
  alt?: string;
  bgImageProps?: Omit<React.HTMLAttributes<HTMLElement>, "onError" | "onLoad">;
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
}

export interface SlideProps extends Omit<React.HTMLAttributes<HTMLElement>, "onBlur" | "onFocus"> {
  ariaLabel?: string;
  carouselStore?: CarouselStoreInterface;
  children?: React.ReactNode;
  className?: string;
  classNameHidden?: string;
  classNameVisible?: string;
  currentSlide: number;
  index: number;
  innerClassName?: string;
  innerTag?: Tag;
  isIntrinsicHeight?: boolean;
  naturalSlideHeight: number;
  naturalSlideWidth: number;
  onBlur?: (ev: React.FocusEvent<HTMLElement>) => void;
  onFocus?: (ev: React.FocusEvent<HTMLElement>) => void;
  orientation: Orientation;
  slideSize: number;
  style?: React.CSSProperties;
  tabIndex?: number;
  tag?: Tag;
  totalSlides: number;
  visibleSlides: number;
}

export interface SliderProps extends React.HTMLAttributes<HTMLElement>, CarouselInjectedProps {
  ariaLabel?: string;
  backwardKeyCode?: number;
  children: React.ReactNode;
  className?: string;
  classNameAnimation?: string;
  classNameTray?: string;
  classNameTrayWrap?: string;
  currentSlide: number;
  disableAnimation?: boolean;
  disableKeyboard?: boolean;
  dragEnabled: boolean;
  dragStep?: number;
  forwardKeyCode?: number;
  hasMasterSpinner: boolean;
  infinite?: boolean;
  isIntrinsicHeight?: boolean;
  isPageScrollLocked: boolean;
  isPlaying: boolean;
  lockOnWindowScroll: boolean;
  masterSpinnerFinished: boolean;
  moveThreshold?: number;
  naturalSlideHeight: number;
  naturalSlideWidth: number;
  onMasterSpinner?: () => React.ReactNode;
  orientation: Orientation;
  playDirection: PlayDirection;
  privateUnDisableAnimation?: boolean;
  slideSize: number;
  slideTraySize: number;
  spinner?: () => React.ReactNode;
  step: number;
  style?: React.CSSProperties;
  tabIndex?: number;
  totalSlides: number;
  touchEnabled: boolean;
  trayProps?: React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> };
  trayTag?: Tag;
  verticalPixelThreshold?: number;
  visibleSlides?: number;
}

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}
