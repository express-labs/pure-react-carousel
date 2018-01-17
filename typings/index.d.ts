// Type definitions for pure-react-carousel 1.9.11
// Definitions by: Jedrzej Lewandowski <https://github.com/TheFullResolution>
// TypeScript Version: 2.6.2

import * as React from 'react'
import {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  Dot,
  DotGroup,
  Image,
  ImageWithZoom,
  Slide,
  Slider
} from './carouselElements.d'

type ComponentClass<P> = React.ComponentClass<P>;
type StatelessComponent<P> = React.StatelessComponent<P>;
type Component<P> = React.ComponentType<P>;

// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
type Diff<T extends string, U extends string> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

interface CarouselState {
  currentSlide: number
  disableAnimation: boolean
  hasMasterSpinner: boolean
  imageErrorCount: number
  imageSuccessCount: number
  lockOnWindowScroll: boolean
  masterSpinnerThreshold: number
  naturalSlideHeight: number
  naturalSlideWidth: number
  orientation: 'horizontal' | 'vertical'
  slideSize: number
  slideTraySize: number
  step: number
  totalSlides: number
  touchEnabled: boolean
  visibleSlides: number
}

/**
 * CarouselProvider allows the other carousel components to communicate with each other.
 * The only required properties are the orientation, naturalSlideWidth, and naturalSlideHeight.
 * The naturalSlideWidth and naturalSlideHeight are used to create an aspect ratio for each slide.
 * Since the carousel is responsive by default, it will stretch to fill in the width of it's parent container.
 * The CarouselProvider must also have children.
 */
interface CarouselProviderProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly currentSlide?: CarouselState['currentSlide']
  readonly disableAnimation?: CarouselState['disableAnimation']
  readonly hasMasterSpinner?: CarouselState['hasMasterSpinner']
  readonly lockOnWindowScroll?: CarouselState['lockOnWindowScroll']
  readonly naturalSlideHeight: CarouselState['naturalSlideHeight']
  readonly naturalSlideWidth: CarouselState['naturalSlideWidth']
  readonly orientation?: CarouselState['orientation']
  readonly step?: CarouselState['step']
  readonly tag?: string
  readonly totalSlides: CarouselState['totalSlides']
  readonly touchEnabled?: CarouselState['touchEnabled']
  readonly visibleSlides?:  CarouselState['visibleSlides']
}


type CarouselProviderInterface = React.ComponentClass<CarouselProviderProps>
declare const CarouselProvider: CarouselProviderInterface

interface InjectedProps {
  setStoreState: ({}: CarouselState) => void
}

export interface InferableComponentEnhancerWithProps<TInjectedProps, TNeedsProps> {
    <P extends TInjectedProps>(
        component: Component<P>
    ): ComponentClass<Omit<P, keyof TInjectedProps> & TNeedsProps> & {WrappedComponent: Component<P>}
}


type InferableComponentEnhancer<TInjectedProps> =
    InferableComponentEnhancerWithProps<TInjectedProps, {}>

interface WithStoreInterface {
  (): InferableComponentEnhancer<InjectedProps>
}

declare const WithStore: WithStoreInterface

export {
  ButtonBack,
  ButtonFirst,
  ButtonLast,
  ButtonNext,
  CarouselProvider,
  Dot,
  DotGroup,
  Image,
  ImageWithZoom,
  Slide,
  Slider,
  WithStore
}
