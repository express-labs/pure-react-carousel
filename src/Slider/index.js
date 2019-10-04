import Slider from './Slider';
import WithStore from '../Store/WithStore';

export default WithStore(Slider, state => ({
  currentSlide: state.currentSlide,
  disableAnimation: state.disableAnimation,
  disableKeyboard: state.disableKeyboard,
  dragEnabled: state.dragEnabled,
  dragStep: state.dragStep,
  hasMasterSpinner: state.hasMasterSpinner,
  interval: state.interval,
  infiniteLoop: state.infiniteLoop,
  isPageScrollLocked: state.isPageScrollLocked,
  isPlaying: state.isPlaying,
  lockOnWindowScroll: state.lockOnWindowScroll,
  masterSpinnerFinished: state.masterSpinnerFinished,
  naturalSlideHeight: state.naturalSlideHeight,
  naturalSlideWidth: state.naturalSlideWidth,
  orientation: state.orientation,
  playDirection: state.playDirection,
  privateUnDisableAnimation: state.privateUnDisableAnimation,
  slideSize: state.slideSize,
  slideTraySize: state.slideTraySize,
  step: state.step,
  totalSlides: state.totalSlides,
  touchEnabled: state.touchEnabled,
  visibleSlides: state.visibleSlides,
}));
