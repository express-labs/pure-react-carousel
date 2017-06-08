import ButtonFirst from './ButtonFirst';
import WithStore from '../Store/WithStore';

export default WithStore(ButtonFirst, state => ({
  currentSlide: state.currentSlide,
  totalSlides: state.totalSlides,
}));
