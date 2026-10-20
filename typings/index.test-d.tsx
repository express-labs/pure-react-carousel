import * as React from "react";
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
  NativeSlider,
  NativeSliderView,
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
  type ClassValue,
  type DefaultCarouselConfig,
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
  type MemoizedPresenterProps,
  type MutableCarouselStatePatch,
  type NativeSliderProps,
  type NativeSliderViewProps,
  type Orientation,
  type OrientationType,
  type PlayDirection,
  type RenderDotsProps,
  type ScrollSnapAlign,
  type ScrollSnapStop,
  type ScrollSnapType,
  type SlideProps,
  type SliderDragState,
  type SliderProps,
  type SliderViewProps,
  type SlideViewProps,
  type SpinnerProps,
  type SpinnerViewProps,
  type Tag,
  type TouchCoordinates,
  type TouchPointCacheEntry,
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
    pauseOnInteract: false,
    playDirection: "forward",
    snapAlign: "start",
    snapStop: "normal",
    snapType: "mandatory",
    step: 1,
    dragStep: 1,
    tag: "section",
    touchEnabled: true,
    dragEnabled: true,
    children: null,
  };

  const sliderProps: SliderProps = {
    className: "custom-slider",
    classNameAnimation: "custom-anim",
    classNameTray: "custom-tray",
    classNameTrayWrap: "custom-tray-wrap",
    disableAnimation: false,
    disableKeyboard: false,
    dragClickThreshold: 5,
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
    snapAlign: "center",
    snapStop: "always",
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
    dotProps: { role: "tab" },
    getDotProps: (index, selected, slideIndex) => ({
      "aria-label": `Slide ${index + 1} (${slideIndex})`,
      "aria-selected": selected,
    }),
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
      <NativeSlider {...nativeSliderPropsContract}>
        <Slide {...slideProps} />
      </NativeSlider>
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

export const nativeSliderPropsContract: NativeSliderProps = {
  ariaLabel: "native-slider",
  backwardKeyCode: 37,
  className: "custom-native-slider",
  classNameTray: "custom-native-tray",
  classNameTrayWrap: "custom-native-tray-wrap",
  disableAnimation: false,
  disableKeyboard: false,
  forwardKeyCode: 39,
  hideScrollbar: true,
  onMasterSpinner: () => <span>Loading...</span>,
  role: "listbox",
  snapType: "mandatory",
  spinner: () => <Spinner className="custom-spinner" />,
  tabIndex: 0,
  trayProps: {
    "aria-label": "native-tray",
  },
  trayTag: "div",
  children: null,
};

// 2. Verify WithStore Overloads: Inferred No-Mapper, Single-Type-Argument, and Two-Type-Argument Contracts
interface CustomNoMapperViewProps extends CarouselInjectedProps {
  items: string[];
  label?: string;
}

const CustomNoMapperView = ({ items, label }: CustomNoMapperViewProps) => (
  <div data-label={label}>{items.length}</div>
);

export const ConnectedNoMapper = WithStore(CustomNoMapperView);

interface SingleArgOwnProps {
  items: string[];
  deviceWidth?: number;
}

interface SingleArgMappedState {
  currentSlide: number;
  visibleSlides: number;
}

const SingleArgView = ({
  items,
  deviceWidth,
  currentSlide,
  visibleSlides,
}: SingleArgOwnProps & Partial<SingleArgMappedState> & CarouselInjectedProps) => (
  <div data-width={deviceWidth} data-slide={currentSlide} data-visible={visibleSlides}>
    {items.length}
  </div>
);

const mapSingleArgState = (state: CarouselState): SingleArgMappedState => ({
  currentSlide: state.currentSlide,
  visibleSlides: state.visibleSlides,
});

export const ConnectedSingleArg = WithStore<SingleArgOwnProps>(SingleArgView, mapSingleArgState);

const withStoreViaInterface: WithStoreInterface = WithStore;
export const ConnectedNoMapperViaInterface = withStoreViaInterface(CustomNoMapperView);
export const ConnectedSingleArgViaInterface = withStoreViaInterface<SingleArgOwnProps>(
  SingleArgView,
  mapSingleArgState,
);

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

export const VerifyWithStoreOwnPropChecking = (): React.ReactElement => (
  <div>
    <ConnectedNoMapper items={["a", "b"]} label="valid" />
    <ConnectedNoMapperViaInterface items={["a"]} />
    <ConnectedSingleArg items={["a", "b"]} deviceWidth={1024} />
    <ConnectedSingleArgViaInterface items={["a"]} />
    <ConnectedThumbnails items={["a", "b"]} />

    {/* @ts-expect-error -- required own prop `items` cannot be omitted on inferred no-mapper WithStore component */}
    <ConnectedNoMapper label="missing-items" />
    {/* @ts-expect-error -- own prop `items` must be string[] on inferred no-mapper WithStore component */}
    <ConnectedNoMapper items={123} />
    {/* @ts-expect-error -- required own prop `items` cannot be omitted on WithStoreInterface no-mapper component */}
    <ConnectedNoMapperViaInterface />
    {/* @ts-expect-error -- required own prop `items` cannot be omitted on single-type-arg WithStore component */}
    <ConnectedSingleArg deviceWidth={1024} />
    {/* @ts-expect-error -- own prop `items` must be string[] on single-type-arg WithStore component */}
    <ConnectedSingleArg items="invalid" />
    {/* @ts-expect-error -- required own prop `items` cannot be omitted on WithStoreInterface single-type-arg component */}
    <ConnectedSingleArgViaInterface />
    {/* @ts-expect-error -- required own prop `items` cannot be omitted on two-type-arg WithStore component */}
    <ConnectedThumbnails />
    {/* @ts-expect-error -- own prop `items` must be string[] on two-type-arg WithStore component */}
    <ConnectedThumbnails items={[123]} />
  </div>
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
  NativeSliderViewProps,
  SlideViewProps,
  SliderViewProps,
  SpinnerViewProps,
  CarouselElement<"div">,
  CarouselStoreState,
  ClassValue,
  DefaultCarouselConfig,
  DirectionType,
  ImageStatus,
  MapStateToProps<{ currentSlide: number }>,
  MasterSpinnerSubscription,
  MemoizedPresenterProps<{ currentSlide: number }>,
  MutableCarouselStatePatch,
  Orientation,
  OrientationType,
  PlayDirection,
  RenderDotsProps,
  ScrollSnapAlign,
  ScrollSnapStop,
  ScrollSnapType,
  SliderDragState,
  Tag,
  TouchCoordinates,
  TouchPointCacheEntry,
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
  typeof NativeSliderView,
  typeof SlideView,
  typeof SliderView,
  typeof SpinnerView,
  typeof CarouselContext,
];

// 6. Verify CarouselState & Store.state Fields Are Readonly
export const verifyReadonlyCarouselState = (): void => {
  const store = new Store({});
  const stateFromGetter = store.getStoreState();

  // @ts-expect-error -- CarouselState fields returned by getStoreState() are readonly because Store deep-freezes state
  stateFromGetter.currentSlide = 1;
  // @ts-expect-error -- CarouselState fields on store.state are readonly
  store.state.currentSlide = 1;
  // @ts-expect-error -- CarouselState fields on CarouselStoreInterface.state are readonly
  mockFullCarouselStore.state.isPlaying = true;
};

// 7. Verify Slider and NativeSlider trayProps / trayWrapProps and Slide innerProps Reject Unsupported ref Prop
export const verifyInnerWrapperPropsRejectRef = (): React.ReactElement => {
  const divRef = React.createRef<HTMLDivElement>();
  return (
    <>
      <Slider
        // @ts-expect-error -- trayProps.ref is discarded at runtime and unsupported in the public SliderProps contract
        trayProps={{ ref: divRef }}
      >
        <div>Slide</div>
      </Slider>
      <Slider
        // @ts-expect-error -- trayWrapProps.ref is discarded at runtime and unsupported in the public SliderProps contract
        trayWrapProps={{ ref: divRef }}
      >
        <div>Slide</div>
      </Slider>
      <NativeSlider
        // @ts-expect-error -- trayProps.ref is discarded at runtime and unsupported in the public NativeSliderProps contract
        trayProps={{ ref: divRef }}
      >
        <div>Slide</div>
      </NativeSlider>
      <NativeSlider
        // @ts-expect-error -- trayWrapProps.ref is discarded at runtime and unsupported in the public NativeSliderProps contract
        trayWrapProps={{ ref: divRef }}
      >
        <div>Slide</div>
      </NativeSlider>
      <Slide
        index={0}
        // @ts-expect-error -- innerProps.ref is discarded at runtime and unsupported in the public SlideProps contract
        innerProps={{ ref: divRef }}
      />
    </>
  );
};

// 7b. Verify Ref Forwarding and Inner Wrapper Escape Hatch Props Across Public Components
export const verifyRefForwardingAndEscapeHatches = (): React.ReactElement => {
  const divRef = React.createRef<HTMLDivElement>();
  const buttonRef = React.createRef<HTMLButtonElement>();
  const imgRef = React.createRef<HTMLImageElement>();

  return (
    <CarouselProvider ref={divRef} naturalSlideWidth={100} naturalSlideHeight={100} totalSlides={3}>
      <Slider ref={divRef} trayWrapProps={{ "aria-label": "Tray Wrap" }}>
        <Slide ref={divRef} index={0} innerProps={{ role: "group", "aria-label": "Inner Slide" }}>
          <Image ref={imgRef} src="img.jpg" alt="test" />
          <ImageWithZoom
            ref={divRef}
            src="img.jpg"
            overlayProps={{ role: "application", "aria-label": "Zoom" }}
          />
        </Slide>
      </Slider>
      <NativeSlider ref={divRef} trayWrapProps={{ "aria-label": "Native Tray Wrap" }}>
        <Slide ref={divRef} index={0} />
      </NativeSlider>
      <ButtonFirst ref={buttonRef} />
      <ButtonBack ref={buttonRef} />
      <ButtonNext ref={buttonRef} />
      <ButtonLast ref={buttonRef} />
      <ButtonPlay ref={buttonRef} />
      <Dot ref={buttonRef} slide={0} />
      <DotGroup ref={divRef} />
      <Spinner ref={divRef} />
    </CarouselProvider>
  );
};

// 8. Verify CarouselProvider Rejects Slider-Only Touch Scroll Threshold Props (#470)
export const verifyCarouselProviderRejectsSliderTouchThresholdProps = (): React.ReactElement => (
  <>
    <CarouselProvider
      naturalSlideWidth={100}
      naturalSlideHeight={100}
      totalSlides={3}
      // @ts-expect-error -- preventVerticalScrollOnTouch is a Slider prop, not a CarouselProvider prop
      preventVerticalScrollOnTouch
    >
      <div>Slide</div>
    </CarouselProvider>
    <CarouselProvider
      naturalSlideWidth={100}
      naturalSlideHeight={100}
      totalSlides={3}
      // @ts-expect-error -- horizontalPixelThreshold is a Slider prop, not a CarouselProvider prop
      horizontalPixelThreshold={15}
    >
      <div>Slide</div>
    </CarouselProvider>
    <CarouselProvider
      naturalSlideWidth={100}
      naturalSlideHeight={100}
      totalSlides={3}
      // @ts-expect-error -- verticalPixelThreshold is a Slider prop, not a CarouselProvider prop
      verticalPixelThreshold={10}
    >
      <div>Slide</div>
    </CarouselProvider>
  </>
);
