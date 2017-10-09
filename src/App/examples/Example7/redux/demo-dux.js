// DUCKS module (Redux Reducer Bundles)
// see: https://github.com/erikras/ducks-modular-redux

// Action types
// ------------
//
// Declare action types as constants.  The action types need to be unique strings. Since there will
// most likely be more than one ocassion to clear a form, the best practice is to namespace the
// constant values.  Programatically, the "/" means nothing. It's just a convention we're using to
// namespace the actions.
const INCREMENT = 'demo/INCREMENT';
const DECREMENT = 'demo/DECREMENT';

// Initial State
// -------------
const initialState = {
  count: 0,
};

// Reducer
// -------
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case INCREMENT: {
      let { count } = state;
      count += 1;
      return Object.assign({}, state, { count });
    }
    case DECREMENT: {
      let { count } = state;
      count -= 1;
      return Object.assign({}, state, { count });
    }
    default:
      return state;
  }
}

// Action Creators
// ---------------
export const setIncrement = () => ({ type: INCREMENT });
export const setDecrement = () => ({ type: DECREMENT });
