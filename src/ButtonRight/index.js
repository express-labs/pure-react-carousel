import ButtonRight from './ButtonRight';
import { WithStore } from '../';

export default WithStore(ButtonRight, state => ({
  visibleSlides: state.visibleSlides,
  totalSlides: state.totalSlides,
}));
