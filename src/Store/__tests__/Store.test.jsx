import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Store from '../Store';
import CarouselProvider from '../../CarouselProvider';
import Slide from '../../Slide';
import components from '../../helpers/component-config';

configure({ adapter: new Adapter() });


describe('Store', () => {
  let carouselStore;
  beforeEach(() => {
    carouselStore = new Store({});
  });
  it('subscribe(func) should append a function to the list of suscriptions', () => {
    const func = () => null;
    expect(carouselStore.subscriptions.length).toBe(0);
    carouselStore.subscribe(func);
    expect(carouselStore.subscriptions.length).toBe(1);
    expect(carouselStore.subscriptions.indexOf(func)).toBe(0);
  });
  it('unsubscribe(func) should remove a function from the list of subscription', () => {
    const func = () => null;
    carouselStore.subscriptions = [
      func,
    ];
    carouselStore.unsubscribe(func);
    expect(carouselStore.subscriptions.length).toBe(0);
  });
  it('unsubscribe(func) should NOT remove any function from the list if func is not on the list', () => {
    const func = () => null;
    const notFunc = () => null;
    carouselStore.subscriptions = [
      func,
    ];
    carouselStore.unsubscribe(notFunc);
    expect(carouselStore.subscriptions.length).toBe(1);
    expect(carouselStore.subscriptions.indexOf(func)).toBe(0);
  });
  it('updateSubscribers() should call each function on the list', () => {
    const func1 = jest.fn();
    const func2 = jest.fn();
    carouselStore.subscribe(func1);
    carouselStore.subscribe(func2);
    carouselStore.updateSubscribers();
    expect(func1).toHaveBeenCalledTimes(1);
    expect(func2).toHaveBeenCalledTimes(1);
  });
  it('updateSubscribers() should call any supplied callback after it dispatching updates', () => {
    const callback = jest.fn();
    carouselStore.updateSubscribers(callback);
    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('subscribeMasterSpinner() append a src to the list of masterSpinnerSubscriptions', () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner('/home/bob.jpg');
    expect(carouselStore.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: false,
      error: false,
      complete: false,
    });
  });
  it('masterSpinnerSuccess() should set masterSpinnerSubscriptions[src].success and masterSpinnerSubscriptions[src].complete to true', () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner('/home/bob.jpg');
    expect(carouselStore.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: false,
      error: false,
      complete: false,
    });
    carouselStore.masterSpinnerSuccess('/home/bob.jpg');
    expect(carouselStore.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: true,
      error: false,
      complete: true,
    });
  });
  it('masterSpinnerError() should set masterSpinnerSubscriptions[src].error and masterSpinnerSubscriptions[src].complete to true', () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner('/home/bob.jpg');
    expect(carouselStore.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: false,
      error: false,
      complete: false,
    });
    carouselStore.masterSpinnerError('/home/bob.jpg');
    expect(carouselStore.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: false,
      error: true,
      complete: true,
    });
  });
  it('subscribeMasterSpinner() should not append a duplicate listener for the same image src', () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner('/home/bob.jpg');
    carouselStore.subscribeMasterSpinner('/home/bob.jpg');
    expect(carouselStore.masterSpinnerSubscriptions['/home/bob.jpg']).toEqual({
      success: false,
      error: false,
      complete: false,
    });
  });
  it('unsubscribeMasterSpinner() should not remove anything but the supplied src', () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner('/home/bob.jpg');
    carouselStore.subscribeMasterSpinner('/home/poo.jpg');
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({
      '/home/bob.jpg': { success: false, error: false, complete: false },
      '/home/poo.jpg': { success: false, error: false, complete: false },
    });
    expect(carouselStore.unsubscribeMasterSpinner('/home/bob.jpg')).toBe(true);
    expect(carouselStore.unsubscribeMasterSpinner('/home/bob.jpg')).toBe(false);
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({
      '/home/poo.jpg': { success: false, error: false, complete: false },
    });
  });
  it('isMasterSpinnerFinished() should return false if every image is not complete', () => {
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({});
    carouselStore.subscribeMasterSpinner('/home/bob.jpg');
    carouselStore.subscribeMasterSpinner('/home/poo.jpg');
    expect(carouselStore.masterSpinnerSubscriptions).toEqual({
      '/home/bob.jpg': { success: false, error: false, complete: false },
      '/home/poo.jpg': { success: false, error: false, complete: false },
    });
    expect(carouselStore.isMasterSpinnerFinished()).toBe(false);
    carouselStore.masterSpinnerSuccess('/home/bob.jpg');
    expect(carouselStore.isMasterSpinnerFinished()).toBe(false);
    carouselStore.masterSpinnerError('/home/poo.jpg');
    expect(carouselStore.isMasterSpinnerFinished()).toBe(true);
  });
});

describe('WithStore', () => {
  it('should remove itself from the subscribe list in the carouselStore when unmounted', () => {
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
    const spy = jest.spyOn(instance.carouselStore, 'unsubscribe');
    wrapper.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
