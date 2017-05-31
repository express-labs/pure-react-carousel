import Slide from './Slide';
import { WithStore } from '../';

export default WithStore(Slide, state => ({
  slideWidth: state.slideWidth,
  visibleSlides: state.visibleSlides,
  currentSlide: state.currentSlide,
}));
