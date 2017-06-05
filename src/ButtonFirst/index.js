import ButtonFirst from './ButtonFirst';
import { WithStore } from '../';

export default WithStore(ButtonFirst, state => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
}));
