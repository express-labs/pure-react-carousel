import deepMerge from 'deepmerge';
import deepFreeze from 'deep-freeze';

const DEFAULT_STATE = {

};

const Store = class Store {
  constructor(initialState) {
    this.state = deepFreeze(deepMerge(DEFAULT_STATE, initialState));
    this.subscriptions = [];
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
  }

  setState(newState) {
    this.state = deepFreeze(deepMerge(this.state, newState));
    this.updateSubscribers();
  }

  getState() {
    return deepMerge({}, this.state);
  }

  subscribe(func) {
    this.subscriptions.push(func);
  }

  updateSubscribers() {
    this.subscriptions.forEach(func => func());
  }
};


export default Store;
