import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import clone from 'clone';
import ButtonFirst from '../ButtonFirst';
import components from '../../helpers/component-config';



let props;

describe('<ButtonFirst />', () => {
  beforeEach(() => {
    props = clone(components.ButtonFirst.props);
  });
  it('should render', () => {
    render(<ButtonFirst {...props} />);
    expect(screen.getByRole('button', { name: 'first' })).toBeInTheDocument();
  });
  it('should be disabled if the currentSlide is 0', () => {
    const newProps = Object.assign({}, props, { currentSlide: 0 });
    render(<ButtonFirst {...newProps} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('should be disabled if the disabled prop is set manually, regardless of currentSlide', () => {
    render(<ButtonFirst {...props} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('should set the currentSlide to 0 when clicked', () => {
    render(<ButtonFirst {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.carouselStore.getStoreState().currentSlide).toBe(0);
  });
  it('should call an onClick function passed as a prop', () => {
    const onClick = jest.fn();
    const newProps = Object.assign({}, props, { onClick });
    render(<ButtonFirst {...newProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('should pause autoplay when clicked', () => {
    render(<ButtonFirst {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.carouselStore.getStoreState().isPlaying).toBe(false);
  });
});
