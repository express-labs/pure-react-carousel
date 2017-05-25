import deepMerge from 'deepmerge';
import deepFreeze from 'deep-freeze';

const DEFAULT_STATE = {};

const Store = class Store {
  constructor(initialState) {
    this.state = deepFreeze(deepMerge(DEFAULT_STATE, initialState));
    this.subscriptions = [];
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
  }

  setState(newState, cb = () => {}) {
    this.state = deepFreeze(deepMerge(this.state, newState));
    this.updateSubscribers(cb);
  }

  getState() {
    return deepMerge({}, this.state);
  }

  subscribe(func) {
    this.subscriptions.push(func);
  }

  updateSubscribers(cb) {
    this.subscriptions.forEach(func => func());
    if (typeof cb === 'function') cb();
  }
};

export default Store;
