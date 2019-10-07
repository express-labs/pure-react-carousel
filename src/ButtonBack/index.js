import ButtonBack from './ButtonBack';
import WithStore from '../Store/WithStore';

export default WithStore(ButtonBack, state => ({
  currentSlide: state.currentSlide,
  infiniteLoop: state.infiniteLoop,
  step: state.step,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));
