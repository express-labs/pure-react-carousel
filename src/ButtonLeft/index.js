import ButtonLeft from './ButtonLeft';
import { WithStore } from '../';

export default WithStore(ButtonLeft, state => ({
  visibleSlides: state.visibleSlides,
  totalSlides: state.totalSlides,
}));
