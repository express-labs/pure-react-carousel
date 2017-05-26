import Slider from './Slider';
import { WithStore } from '../';

export default WithStore(Slider, state => ({
  currentSlide: state.currentSlide,
  slideTrayWidth: state.slideTrayWidth,
  slideWidth: state.slideWidth,
  visibleSlides: state.visibleSlides,
}));
