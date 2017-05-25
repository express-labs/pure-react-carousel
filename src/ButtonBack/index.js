import ButtonBack from './ButtonBack';
import { WithStore } from '../';

export default WithStore(ButtonBack, state => ({
  currentSlide: state.currentSlide,
  step: state.step,
}));
