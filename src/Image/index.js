import Image from './Image';
import { WithStore } from '../';

export default WithStore(Image, state => ({
  hasMasterSpinner: state.hasMasterSpinner,
}));
