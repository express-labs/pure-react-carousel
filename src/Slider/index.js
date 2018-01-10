import Slider from './Slider';
import WithStore from '../Store/WithStore';

export default WithStore(Slider, state => ({
  currentSlide: state.currentSlide,
  hasMasterSpinner: state.hasMasterSpinner,
  masterSpinnerFinished: state.masterSpinnerFinished,
  naturalSlideHeight: state.naturalSlideHeight,
  naturalSlideWidth: state.naturalSlideWidth,
  disableAnimation: state.disableAnimation,
  lockOnWindowScroll: state.lockOnWindowScroll,
  orientation: state.orientation,
  slideSize: state.slideSize,
  slideTraySize: state.slideTraySize,
  totalSlides: state.totalSlides,
  touchEnabled: state.touchEnabled,
  visibleSlides: state.visibleSlides,
}));
