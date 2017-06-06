import Slider from './Slider';
import { WithStore } from '../';

export default WithStore(Slider, state => ({
  currentSlide: state.currentSlide,
  hasMasterSpinner: state.hasMasterSpinner,
  masterSpinnerErrorCount: state.masterSpinnerErrorCount,
  masterSpinnerSubscriptionCount: state.masterSpinnerSubscriptionCount,
  masterSpinnerSuccessCount: state.masterSpinnerSuccessCount,
  orientation: state.orientation,
  slideTrayWidth: state.slideTrayWidth,
  slideSize: state.slideSize,
  totalSlides: state.totalSlides,
  touchEnabled: state.touchEnabled,
  visibleSlides: state.visibleSlides,
}));
