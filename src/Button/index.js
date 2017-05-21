import Button from './Button';
import { WithStore } from '../';

export default WithStore(Button, state => ({ demo: state.demo }));
