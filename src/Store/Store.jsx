import deepMerge from 'deepmerge';
import deepFreeze from 'deep-freeze';

const DEFAULT_STATE = {
  masterSpinnerFinished: false,
};

const Store = class Store {
  constructor(initialState) {
    this.state = deepFreeze(deepMerge(DEFAULT_STATE, initialState));
    this.subscriptions = [];
    this.masterSpinnerSubscriptions = {};
    this.setStoreState = this.setStoreState.bind(this);
    this.getStoreState = this.getStoreState.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.updateSubscribers = this.updateSubscribers.bind(this);
    this.subscribeMasterSpinner = this.subscribeMasterSpinner.bind(this);
    this.unsubscribeMasterSpinner = this.unsubscribeMasterSpinner.bind(this);
    this.unsubscribeAllMasterSpinner = this.unsubscribeAllMasterSpinner.bind(this);
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

  subscribeMasterSpinner(src) {
    const index = Object.keys(this.masterSpinnerSubscriptions).indexOf(src);
    if (index === -1) {
      this.masterSpinnerSubscriptions[src] = {
        success: false,
        error: false,
        complete: false,
      };
    }
  }

  unsubscribeMasterSpinner(src) {
    const index = Object.keys(this.masterSpinnerSubscriptions).indexOf(src);
    if (index === -1) {
      return false;
    }
    this.setMasterSpinnerFinished();
    return delete this.masterSpinnerSubscriptions[src];
  }

  unsubscribeAllMasterSpinner() {
    this.masterSpinnerSubscriptions = {};
    this.setMasterSpinnerFinished();
  }

  masterSpinnerSuccess(src) {
    this.masterSpinnerSubscriptions[src].success = true;
    this.masterSpinnerSubscriptions[src].complete = true;
    this.setMasterSpinnerFinished();
  }

  masterSpinnerError(src) {
    this.masterSpinnerSubscriptions[src].error = true;
    this.masterSpinnerSubscriptions[src].complete = true;
    this.setMasterSpinnerFinished();
  }

  setMasterSpinnerFinished() {
    this.setStoreState({
      masterSpinnerFinished: this.isMasterSpinnerFinished(),
    });
  }

  isMasterSpinnerFinished() {
    // console.log('MASTER SPINNER SUBSCRIPTIONS', this.masterSpinnerSubscriptions);
    return !Object.keys(this.masterSpinnerSubscriptions).find(
      src => this.masterSpinnerSubscriptions[src].complete !== true,
    );
  }
};

export default Store;
