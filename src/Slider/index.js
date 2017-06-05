import Slider from './Slider';
import { WithStore } from '../';

export default WithStore(Slider, state => ({
  currentSlide: state.currentSlide,
  hasMasterSpinner: state.hasMasterSpinner,
  masterSpinnerErrorCount: state.masterSpinnerErrorCount,
  masterSpinnerSuccessCount: state.masterSpinnerSuccessCount,
  masterSpinnerSubscriptionCount: state.masterSpinnerSubscriptionCount,
  slideTrayWidth: state.slideTrayWidth,
  slideWidth: state.slideWidth,
  visibleSlides: state.visibleSlides,
}));
