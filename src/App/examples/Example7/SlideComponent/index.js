import { connect } from 'react-redux';
import SlideComponent from './SlideComponent';
import { setIncrement, setDecrement } from '../redux/demo-dux';

export default connect(
  state => ({ count: state.rootReducer.count }),
  { setIncrement, setDecrement },
)(SlideComponent);
