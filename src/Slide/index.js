import Slide from './Slide';
import { WithStore } from '../';

export default WithStore(Slide, state => ({
  slideSize: state.slideSize,
  visibleSlides: state.visibleSlides,
  currentSlide: state.currentSlide,
}));
