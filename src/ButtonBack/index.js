import ButtonBack from './ButtonBack';
import WithStore from '../Store/WithStore';

export default WithStore(ButtonBack, state => ({
  currentSlide: state.currentSlide,
  step: state.step,
  totalSlides: state.totalSlides,
  infinite: state.infinite,
  visibleSlides: state.visibleSlides,
}));
