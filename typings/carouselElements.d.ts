import * as React from 'react'

interface SliderProps {
  readonly children: React.ReactNode
  readonly className?: string
  readonly onMasterSpinner?: () => void
  readonly style?: {}
  readonly trayTag?: string
}
type SliderInterface = React.ComponentClass<SliderProps>
/**
 * A Slider is a viewport that masks slides. The Slider component must wrap one or more Slide components.
 */
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
/**
 * The Slide component is a container with an intrinsic ratio computed by the
 * CarouselProvider naturalSlideWidth and naturalSlideHeight properties.
 * By default, only one slide is visible in the Slider at a time.
 * You can change this by altering the visibleSlides property of the CarouselProvider.
 * Slide components also contain a div that acts as an aria compliant focus ring when
 * the Slide receives focus either by using a keyboard tab, mouse click, or touch.
 */
declare const Slide: SlideInterface



interface ImageWithZoomProps {
  readonly src: string
  readonly tag?: string
}
type ImageWithZoomInterface = React.ComponentClass<ImageWithZoomProps>
declare const ImageWithZoom: ImageWithZoomInterface



interface ImageProps {
  readonly alt?: string
  readonly children?: React.ReactNode
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
/**
 * A compound component that creates a bunch of Dot's automatically for you.
 */
declare const DotGroup: DotGroupInterface



interface DotProps {
  readonly children: React.ReactChild
  readonly className?: string
  readonly disabled?: boolean
  readonly onClick?: () => void
  readonly slide: number
}
type DotInterface = React.ComponentClass<DotProps>
/**
 * A Dot component is a HTML button. Dots directly correlate to slides. Clicking on a dot causes it's correlating slide to scroll into the left-most visible slot of slider. The dots for currently visible slides cause are disabled. You can override the auto-disable feature by setting disabled to false (see table below)
 */
declare const Dot: DotInterface



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
  Dot,
  DotGroup,
  Image,
  ImageWithZoom,
  Slide,
  Slider
}
