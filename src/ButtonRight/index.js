import ButtonRight from './ButtonRight';
import { WithStore } from '../';

export default WithStore(ButtonRight, state => ({
  currentSlide: state.currentSlide,
}));
