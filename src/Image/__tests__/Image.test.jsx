import React from 'react';
import { shallow, mount } from 'enzyme';
import ReactTestUtils from 'react-dom/test-utils'; // ES6
import components from '../../helpers/component-config';
import { ERROR } from '../../helpers/index';
import Image from '../Image';
import Store from '../../Store/Store';

const util = require('util')

const { props } = components.Image;

describe('<Image />', () => {
  it('should render', () => {
    const wrapper = mount(<Image {...props} />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should make a call to store.subscribeMasterSpinner() if props.hasMasterSpinner is true', () => {
    const spy = jest.spyOn(props.store, 'subscribeMasterSpinner');
    expect(spy).not.toHaveBeenCalled();
    shallow(<Image {...props} hasMasterSpinner />);
    expect(spy).toHaveBeenCalled();
  });
  it('should call any passed in onLoad after the image loads', () => {
    const onLoad = jest.fn();
    expect(onLoad).not.toHaveBeenCalled();
    mount(<Image {...props} onLoad={onLoad} />);
    expect(onLoad).toHaveBeenCalled();
  });
  it('should call any passed in onError after an image load error', () => {
    const onError = jest.fn();
    mount(<Image {...props} src="poo.bad" onError={onError} />);
    expect(onError).toHaveBeenCalled();
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
    wrapper.setState({ imageStatus: 'error' });
    expect(renderError).toHaveBeenCalledTimes(1);
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
});
