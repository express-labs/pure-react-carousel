import React from 'react';
import { createStore, combineReducers } from 'redux';
import { Provider } from 'react-redux';
import demoReducer from './redux/demo-dux';
import Example7 from './Example7';


// create a redux store to store application state
const store = createStore(combineReducers(demoReducer));

export default (
  <Provider store={store}>
    <Example7 />
  </Provider>
);
