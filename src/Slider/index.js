import Slider from './Slider';
import { WithStore } from '../';

export default WithStore(Slider, state => ({
  currentSlide: state.currentSlide,
  hasMasterSpinner: state.hasMasterSpinner,
  masterSpinnerErrorCount: state.masterSpinnerErrorCount,
  masterSpinnerSubscriptionCount: state.masterSpinnerSubscriptionCount,
  masterSpinnerSuccessCount: state.masterSpinnerSuccessCount,
  naturalSlideHeight: state.naturalSlideHeight,
  naturalSlideWidth: state.naturalSlideWidth,
  orientation: state.orientation,
  slideSize: state.slideSize,
  slideTraySize: state.slideTraySize,
  totalSlides: state.totalSlides,
  touchEnabled: state.touchEnabled,
  visibleSlides: state.visibleSlides,
}));
