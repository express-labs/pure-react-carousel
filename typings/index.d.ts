import * as React from "react";
import { CarouselElement } from "./carouselElements";

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
  readonly preventVerticalScrollOnTouch?: boolean;
  readonly horizontalPixelThreshold?: number;
  readonly verticalPixelThreshold?: number;
  readonly masterSpinnerFinished: boolean;
  readonly masterSpinnerThreshold?: number;
  readonly MasterSpinnerThreshold?: number;
  readonly naturalSlideHeight: number;
  readonly naturalSlideWidth: number;
  readonly orientation: "horizontal" | "vertical";
  readonly playDirection?: "forward" | "backward";
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

export interface CarouselStoreInterface {
  readonly state: CarouselState;
  readonly getStoreState: () => CarouselState;
  readonly setStoreState: (newState: Partial<CarouselState>, callback?: () => void) => void;
  readonly subscribe: (callback: () => void) => void;
  readonly unsubscribe: (callback: () => void) => void;
  readonly updateSubscribers: (callback?: (state: CarouselState) => void) => void;
  readonly subscribeMasterSpinner: (src: string) => void;
  readonly unsubscribeMasterSpinner: (src: string) => false | object | boolean | void;
  readonly unsubscribeAllMasterSpinner: () => void;
  readonly masterSpinnerSuccess: (src: string) => void;
  readonly masterSpinnerError: (src: string) => void;
  readonly setMasterSpinnerFinished?: () => void;
  readonly isMasterSpinnerFinished: () => boolean;
}

export interface CarouselProviderProps extends CarouselElement<"div"> {
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly currentSlide?: CarouselState["currentSlide"];
  readonly disableAnimation?: CarouselState["disableAnimation"];
  readonly disableKeyboard?: CarouselState["disableKeyboard"];
  readonly hasMasterSpinner?: CarouselState["hasMasterSpinner"];
  readonly interval?: number;
  readonly isPageScrollLocked?: boolean;
  readonly isPlaying?: CarouselState["isPlaying"];
  readonly lockOnWindowScroll?: CarouselState["lockOnWindowScroll"];
  readonly preventVerticalScrollOnTouch?: CarouselState["preventVerticalScrollOnTouch"];
  readonly horizontalPixelThreshold?: CarouselState["horizontalPixelThreshold"];
  readonly verticalPixelThreshold?: CarouselState["verticalPixelThreshold"];
  readonly naturalSlideHeight: CarouselState["naturalSlideHeight"];
  readonly naturalSlideWidth: CarouselState["naturalSlideWidth"];
  readonly orientation?: CarouselState["orientation"];
  readonly playDirection?: "forward" | "backward";
  readonly step?: CarouselState["step"];
  readonly dragStep?: CarouselState["dragStep"];
  readonly tag?: keyof React.JSX.IntrinsicElements;
  readonly totalSlides: CarouselState["totalSlides"];
  readonly touchEnabled?: CarouselState["touchEnabled"];
  readonly dragEnabled?: CarouselState["dragEnabled"];
  readonly visibleSlides?: CarouselState["visibleSlides"];
  readonly infinite?: CarouselState["infinite"];
  readonly isIntrinsicHeight?: CarouselState["isIntrinsicHeight"];
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

export interface SliderProps extends CarouselElement<"div"> {
  readonly ariaLabel?: string;
  readonly backwardKeyCode?: number;
  readonly children: React.ReactNode;
  readonly className?: string;
  readonly classNameAnimation?: string;
  readonly classNameTray?: string;
  readonly classNameTrayWrap?: string;
  readonly disableAnimation?: boolean;
  readonly disableKeyboard?: boolean;
  readonly forwardKeyCode?: number;
  readonly moveThreshold?: number;
  readonly preventVerticalScrollOnTouch?: boolean;
  readonly horizontalPixelThreshold?: number;
  readonly verticalPixelThreshold?: number;
  readonly onMasterSpinner?: () => React.ReactNode;
  readonly spinner?: () => React.ReactNode;
  readonly style?: React.CSSProperties;
  readonly tabIndex?: number;
  readonly trayProps?: CarouselElement<"div">;
  readonly trayTag?: keyof React.JSX.IntrinsicElements;
}

export interface SlideProps extends Omit<CarouselElement<"div">, "onBlur" | "onFocus"> {
  readonly ariaLabel?: string;
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly classNameHidden?: string;
  readonly classNameVisible?: string;
  readonly index: number;
  readonly innerClassName?: string;
  readonly innerTag?: keyof React.JSX.IntrinsicElements;
  readonly onBlur?: (ev: React.FocusEvent<HTMLElement>) => void;
  readonly onFocus?: (ev: React.FocusEvent<HTMLElement>) => void;
  readonly style?: React.CSSProperties;
  readonly tabIndex?: number;
  readonly tag?: keyof React.JSX.IntrinsicElements;
}

export interface ImageWithZoomProps extends Omit<CarouselElement<"div">, "onError" | "onLoad"> {
  readonly alt?: string;
  readonly bgImageProps?: CarouselElement<"div"> & {
    hasMasterSpinner?: boolean;
    [key: string]: unknown;
  };
  readonly bgImageTag?: keyof React.JSX.IntrinsicElements;
  readonly className?: string;
  readonly imageClassName?: string;
  readonly isPinchZoomEnabled?: boolean;
  readonly isZoomed?: boolean;
  readonly onError?: (ev?: React.SyntheticEvent<HTMLElement> | Event) => void;
  readonly onLoad?: (ev?: React.SyntheticEvent<HTMLElement> | Event) => void;
  readonly overlayClassName?: string;
  readonly src: string;
  readonly srcZoomed?: string;
  readonly tag?: keyof React.JSX.IntrinsicElements;
  readonly spinner?: () => React.ReactNode;
  readonly width?: number | string;
  readonly height?: number | string;
}

export interface ImageProps extends Omit<CarouselElement<"img">, "onError" | "onLoad" | "src"> {
  readonly alt?: string;
  readonly bgImageProps?: CarouselElement<"div"> & {
    hasMasterSpinner?: boolean;
    [key: string]: unknown;
  };
  readonly bgImageTag?: keyof React.JSX.IntrinsicElements;
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly classNameError?: string;
  readonly classNameLoading?: string;
  readonly classNameSuccess?: string;
  readonly hasMasterSpinner?: boolean;
  readonly isBgImage?: boolean;
  readonly onError?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
  readonly onLoad?: (ev: React.SyntheticEvent<HTMLElement> | Event) => void;
  readonly renderError?: () => React.ReactNode;
  readonly renderLoading?: () => React.ReactNode;
  readonly src: string;
  readonly style?: React.CSSProperties;
  readonly tag?: keyof React.JSX.IntrinsicElements;
  readonly width?: number | string;
  readonly height?: number | string;
}

export interface RenderDotsProps {
  readonly currentSlide?: number;
  readonly totalSlides?: number;
  readonly visibleSlides?: number;
  readonly disableActiveDots?: boolean;
  readonly showAsSelectedForCurrentSlideOnly?: boolean;
}

export interface DotGroupProps extends CarouselElement<"div"> {
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly currentSlide?: number;
  readonly totalSlides?: number;
  readonly visibleSlides?: number;
  readonly dotNumbers?: boolean;
  readonly disableActiveDots?: boolean;
  readonly showAsSelectedForCurrentSlideOnly?: boolean;
  readonly renderDots?: (
    props: DotGroupProps & Partial<CarouselState> & CarouselInjectedProps,
  ) => React.ReactNode;
}

export interface DotProps extends CarouselElement<"button"> {
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
  readonly selected?: boolean;
  readonly slide: number;
}

export interface ButtonBackProps extends CarouselElement<"button"> {
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonNextProps extends CarouselElement<"button"> {
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonLastProps extends CarouselElement<"button"> {
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonFirstProps extends CarouselElement<"button"> {
  readonly children?: React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ButtonPlayProps extends CarouselElement<"button"> {
  readonly children?: React.ReactNode;
  readonly childrenPaused?: React.ReactNode;
  readonly childrenPlaying?: React.ReactNode;
  readonly className?: string;
  readonly disabled?: boolean;
  readonly onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface SpinnerProps extends CarouselElement<"div"> {
  readonly className?: string;
}

export type MapStateToProps<TStateProps> = (state: CarouselState) => TStateProps;

export interface WithStoreInterface {
  <CustomProps, CustomStateProps = {}>(
    component: React.ComponentType<CustomProps & CustomStateProps & CarouselInjectedProps>,
    mapStateToProps?: MapStateToProps<CustomStateProps>,
  ): React.ComponentType<CustomProps>;
  <P extends object, T = {}>(
    component: React.ComponentType<P>,
    mapStateToProps?: MapStateToProps<T>,
  ): React.ComponentType<
    Omit<P, keyof (T & CarouselInjectedProps)> & Partial<T & CarouselInjectedProps>
  >;
}

export declare const WithStore: WithStoreInterface;
export declare const CarouselProvider: React.ComponentType<CarouselProviderProps>;
export declare const CarouselContext: React.Context<CarouselStoreInterface>;
export declare const Slider: React.ComponentType<SliderProps>;
export declare const SliderView: React.ComponentType<
  SliderProps & CarouselState & CarouselInjectedProps
>;
export declare const Slide: React.ComponentType<SlideProps>;
export declare const SlideView: React.ComponentType<
  SlideProps & CarouselState & CarouselInjectedProps
>;
export declare const ImageWithZoom: React.ComponentType<ImageWithZoomProps>;
export declare const ImageWithZoomView: React.ComponentType<
  ImageWithZoomProps & CarouselState & CarouselInjectedProps
>;
export declare const Image: React.ComponentType<ImageProps>;
export declare const ImageView: React.ComponentType<
  ImageProps & CarouselState & CarouselInjectedProps
>;
export declare const DotGroup: React.ComponentType<DotGroupProps>;
export declare const DotGroupView: React.ComponentType<
  DotGroupProps & CarouselState & CarouselInjectedProps
>;
export declare const Dot: React.ComponentType<DotProps>;
export declare const DotView: React.ComponentType<DotProps & CarouselState & CarouselInjectedProps>;
export declare const ButtonBack: React.ComponentType<ButtonBackProps>;
export declare const ButtonBackView: React.ComponentType<
  ButtonBackProps & CarouselState & CarouselInjectedProps
>;
export declare const ButtonNext: React.ComponentType<ButtonNextProps>;
export declare const ButtonNextView: React.ComponentType<
  ButtonNextProps & CarouselState & CarouselInjectedProps
>;
export declare const ButtonLast: React.ComponentType<ButtonLastProps>;
export declare const ButtonLastView: React.ComponentType<
  ButtonLastProps & CarouselState & CarouselInjectedProps
>;
export declare const ButtonFirst: React.ComponentType<ButtonFirstProps>;
export declare const ButtonFirstView: React.ComponentType<
  ButtonFirstProps & CarouselState & CarouselInjectedProps
>;
export declare const ButtonPlay: React.ComponentType<ButtonPlayProps>;
export declare const ButtonPlayView: React.ComponentType<
  ButtonPlayProps & CarouselState & CarouselInjectedProps
>;
export declare const Spinner: React.ComponentType<SpinnerProps>;
export declare const SpinnerView: React.ComponentType<SpinnerProps>;
export declare class Store implements CarouselStoreInterface {
  constructor(initialState?: Partial<CarouselState>);
  readonly state: CarouselState;
  getStoreState(): CarouselState;
  setStoreState(newState: Partial<CarouselState>, callback?: () => void): void;
  subscribe(callback: () => void): void;
  unsubscribe(callback: () => void): void;
  updateSubscribers(callback?: (state: CarouselState) => void): void;
  subscribeMasterSpinner(src: string): void;
  unsubscribeMasterSpinner(src: string): false | object | boolean | void;
  unsubscribeAllMasterSpinner(): void;
  masterSpinnerSuccess(src: string): void;
  masterSpinnerError(src: string): void;
  isMasterSpinnerFinished(): boolean;
}
