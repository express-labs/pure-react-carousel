import React from 'react';
import { shallow, mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import clone from 'clone';
import components from '../../helpers/component-config';
import { ERROR } from '../../helpers/index';
import Image from '../Image';

configure({ adapter: new Adapter() });


let props;

describe('<Image />', () => {
  beforeEach(() => {
    props = clone(components.Image.props);
  });
  it('should render', () => {
    const wrapper = mount(<Image {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should make a call to carouselStore.subscribeMasterSpinner() if props.hasMasterSpinner is true', () => {
    const spy = jest.spyOn(props.carouselStore, 'subscribeMasterSpinner');
    expect(spy).not.toHaveBeenCalled();
    mount(<Image {...props} hasMasterSpinner />);
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should make a call to carouselStore.unsubscribeMasterSpinner() if props.hasMasterSpinner is true and the component will unmount', () => {
    const spy = jest.spyOn(props.carouselStore, 'unsubscribeMasterSpinner');
    expect(spy).not.toHaveBeenCalled();
    const wrapper = mount(<Image {...props} hasMasterSpinner />);
    wrapper.unmount();
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should NOT make a call to carouselStore.unsubscribeMasterSpinner() if props.hasMasterSpinner is false and the component will unmount', () => {
    const spy = jest.spyOn(props.carouselStore, 'unsubscribeMasterSpinner');
    expect(spy).not.toHaveBeenCalled();
    const wrapper = mount(<Image {...props} />);
    wrapper.unmount();
    expect(spy).not.toHaveBeenCalled();
  });
  it('should call any passed-in onLoad after the image loads.', () => {
    const onLoad = jest.fn();
    expect(onLoad).not.toHaveBeenCalled();
    mount(<Image {...props} onLoad={onLoad} />);
    expect(onLoad).toHaveBeenCalled();
  });
  it('should call any passed-in onError if an image load fails.', () => {
    const onError = jest.fn();
    const wrapper = mount(<Image {...props} src="crap.junk" onError={onError} />);
    const instance = wrapper.instance();
    const event = new UIEvent('error');
    // simulate a load error
    instance.image.dispatchEvent(event);
    wrapper.update();
    expect(onError).toHaveBeenCalled();
  });
  it('should call the default onError if an image load fails and there is no custom onError.', () => {
    const wrapper = mount(<Image {...props} src="crap.junk" />);
    const instance = wrapper.instance();
    const event = new UIEvent('error');
    // simulate a load error
    instance.image.dispatchEvent(event);
    wrapper.update();
    expect(wrapper.find('div').hasClass('imageError')).toBe(true);
  });
  it('should call the default onError if an image load fails and there is no custom onError.', () => {
    const wrapper = mount(<Image {...props} src="crap.junk" />);
    const instance = wrapper.instance();
    const event = new UIEvent('error');
    // simulate a load error
    instance.image.dispatchEvent(event);
    wrapper.update();
    expect(wrapper.find('div').hasClass('imageError')).toBe(true);
  });
  it('should render the default error with the class "carousel__image--with-background" if isBgImage === true', () => {
    const newProps = Object.assign({}, props, { tag: 'div' });
    const wrapper = mount(<Image {...newProps} src="crap.junk" isBgImage />);
    // simulate a load error
    wrapper.setState({ imageStatus: 'error' });
    wrapper.update();
    expect(wrapper.find('div').hasClass('carousel__image--with-background')).toBe(true);
  });
  it('should render with class carousel__image--with-background when isBgImage prop is true', () => {
    const wrapper = mount(<Image {...props} tag="div" isBgImage />);
    expect(wrapper.find('div').hasClass('carousel__image--with-background')).toBe(true);
  });
  it('should throw an error if you try to use isBgImage on an img tag', () => {
    const mock = jest.fn();
    global.console.error = mock;
    shallow(<Image {...props} isBgImage />);
    expect(mock).toHaveBeenCalledTimes(1);
    mock.mockRestore();
  });
  it('should call a custom renderLoading method if supplied as a prop', () => {
    const renderLoading = jest.fn(() => <span>Loading</span>);
    mount(<Image {...props} renderLoading={renderLoading} />);
    expect(renderLoading).toHaveBeenCalledTimes(1);
  });
  it('should call a custom renderError method if supplied as a prop and image load fails', () => {
    const renderError = jest.fn(() => <span>Error</span>);
    const wrapper = mount(<Image {...props} renderError={renderError} />);
    wrapper.setState({ imageStatus: ERROR });
    expect(renderError).toHaveBeenCalledTimes(1);
  });
  it('should call carouselStore.masterSpinnerError if image load error and hasMasterSpinner was true', () => {
    const masterSpinnerError = jest.fn();
    const wrapper = mount(<Image {...props} hasMasterSpinner />);
    const instance = wrapper.instance();
    const event = new UIEvent('error');
    props.carouselStore.masterSpinnerError = masterSpinnerError;
    // simulate a load error
    instance.image.dispatchEvent(event);
    expect(masterSpinnerError).toHaveBeenCalledTimes(1);
  });
  it('should throw an error if state.imageStatus is not LOADING, SUCCESS, or ERROR', () => {
    const wrapper = mount(<Image {...props} />);
    expect(() => {
      wrapper.setState({ imageStatus: 'poo' });
    }).toThrow();
  });
  it('should give set class carousel__image--with-background when error and isBgImage is true', () => {
    const renderError = jest.fn(() => <span>Error</span>);
    const wrapper = mount(<Image {...props} renderError={renderError} />);
    wrapper.setState({ imageStatus: 'error' });
    expect(renderError).toHaveBeenCalledTimes(1);
  });
  it('if the image src changes, we need to make a new image element and, if hasMasterSpinner === true, subscribe the master spinner', () => {
    const wrapper = shallow(<Image {...props} hasMasterSpinner />);
    const instance = wrapper.instance();
    const spy = jest.spyOn(instance, 'initImage');
    wrapper.setProps({ src: 'foo.jpg' });
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it('should call componentWillUnmount and remove some event listeners', () => {
    // need to call mount to get initImage to fire.
    const wrapper = mount(<Image {...props} hasMasterSpinner />);
    const instance = wrapper.instance();
    const spyRemoveEventListener = jest.spyOn(instance.image, 'removeEventListener');
    wrapper.unmount();
    expect(spyRemoveEventListener).toHaveBeenCalledTimes(2);
  });
});
