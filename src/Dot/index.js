import Dot from './Dot';
import WithStore from '../Store/WithStore';

export default WithStore(Dot, state => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));
