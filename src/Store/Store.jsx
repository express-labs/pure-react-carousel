import deepMerge from 'deepmerge';
import deepFreeze from 'deep-freeze';

const DEFAULT_STATE = {

};

export default class Store {
  constructor(initialState) {
    this.state = deepFreeze(deepMerge(DEFAULT_STATE, initialState));
    this.subscriptions = [];
  }

  setState(newState) {
    this.state = deepFreeze(deepMerge(this.state, newState));
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
}
