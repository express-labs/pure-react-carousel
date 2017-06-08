import ButtonNext from './ButtonNext';
import WithStore from '../Store/WithStore';

export default WithStore(ButtonNext, state => ({
  currentSlide: state.currentSlide,
  step: state.step,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));
