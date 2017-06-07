import Image from './Image';
import { WithStore } from '../';

export default WithStore(Image, state => ({
  hasMasterSpinner: state.hasMasterSpinner,
  naturalSlideHeight: state.naturalSlideHeight,
  naturalSlideWidth: state.naturalSlideWidth,
  orientation: state.orientation,
}));
