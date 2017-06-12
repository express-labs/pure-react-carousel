import ButtonBack from './ButtonBack';
import WithStore from '../Store/WithStore';

export default WithStore(ButtonBack, state => ({
  currentSlide: state.currentSlide,
  step: state.step,
}));
