import ButtonPlay from './ButtonPlay';
import WithStore from '../Store/WithStore';

export default WithStore(ButtonPlay, state => ({
  isPlaying: state.isPlaying,
}));
