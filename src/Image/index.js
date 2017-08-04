import Image from './Image';
import WithStore from '../Store/WithStore';

export default WithStore(Image, state => ({
  hasMasterSpinner: state.hasMasterSpinner,
  orientation: state.orientation,
}));
