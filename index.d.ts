// Type definitions for pure-react-carousel 1.9.11
// Definitions by: Jedrzej Lewandowski <https://github.com/TheFullResolution>
// TypeScript Version: 2.6.2

import * as React from 'react'

interface SliderProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly onMasterSpinner?: () => void
  readonly style?: {}
  readonly trayTag?: string
}
type SliderInterface = React.ComponentClass<SliderProps>
declare const Slider: SliderInterface

interface SlideProps {
  readonly className?: string
  readonly index: number
  readonly innerClassName?: string
  readonly innerTag?: string
  readonly onBlur?: () => void
  readonly onFocus?: () => void
  readonly tabIndex?: number
  readonly tag?: string
}
type SlideInterface = React.ComponentClass<SlideProps>
declare const Slide: SlideInterface

interface ImageWithZoomProps {
  readonly src: string
  readonly tag?: string
}
type ImageWithZoomInterface = React.ComponentClass<ImageWithZoomProps>
declare const ImageWithZoom: ImageWithZoomInterface

interface ImageProps {
  readonly alt?: string
  readonly children: React.ReactNode
  readonly className?: string
  readonly hasMasterSpinner: boolean
  readonly isBgImage?: boolean
  readonly onError?: () => void
  readonly onLoad?: () => void
  readonly renderError?: () => void
  readonly renderLoading?: () => void
  readonly src: string
  readonly style?: {
    readonly [key: string]: string
  }
  readonly tag?: string
}
type ImageInterface = React.ComponentClass<ImageProps>
declare const Image: ImageInterface

interface DotGroupProps {
  readonly children?: React.ReactNode
  readonly className?: string
  readonly dotNumbers?: boolean
}
type DotGroupInterface = React.ComponentClass<DotGroupProps>
declare const DotGroup: DotGroupInterface

interface DotProps {
  readonly children: React.ReactChild
  readonly className?: string
  readonly disabled?: boolean
  readonly onClick?: () => void
  readonly slide: number
}
type DotInterface = React.ComponentClass<DotProps>
declare const Dot: DotInterface

interface CarouselProviderProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly currentSlide?: number
  readonly disableAnimation?: boolean
  readonly hasMasterSpinner?: boolean
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

interface ButtonNextProps {
  readonly children: React.ReactChild
  readonly className?: string
  readonly onClick?: () => void
}
type ButtonNextInterface = React.ComponentClass<ButtonNextProps>
declare const ButtonNext: ButtonNextInterface

interface ButtonBackProps {
  readonly children: React.ReactChild
  readonly className?: string
  readonly onClick?: () => void
}
type ButtonBackInterface = React.ComponentClass<ButtonBackProps>
declare const ButtonBack: ButtonBackInterface

interface ButtonLastProps {
  readonly children: React.ReactChild
  readonly className?: string
  readonly onClick?: () => void
}
type ButtonLastInterface = React.ComponentClass<ButtonLastProps>
declare const ButtonLast: ButtonLastInterface

interface ButtonFirstProps {
  readonly children: React.ReactChild
  readonly className?: string
  readonly onClick?: () => void
}
type ButtonFirstInterface = React.ComponentClass<ButtonFirstProps>
declare const ButtonFirst: ButtonLastInterface

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
