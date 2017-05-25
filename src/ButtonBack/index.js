import ButtonBack from './ButtonBack';
import { WithStore } from '../';

export default WithStore(ButtonBack, state => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
  step: state.step,
}));
