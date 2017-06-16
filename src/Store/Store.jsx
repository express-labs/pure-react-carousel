import deepMerge from 'deepmerge';
import deepFreeze from 'deep-freeze';

const DEFAULT_STATE = {
  masterSpinnerSubscriptionCount: 0,
  masterSpinnerErrorCount: 0,
  masterSpinnerSuccessCount: 0,
};

const Store = class Store {
  constructor(initialState) {
    this.state = deepFreeze(deepMerge(DEFAULT_STATE, initialState));
    this.subscriptions = [];
    this.setStoreState = this.setStoreState.bind(this);
    this.getStoreState = this.getStoreState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.subscribeMasterSpinner = this.subscribeMasterSpinner.bind(this);
    this.masterSpinnerSuccess = this.masterSpinnerSuccess.bind(this);
    this.masterSpinnerError = this.masterSpinnerError.bind(this);
  }

  setStoreState(newState, cb) {
    this.state = deepFreeze(deepMerge(this.state, newState));
    this.updateSubscribers(cb);
  }

  getStoreState() {
    return deepMerge({}, this.state);
  }

  subscribe(func) {
    this.subscriptions.push(func);
  }

  unsubscribe(func) {
    const index = this.subscriptions.indexOf(func);
    if (index !== -1) this.subscriptions.splice(index, 1);
  }

  updateSubscribers(cb) {
    this.subscriptions.forEach(func => func());
    if (typeof cb === 'function') cb(this.getStoreState());
  }

  subscribeMasterSpinner() {
    this.setStoreState({
      masterSpinnerSubscriptionCount: this.state.masterSpinnerSubscriptionCount + 1,
    });
  }

  masterSpinnerSuccess() {
    this.setStoreState({
      masterSpinnerSuccessCount: this.state.masterSpinnerSuccessCount + 1,
    });
  }

  masterSpinnerError() {
    this.setStoreState({
      masterSpinnerErrorCount: this.state.masterSpinnerErrorCount + 1,
    });
  }
};

export default Store;
