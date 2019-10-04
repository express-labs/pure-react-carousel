import ButtonNext from './ButtonNext';
import WithStore from '../Store/WithStore';

export default WithStore(ButtonNext, state => ({
  currentSlide: state.currentSlide,
  infiniteLoop: state.infiniteLoop,
  step: state.step,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));
