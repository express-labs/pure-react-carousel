import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import demoReducer from './redux/demo-dux';
import Example7 from './Example7';


// create a redux store to store application state
/* eslint-disable no-underscore-dangle */
const store = createStore(
  combineReducers({ demoReducer }),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */

export default () => (
  <Provider store={store}>
    <Example7 />
  </Provider>
);
