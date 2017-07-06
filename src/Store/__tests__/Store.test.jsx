import { mount } from 'enzyme';
import React from 'react';
import Store from '../Store';
import CarouselProvider from '../../CarouselProvider';
import Slide from '../../Slide';
import components from '../../helpers/component-config';

describe('Store', () => {
  let store;
  beforeEach(() => {
    store = new Store({});
  });
  it('subscribe(func) should append a function to the list of suscriptions', () => {
    const func = () => null;
    expect(store.subscriptions.length).toBe(0);
    store.subscribe(func);
    expect(store.subscriptions.length).toBe(1);
    expect(store.subscriptions.indexOf(func)).toBe(0);
  });
  it('unsubscribe(func) should remove a function from the list of subscription', () => {
    const func = () => null;
    store.subscriptions = [
      func,
    ];
    store.unsubscribe(func);
    expect(store.subscriptions.length).toBe(0);
  });
  it('unsubscribe(func) should NOT remove any function from the list if func is not on the list', () => {
    const func = () => null;
    const notFunc = () => null;
    store.subscriptions = [
      func,
    ];
    store.unsubscribe(notFunc);
    expect(store.subscriptions.length).toBe(1);
    expect(store.subscriptions.indexOf(func)).toBe(0);
  });
  it('updateSubscribers() should call each function on the list', () => {
    const func1 = jest.fn();
    const func2 = jest.fn();
    store.subscribe(func1);
    store.subscribe(func2);
    store.updateSubscribers();
    expect(func1).toHaveBeenCalledTimes(1);
    expect(func2).toHaveBeenCalledTimes(1);
  });
  it('updateSubscribers() should call any supplied callback after it dispatching updates', () => {
    const callback = jest.fn();
    store.updateSubscribers(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('subscribeMasterSpinner() should increment the masterSpinnerSubscriptionCount', () => {
    expect(store.state.masterSpinnerSubscriptionCount).toBe(0);
    store.subscribeMasterSpinner();
    expect(store.state.masterSpinnerSubscriptionCount).toBe(1);
    expect(store.state.masterSpinnerErrorCount).toBe(0);
    expect(store.state.masterSpinnerSuccessCount).toBe(0);
  });
  it('masterSpinnerSuccess() should increment the masterSpinnerSuccessCount', () => {
    expect(store.state.masterSpinnerSubscriptionCount).toBe(0);
    store.masterSpinnerSuccess();
    expect(store.state.masterSpinnerSubscriptionCount).toBe(0);
    expect(store.state.masterSpinnerErrorCount).toBe(0);
    expect(store.state.masterSpinnerSuccessCount).toBe(1);
  });
  it('masterSpinnerError() should increment the masterSpinnerErrorCount', () => {
    expect(store.state.masterSpinnerErrorCount).toBe(0);
    store.masterSpinnerError();
    expect(store.state.masterSpinnerSubscriptionCount).toBe(0);
    expect(store.state.masterSpinnerErrorCount).toBe(1);
    expect(store.state.masterSpinnerSuccessCount).toBe(0);
  });
});

describe('WithStore', () => {
  it('should remove itself from the subscribe list in the store when unmounted', () => {
    const { props } = components.CarouselProvider;
    const wrapper = mount((
      <CarouselProvider {...props}>
        <Slide
          currentSlide={0}
          index={0}
          naturalSlideWidth={100}
          naturalSlideHeight={100}
          orientation="horizontal"
          slideSize={100}
          totalSlides={1}
          visibleSlides={1}
        >
          Hello
        </Slide>
      </CarouselProvider>
    ));
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance.store, 'unsubscribe');
    wrapper.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
