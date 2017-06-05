import DotGroup from './DotGroup';
import { WithStore } from '../';

export default WithStore(DotGroup, state => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
  visibleSlides: state.visibleSlides,
}));
