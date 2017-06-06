import Slider from './Slider';
import { WithStore } from '../';

export default WithStore(Slider, state => ({
  currentSlide: state.currentSlide,
  hasMasterSpinner: state.hasMasterSpinner,
  height: state.height,
  masterSpinnerErrorCount: state.masterSpinnerErrorCount,
  masterSpinnerSubscriptionCount: state.masterSpinnerSubscriptionCount,
  masterSpinnerSuccessCount: state.masterSpinnerSuccessCount,
  orientation: state.orientation,
  slideTraySize: state.slideTraySize,
  slideSize: state.slideSize,
  totalSlides: state.totalSlides,
  touchEnabled: state.touchEnabled,
  visibleSlides: state.visibleSlides,
}));
