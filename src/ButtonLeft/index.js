import ButtonLeft from './ButtonLeft';
import { WithStore } from '../';

export default WithStore(ButtonLeft, state => ({
  currentSlide: state.currentSlide,
}));
