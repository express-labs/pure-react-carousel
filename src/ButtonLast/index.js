import ButtonLast from './ButtonLast';
import WithStore from '../Store/WithStore';

export default WithStore(ButtonLast, state => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));
