import React from 'react'

interface SliderProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children: React.ReactNode
  readonly className?: string
  readonly classNameAnimation?: string
  readonly classNameTray?: string
  readonly classNameTrayWrap?: string
  readonly moveThreshold?: number,
  readonly preventVerticalScrollOnTouch?: boolean
  readonly horizontalPixelThreshold?: number
  readonly verticalPixelThreshold?: number,
  readonly onMasterSpinner?: () => void
  readonly style?: {}
  readonly spinner?: () => void
  readonly trayTag?: string
  readonly trayProps?: React.HTMLAttributes<HTMLUListElement>
}
type SliderInterface = React.ComponentType<SliderProps>
/**
 * A Slider is a viewport that masks slides. The Slider component must wrap one or more Slide components.
 */
declare const Slider: SliderInterface



interface SlideProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly className?: string
  readonly classNameHidden?: string
  readonly classNameVisible?: string
  readonly index: number
  readonly innerClassName?: string
  readonly innerTag?: string
  readonly onBlur?: () => void
  readonly onFocus?: () => void
  readonly tabIndex?: number
  readonly tag?: string
  readonly style?: {}
}
type SlideInterface = React.ComponentType<SlideProps>
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
  readonly alt?: string
  readonly bgImageProps?: object
  readonly bgImageTag?: string
  readonly className?: string
  readonly imageClassName?: string
  readonly overlayClassName?: string
  readonly src: string
  readonly srcZoomed?: string
  readonly tag?: string
  readonly isPinchZoomEnabled?: boolean
}
type ImageWithZoomInterface = React.ComponentType<ImageWithZoomProps>
declare const ImageWithZoom: ImageWithZoomInterface



interface ImageProps extends React.HTMLAttributes<HTMLDivElement> {
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


interface RenderDotsProps {
  readonly currentSlide?: number,
  readonly totalSlides?: number,
  readonly visibleSlides?: number,
  readonly disableActiveDots?: boolean,
  readonly showAsSelectedForCurrentSlideOnly?: boolean,
}

type RenderDotsFunction = (props: RenderDotsProps) => void

interface DotGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children?: React.ReactNode
  readonly className?: string
  readonly dotNumbers?: boolean
  readonly currentSlide?: number,
  readonly totalSlides?: number,
  readonly visibleSlides?: number,
  readonly disableActiveDots?: boolean,
  readonly showAsSelectedForCurrentSlideOnly?: boolean,
  readonly renderDots?: RenderDotsFunction,
}
type DotGroupInterface = React.ComponentClass<DotGroupProps>
/**
 * A compound component that creates a bunch of Dot's automatically for you.
 */
declare const DotGroup: DotGroupInterface



interface DotProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly children?: React.ReactChild
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



interface ButtonNextProps extends React.HTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactChild
  readonly className?: string
  readonly disabled?: boolean
  readonly onClick?: (ev?: React.SyntheticEvent<HTMLButtonElement>) => void
}
type ButtonNextInterface = React.ComponentClass<ButtonNextProps>
/**
 * A button for moving the slider forwards. Forwards on a horizontal carousel means "move to the right". Backwards on a vertical carousel means "move to the bottom". The slider will traverse an amount of slides determined by the step property of CarouselProvider.
 */
declare const ButtonNext: ButtonNextInterface



interface ButtonBackProps extends React.HTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactChild
  readonly className?: string
  readonly disabled?: boolean
  readonly onClick?: (ev?: React.SyntheticEvent<HTMLButtonElement>) => void
}
type ButtonBackInterface = React.ComponentClass<ButtonBackProps>
/**
 * A button for moving the slider backwards. Backwards on a horizontal carousel means "move to the left". Backwards on a vertical carousel means "move to the top". The slider will traverse an amount of slides determined by the step property of CarouselProvider.
 */
declare const ButtonBack: ButtonBackInterface



interface ButtonLastProps extends React.HTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactChild
  readonly className?: string
  readonly disabled?: boolean
  readonly onClick?: (ev?: React.SyntheticEvent<HTMLButtonElement>) => void
}
type ButtonLastInterface = React.ComponentClass<ButtonLastProps>
/**
 * Moves the slider to the end of the slides (totalSlides - visibleSlides).
 */
declare const ButtonLast: ButtonLastInterface



interface ButtonFirstProps extends React.HTMLAttributes<HTMLButtonElement> {
  readonly children: React.ReactChild
  readonly className?: string
  readonly disabled?: boolean
  readonly onClick?: (ev?: React.SyntheticEvent<HTMLButtonElement>) => void
}
type ButtonFirstInterface = React.ComponentClass<ButtonFirstProps>
/**
 * Moves the slider to the beginning of the slides.
 */
declare const ButtonFirst: ButtonLastInterface



interface ButtonPlayProps extends React.HTMLAttributes<HTMLButtonElement> {
  readonly childrenPaused?: React.ReactNode
  readonly childrenPlaying?: React.ReactNode
  readonly className?: string
  readonly disabled?: boolean
  readonly onClick?: (ev?: React.SyntheticEvent<HTMLButtonElement>) => void
}
type ButtonPlayInterface = React.ComponentClass<ButtonPlayProps>
/**
 * Pressing this button causes the slides to automatically advance by CarouselProvider's step property after an interval determined by CarouselProvider's interval property.
 */
declare const ButtonPlay: ButtonPlayInterface

export {
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
}
