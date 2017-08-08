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
  it('subscribeMasterSpinner() append a src to the list of masterSpinnerSubscriptions', () => {
    expect(store.masterSpinnerSubscriptions).toEqual({});
    store.subscribeMasterSpinner('/home/bob.jpg');
    expect(store.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: false,
      error: false,
      complete: false,
    });
  });
  it('masterSpinnerSuccess() should set masterSpinnerSubscriptions[src].success and masterSpinnerSubscriptions[src].complete to true', () => {
    expect(store.masterSpinnerSubscriptions).toEqual({});
    store.subscribeMasterSpinner('/home/bob.jpg');
    expect(store.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: false,
      error: false,
      complete: false,
    });
    store.masterSpinnerSuccess('/home/bob.jpg');
    expect(store.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: true,
      error: false,
      complete: true,
    });
  });
  it('masterSpinnerError() should set masterSpinnerSubscriptions[src].error and masterSpinnerSubscriptions[src].complete to true', () => {
    expect(store.masterSpinnerSubscriptions).toEqual({});
    store.subscribeMasterSpinner('/home/bob.jpg');
    expect(store.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: false,
      error: false,
      complete: false,
    });
    store.masterSpinnerError('/home/bob.jpg');
    expect(store.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: false,
      error: true,
      complete: true,
    });
  });
  it('subscribeMasterSpinner() should not append a duplicate listener for the same image src', () => {
    expect(store.masterSpinnerSubscriptions).toEqual({});
    store.subscribeMasterSpinner('/home/bob.jpg');
    store.subscribeMasterSpinner('/home/bob.jpg');
    expect(store.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: false,
      error: false,
      complete: false,
    });
  });
  it('unsubscribeMasterSpinner() should not remove anything but the supplied src', () => {
    expect(store.masterSpinnerSubscriptions).toEqual({});
    store.subscribeMasterSpinner('/home/bob.jpg');
    store.subscribeMasterSpinner('/home/poo.jpg');
    expect(store.masterSpinnerSubscriptions).toEqual({
      '/home/bob.jpg': { success: false, error: false, complete: false },
      '/home/poo.jpg': { success: false, error: false, complete: false },
    });
    expect(store.unsubscribeMasterSpinner('/home/bob.jpg')).toBe(true);
    expect(store.unsubscribeMasterSpinner('/home/bob.jpg')).toBe(false);
    expect(store.masterSpinnerSubscriptions).toEqual({
      '/home/poo.jpg': { success: false, error: false, complete: false },
    });
  });
  it('isMasterSpinnerFinished() should return false if every image is not complete', () => {
    expect(store.masterSpinnerSubscriptions).toEqual({});
    store.subscribeMasterSpinner('/home/bob.jpg');
    store.subscribeMasterSpinner('/home/poo.jpg');
    expect(store.masterSpinnerSubscriptions).toEqual({
      '/home/bob.jpg': { success: false, error: false, complete: false },
      '/home/poo.jpg': { success: false, error: false, complete: false },
    });
    expect(store.isMasterSpinnerFinished()).toBe(false);
    store.masterSpinnerSuccess('/home/bob.jpg');
    expect(store.isMasterSpinnerFinished()).toBe(false);
    store.masterSpinnerError('/home/poo.jpg');
    expect(store.isMasterSpinnerFinished()).toBe(true);
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
