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
    this.setState = this.setState.bind(this);
    this.getState = this.getState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.subscribeMasterSpinner = this.subscribeMasterSpinner.bind(this);
    this.masterSpinnerSuccess = this.masterSpinnerSuccess.bind(this);
    this.masterSpinnerError = this.masterSpinnerError.bind(this);
  }

  setState(newState, cb) {
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
    if (typeof cb === 'function') cb(this.getState());
  }

  subscribeMasterSpinner() {
    this.setState({
      masterSpinnerSubscriptionCount: this.state.masterSpinnerSubscriptionCount + 1,
    });
  }

  masterSpinnerSuccess() {
    this.setState({
      masterSpinnerSuccessCount: this.state.masterSpinnerSuccessCount + 1,
    });
  }

  masterSpinnerError() {
    this.setState({
      masterSpinnerErrorCount: this.state.masterSpinnerErrorCount + 1,
    });
  }
};

export default Store;
