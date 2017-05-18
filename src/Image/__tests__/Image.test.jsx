import React from 'react';
import EventEmitter from 'events';
import { render, mount } from 'enzyme';
import Image from '../';

class MyEmitter extends EventEmitter {}

global.console.error = jest.fn();

describe('<Image />', () => {
  it('should render', () => {
    const wrapper = mount(<Image src="./smile-05.jpg" />);
    expect(wrapper.exists()).toBe(true);
  });
  it('should require src property', () => {
    mount(<Image />);
    expect(global.console.error.mock.calls[0][0].replace(/[\n\s]+/g, ' ')).toBe('Warning: Failed prop type: The prop `src` is marked as required in `Image`, but its value is `undefined`. in Image');
  });
  it('should use a supplied renderLoading function', () => {
    const mockRenderLoading = jest.fn();
    mockRenderLoading.mockReturnValue(null);
    mount(<Image src="./smile-05.jpg" renderLoading={mockRenderLoading} />);
    expect(mockRenderLoading.mock.calls.length).toBe(1);
  });
  it('should call a supplied onLoad function', () => {
    const onLoad = jest.fn();
    onLoad.mockReturnValue(null);
    mount(<Image src="./smile-05.jpg" onLoad={onLoad} />);
    expect(onLoad.mock.calls.length).toBe(1);
  });
  it('should call a supplied onError function', () => {
    const onError = jest.fn();
    onError.mockReturnValue(null);
    const wrapper = mount(<Image onError={onError} />);
    wrapper.instance().handleImageError({});
    expect(onError.mock.calls.length).toBe(1);
  });
  it('should call a supplied renderError function', () => {
    const mockRenderError = jest.fn();
    mockRenderError.mockReturnValue(null);
    const wrapper = mount(<Image renderError={mockRenderError} />);
    wrapper.instance().handleImageError({});
    expect(mockRenderError.mock.calls.length).toBe(1);
  });
  it('should throw an error if state.imageStatus is something besides SUCCESS, ERROR, LOADING', () => {
    const wrapper = mount(<Image />);
    expect(() => (wrapper.setState({ imageStatus: 'poo' }))).toThrow('unknown value for this.state.imageStatus');
  });
});
