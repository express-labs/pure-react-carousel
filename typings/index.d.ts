// Type definitions for pure-react-carousel 1.12.0
// Definitions by: Jedrzej Lewandowski <https://github.com/TheFullResolution>
// TypeScript Version: 2.7.2

import React from 'react'
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  ButtonPlay,
  Dot,
  DotGroup,
  Image,
  ImageWithZoom,
  Slide,
  Slider,
  SliderProps,
  SlideProps,
  ImageWithZoomProps,
  ImageProps,
  DotGroupProps,
  DotProps,
  ButtonBackProps,
  ButtonNextProps,
  ButtonLastProps,
  ButtonFirstProps,
  ButtonPlayProps
} from './carouselElements'

interface CarouselState {
  readonly currentSlide: number
  readonly disableAnimation: boolean
  readonly disableKeyboard: boolean
  readonly hasMasterSpinner: boolean
  readonly imageErrorCount: number
  readonly imageSuccessCount: number
  readonly isPlaying: boolean
  readonly lockOnWindowScroll: boolean
  readonly preventVerticalScrollOnTouch: boolean
  readonly horizontalPixelThreshold: number
  readonly verticalPixelThreshold: number,
  readonly masterSpinnerFinished: boolean
  readonly masterSpinnerThreshold: number
  readonly naturalSlideHeight: number
  readonly naturalSlideWidth: number
  readonly orientation: 'horizontal' | 'vertical'
  readonly slideSize: number
  readonly slideTraySize: number
  readonly step: number
  readonly dragStep: number
  readonly totalSlides: number
  readonly touchEnabled: boolean
  readonly dragEnabled: boolean
  readonly visibleSlides: number
  readonly infinite: boolean
  readonly isIntrinsicHeight: boolean
}

interface CarouselStoreInterface {
  readonly state: CarouselState
  readonly setStoreState: (state: Partial<CarouselState>) => void
  readonly getStoreState: () => CarouselState
  readonly subscribe: (func: () => void) => void
  readonly unsubscribe: (func: () => void) => void
  readonly updateSubscribers: (cb?: (state: CarouselState) => void) => void
  readonly subscribeMasterSpinner: (src: string) => void
  readonly unsubscribeMasterSpinner: (src: string) => false | object
  readonly unsubscribeAllMasterSpinner: () => void
  readonly masterSpinnerSuccess: (src: string) => void
  readonly masterSpinnerError: (src: string) => void
  readonly setMasterSpinnerFinished: () => void
  readonly isMasterSpinnerFinished: () => boolean
}

declare const CarouselContext: React.Context<CarouselStoreInterface>

interface CarouselProviderProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly currentSlide?: CarouselState['currentSlide']
  readonly disableAnimation?: CarouselState['disableAnimation']
  readonly disableKeyboard?: CarouselState['disableKeyboard']
  readonly hasMasterSpinner?: CarouselState['hasMasterSpinner']
  readonly interval?: number
  readonly isPlaying?: CarouselState['isPlaying']
  readonly lockOnWindowScroll?: CarouselState['lockOnWindowScroll']
  readonly preventVerticalScrollOnTouch?: CarouselState['preventVerticalScrollOnTouch']
  readonly horizontalPixelThreshold?: CarouselState['horizontalPixelThreshold']
  readonly verticalPixelThreshold?: CarouselState['verticalPixelThreshold'],
  readonly naturalSlideHeight: CarouselState['naturalSlideHeight']
  readonly naturalSlideWidth: CarouselState['naturalSlideWidth']
  readonly playDirection?: 'forward' | 'backward'
  readonly orientation?: CarouselState['orientation']
  readonly step?: CarouselState['step']
  readonly dragStep?: CarouselState['dragStep']
  readonly tag?: string
  readonly totalSlides: CarouselState['totalSlides']
  readonly touchEnabled?: CarouselState['touchEnabled']
  readonly dragEnabled?: CarouselState['dragEnabled']
  readonly visibleSlides?: CarouselState['visibleSlides']
  readonly infinite?: CarouselState['infinite']
  readonly isIntrinsicHeight?: CarouselState['isIntrinsicHeight']
}

type CarouselProviderInterface = React.ComponentType<CarouselProviderProps>
/**
 * CarouselProvider allows the other carousel components to communicate with each other.
 *
 * The only required properties are:
 * the totalSlides, naturalSlideWidth, and naturalSlideHeight.
 *
 * The naturalSlideWidth and naturalSlideHeight are used
 * to create an aspect ratio for each slide.
 *
 * Since the carousel is responsive by default,
 * it will stretch to fill in the width of it's parent container.
 *
 * The CarouselProvider must also have children.
 */
declare const CarouselProvider: CarouselProviderInterface

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

type MapStateToProps<TStateProps> = (state: CarouselState) => TStateProps

interface WithStoreInterface {
  <CustomProps, CustomStateProps = {}>(
    component: React.ComponentType<CustomProps & CustomStateProps & CarouselInjectedProps>,
    mapStateToProps?: MapStateToProps<CustomStateProps>
  ): React.ComponentType<CustomProps>
}
/**
 * Use this HOC to pass CarouselProvider state properties as props to a component.
 * Basically, Your custom component must be an descendant of <CarouselProvider>.
 * It doesn't have to be a direct descendant,
 * it just needs to be between some the opening and closing CarouselProvider tags somewhere.
 *
 * <CarouselProvider>
 *  <YourComponentHere />
 * </CarouselProvider>
 *
 * WithStore has two arguments:
 *  WithStore([component], [mapstateToProps])
 *
 *  The first argument is the component to wrap (ex: YourComponentHere) and it's required.
 *
 *  The second argument is optional.
 *  It is a "map state to props" function that you must create.
 *
 */
declare const WithStore: WithStoreInterface

export {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  ButtonPlay,
  CarouselStoreInterface,
  CarouselContext,
  CarouselProvider,
  CarouselProviderProps,
  Dot,
  DotGroup,
  Image,
  ImageWithZoom,
  Slide,
  Slider,
  WithStore,
  SliderProps,
  SlideProps,
  ImageWithZoomProps,
  ImageProps,
  DotGroupProps,
  DotProps,
  ButtonBackProps,
  ButtonNextProps,
  ButtonLastProps,
  ButtonFirstProps,
  ButtonPlayProps
}
