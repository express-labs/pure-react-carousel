// Type definitions for pure-react-carousel 1.10.0
// Definitions by: Jedrzej Lewandowski <https://github.com/TheFullResolution>
// TypeScript Version: 2.6.1

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

interface CarouselState {
  readonly currentSlide: number
  readonly disableAnimation: boolean
  readonly hasMasterSpinner: boolean
  readonly imageErrorCount: number
  readonly imageSuccessCount: number
  readonly lockOnWindowScroll: boolean
  readonly masterSpinnerThreshold: number
  readonly naturalSlideHeight: number
  readonly naturalSlideWidth: number
  readonly orientation: 'horizontal' | 'vertical'
  readonly slideSize: number
  readonly slideTraySize: number
  readonly step: number
  readonly totalSlides: number
  readonly touchEnabled: boolean
  readonly visibleSlides: number
}

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
  readonly visibleSlides?: CarouselState['visibleSlides']
}

type CarouselProviderInterface = React.ComponentClass<CarouselProviderProps>
/**
 * CarouselProvider allows the other carousel components to communicate with each other.
 *
 * The only required properties are:
 * the orientation, naturalSlideWidth, and naturalSlideHeight.
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
  readonly setStoreState: (state: CarouselState) => void
  readonly unsubscribeAllMasterSpinner: () => void
}

// Diff / Omit taken from https://github.com/Microsoft/TypeScript/issues/12215#issuecomment-311923766
type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { readonly [x: string]: never })[T]
type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>

type MapStateToProps<TStateProps> = (state: CarouselState) => TStateProps

interface WithStoreInterface {
  <CustomProps extends CarouselInjectedProps>(
    component: React.ComponentClass<CustomProps>
  ): React.ComponentClass<Omit<CustomProps, keyof CarouselInjectedProps>> & {
    readonly WrappedComponent: React.ComponentClass<CustomProps>
  }

  <CustomProps extends CarouselInjectedProps, CustomStateProps>(
    component: React.ComponentClass<CustomProps & CustomStateProps>,
    state: MapStateToProps<CustomStateProps>
  ): React.ComponentClass<Omit<CustomProps, keyof CarouselInjectedProps>> & {
    readonly WrappedComponent: React.ComponentClass<
      CustomProps & CustomStateProps
    >
  }
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
  CarouselProvider,
  Dot,
  DotGroup,
  Image,
  ImageWithZoom,
  Slide,
  Slider,
  WithStore
}
