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

interface CarouselState {
  currentSlide: number
  disableAnimation: boolean
  hasMasterSpinner: boolean
  imageErrorCount: number
  imageSuccessCount: number
  lockOnWindowScroll: boolean
  masterSpinnerThreshold: number
  naturalSlideHeight: naturalSlideHeight
  naturalSlideWidth: naturalSlideWidth
  orientation: orientation
  slideSize: slideSize
  slideTraySize: slideTraySize
  step: step
  totalSlides: totalSlides
  touchEnabled: touchEnabled
  visibleSlides: visibleSlides
}

interface CarouselProviderProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly currentSlide?: number
  readonly disableAnimation?: boolean
  readonly hasMasterSpinner?: boolean
  readonly lockOnWindowScroll?: boolean
  readonly naturalSlideHeight: number
  readonly naturalSlideWidth: number
  readonly orientation?: 'horizontal' | 'vertical'
  readonly step?: number
  readonly tag?: string
  readonly totalSlides: number
  readonly touchEnabled?: boolean
  readonly visibleSlides?: boolean
}
type CarouselProviderInterface = React.ComponentClass<CarouselProviderProps>
declare const CarouselProvider: CarouselProviderInterface

interface EnhancedComponent {}

interface WithStoreInterface {
  (): EnhancedComponent
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
  Slider
}
