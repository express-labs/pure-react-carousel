import React from 'react';
import { shallow } from 'enzyme';
import Store from '../Store';
import WithStore from '../WithStore';

describe('Store', () => {
  it('updateSubscribers should call any supplied callback after it dispatching updates', () => {
    const callback = jest.fn();
    const store = new Store({});
    store.updateSubscribers(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe('WithStore', () => {
  it('the default mapStateToProps function should be called if not mapping and state to props', () => {
    const basic = <div>Hello</div>;
    const Wrapped = WithStore(basic);
  });
});
