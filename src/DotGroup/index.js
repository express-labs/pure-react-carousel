import DotGroup from './DotGroup';
import WithStore from '../Store/WithStore';

export default WithStore(DotGroup, state => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));
