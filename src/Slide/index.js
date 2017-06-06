import Slide from './Slide';
import { WithStore } from '../';

export default WithStore(Slide, state => ({
  currentSlide: state.currentSlide,
  orientation: state.orientation,
  slideSize: state.slideSize,
  visibleSlides: state.visibleSlides,
}));
