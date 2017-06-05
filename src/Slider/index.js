import Slider from './Slider';
import { WithStore } from '../';

export default WithStore(Slider, state => ({
  currentSlide: state.currentSlide,
  hasMasterSpinner: state.hasMasterSpinner,
  imageErrorCount: state.imageErrorCount,
  imageSuccessCount: state.imageSuccessCount,
  slideTrayWidth: state.slideTrayWidth,
  slideWidth: state.slideWidth,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));
