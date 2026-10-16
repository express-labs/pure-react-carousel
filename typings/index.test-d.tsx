import React from "react";
import {
  ButtonBack,
  ButtonBackView,
  ButtonFirst,
  ButtonFirstView,
  ButtonLast,
  ButtonLastView,
  ButtonNext,
  ButtonNextView,
  ButtonPlay,
  ButtonPlayView,
  CarouselContext,
  CarouselProvider,
  Dot,
  DotGroup,
  DotGroupView,
  DotView,
  Image,
  ImageView,
  ImageWithZoom,
  ImageWithZoomView,
  Slide,
  Slider,
  SliderView,
  SlideView,
  Spinner,
  SpinnerView,
  Store,
  WithStore,
  type ButtonBackProps,
  type ButtonBackViewProps,
  type ButtonFirstProps,
  type ButtonFirstViewProps,
  type ButtonLastProps,
  type ButtonLastViewProps,
  type ButtonNextProps,
  type ButtonNextViewProps,
  type ButtonPlayProps,
  type ButtonPlayViewProps,
  type CarouselElement,
  type CarouselInjectedProps,
  type CarouselProviderProps,
  type CarouselState,
  type CarouselStoreInterface,
  type CarouselStoreState,
  type DirectionType,
  type DotGroupProps,
  type DotGroupViewProps,
  type DotProps,
  type DotViewProps,
  type ImageProps,
  type ImageStatus,
  type ImageViewProps,
  type ImageWithZoomProps,
  type ImageWithZoomViewProps,
  type MapStateToProps,
  type MasterSpinnerSubscription,
  type Orientation,
  type OrientationType,
  type PlayDirection,
  type RenderDotsProps,
  type SlideProps,
  type SliderProps,
  type SliderViewProps,
  type SlideViewProps,
  type SpinnerProps,
  type SpinnerViewProps,
  type Tag,
  type WithStoreInterface,
  type WithStoreProps,
} from "pure-react-carousel";

// 1. Verify Public Connected Components & app_express / raven-ui Consumer Contracts
export const PublicCarouselContractTest = (): React.ReactElement => {
  const providerProps: CarouselProviderProps = {
    naturalSlideWidth: 100,
    naturalSlideHeight: 125,
    totalSlides: 3,
    visibleSlides: 1,
    currentSlide: 0,
    isIntrinsicHeight: true,
    hasMasterSpinner: true,
    infinite: true,
    interval: 5000,
    isPlaying: false,
    lockOnWindowScroll: true,
    orientation: "horizontal",
    playDirection: "forward",
    step: 1,
    dragStep: 1,
    tag: "section",
    touchEnabled: true,
    dragEnabled: true,
    preventVerticalScrollOnTouch: true,
    horizontalPixelThreshold: 15,
    verticalPixelThreshold: 10,
    children: null,
  };

  const sliderProps: SliderProps = {
    className: "custom-slider",
    classNameAnimation: "custom-anim",
    classNameTray: "custom-tray",
    classNameTrayWrap: "custom-tray-wrap",
    disableAnimation: false,
    disableKeyboard: false,
    moveThreshold: 0.1,
    preventVerticalScrollOnTouch: true,
    horizontalPixelThreshold: 15,
    verticalPixelThreshold: 10,
    onMasterSpinner: () => <span>Loading...</span>,
    spinner: () => <Spinner className="custom-spinner" />,
    trayProps: {
      "aria-label": "tray",
    },
    trayTag: "div",
    children: null,
  };

  const slideProps: SlideProps = {
    index: 0,
    ariaLabel: "slide-0",
    className: "custom-slide",
    classNameHidden: "hidden",
    classNameVisible: "visible",
    innerClassName: "inner",
    innerTag: "div",
    isIntrinsicHeight: true,
    tabIndex: 0,
    tag: "div",
  };

  const imageProps: ImageProps = {
    src: "https://example.com/img.jpg",
    alt: "product",
    hasMasterSpinner: true,
    isBgImage: false,
    tag: "img",
    bgImageProps: {
      hasMasterSpinner: true,
      "data-testid": "bg-img",
    },
    bgImageTag: "div",
    renderLoading: () => <Spinner />,
    renderError: () => <span>Error</span>,
  };

  const imageWithZoomProps: ImageWithZoomProps = {
    src: "https://example.com/img.jpg",
    srcZoomed: "https://example.com/img-zoom.jpg",
    alt: "zoom-product",
    hasMasterSpinner: true,
    bgImageProps: {
      hasMasterSpinner: true,
      "data-testid": "zoom-bg",
    },
    bgImageTag: "div",
    imageClassName: "zoom-img",
    overlayClassName: "zoom-overlay",
    isPinchZoomEnabled: true,
    isZoomed: false,
    spinner: () => <Spinner />,
  };

  const backProps: ButtonBackProps = { disabled: false, className: "back" };
  const firstProps: ButtonFirstProps = { disabled: false, className: "first" };
  const lastProps: ButtonLastProps = { disabled: false, className: "last" };
  const nextProps: ButtonNextProps = { disabled: false, className: "next" };
  const playProps: ButtonPlayProps = {
    childrenPaused: "Play",
    childrenPlaying: "Pause",
    disabled: false,
  };
  const dotProps: DotProps = { slide: 0, selected: true, disabled: false };
  const dotGroupProps: DotGroupProps = {
    dotNumbers: true,
    disableActiveDots: true,
    showAsSelectedForCurrentSlideOnly: false,
    renderDots: (dotsProps: DotGroupViewProps) => <div>{dotsProps.totalSlides}</div>,
  };
  const spinnerProps: SpinnerProps = { className: "spinner" };

  return (
    <CarouselProvider {...providerProps}>
      <Slider {...sliderProps}>
        <Slide {...slideProps}>
          <Image {...imageProps} />
          <ImageWithZoom {...imageWithZoomProps} />
        </Slide>
      </Slider>
      <ButtonFirst {...firstProps}>First</ButtonFirst>
      <ButtonBack {...backProps}>Back</ButtonBack>
      <ButtonNext {...nextProps}>Next</ButtonNext>
      <ButtonLast {...lastProps}>Last</ButtonLast>
      <ButtonPlay {...playProps} />
      <Dot {...dotProps} />
      <DotGroup {...dotGroupProps} />
      <Spinner {...spinnerProps} />
    </CarouselProvider>
  );
};

// 2. Verify WithStore Overload 1 (Inferred View Component) & Overload 2 (Explicit CustomProps from raven-ui)
interface CustomThumbnailsProps extends CarouselInjectedProps {
  items: string[];
  currentSlide?: number;
}

const CustomThumbnailsBase = ({ items, currentSlide }: CustomThumbnailsProps) => (
  <div data-current={currentSlide}>{items.length}</div>
);

export const ConnectedThumbnails = WithStore<CustomThumbnailsProps, { currentSlide: number }>(
  CustomThumbnailsBase,
  (state: CarouselState) => ({
    currentSlide: state.currentSlide,
  }),
);

// 3. Verify CarouselInjectedProps['carouselStore'] Mock Shape (used by raven-ui CurrentSlideIndicator.test.tsx)
export const mockInjectedCarouselStore: NonNullable<CarouselInjectedProps["carouselStore"]> = {
  setStoreState: () => undefined,
  unsubscribeAllMasterSpinner: () => undefined,
  getStoreState: () => new Store().getStoreState(),
  masterSpinnerError: () => undefined,
  masterSpinnerSuccess: () => undefined,
  subscribeMasterSpinner: () => undefined,
  unsubscribeMasterSpinner: () => undefined,
};

// 4. Verify CarouselStoreInterface Mock Shape (used by raven-ui ImageWatcher.test.tsx)
export const mockFullCarouselStore: CarouselStoreInterface = {
  state: {
    currentSlide: 0,
    disableAnimation: false,
    disableKeyboard: false,
    hasMasterSpinner: false,
    imageErrorCount: 0,
    imageSuccessCount: 0,
    infinite: false,
    isIntrinsicHeight: false,
    isPlaying: false,
    lockOnWindowScroll: false,
    masterSpinnerFinished: false,
    masterSpinnerThreshold: 0,
    naturalSlideHeight: 100,
    naturalSlideWidth: 100,
    orientation: "horizontal",
    slideSize: 100,
    slideTraySize: 100,
    step: 1,
    dragStep: 1,
    totalSlides: 1,
    touchEnabled: true,
    dragEnabled: true,
    visibleSlides: 1,
  },
  getStoreState: () => new Store().getStoreState(),
  setStoreState: () => undefined,
  subscribe: () => undefined,
  unsubscribe: () => undefined,
  updateSubscribers: () => undefined,
  subscribeMasterSpinner: () => undefined,
  unsubscribeMasterSpinner: (_src: string): false | object => false,
  unsubscribeAllMasterSpinner: () => undefined,
  masterSpinnerSuccess: () => undefined,
  masterSpinnerError: () => undefined,
  isMasterSpinnerFinished: () => true,
};

// 5. Verify Unconnected View Exports & Exported Type Aliases
export type VerifyExportedTypes = [
  ButtonBackViewProps,
  ButtonFirstViewProps,
  ButtonLastViewProps,
  ButtonNextViewProps,
  ButtonPlayViewProps,
  DotViewProps,
  DotGroupViewProps,
  ImageViewProps,
  ImageWithZoomViewProps,
  SlideViewProps,
  SliderViewProps,
  SpinnerViewProps,
  CarouselElement<"div">,
  CarouselStoreState,
  DirectionType,
  ImageStatus,
  MapStateToProps<{ currentSlide: number }>,
  MasterSpinnerSubscription,
  Orientation,
  OrientationType,
  PlayDirection,
  RenderDotsProps,
  Tag,
  WithStoreInterface,
  WithStoreProps<ButtonBackViewProps, { currentSlide: number }>,
  typeof ButtonBackView,
  typeof ButtonFirstView,
  typeof ButtonLastView,
  typeof ButtonNextView,
  typeof ButtonPlayView,
  typeof DotView,
  typeof DotGroupView,
  typeof ImageView,
  typeof ImageWithZoomView,
  typeof SlideView,
  typeof SliderView,
  typeof SpinnerView,
  typeof CarouselContext,
];
