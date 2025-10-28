import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import clone from 'clone';
import components from '../../helpers/component-config';
import Dot from '../Dot';
import Store from '../../Store/Store';



let props;

describe('<Dot />', () => {
  beforeEach(() => {
    props = clone(components.Dot.props);
  });
  it('should render', () => {
    render(<Dot {...props} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
  it('should add the dotSelected class when selected', () => {
    const newProps = Object.assign({}, props, { selected: true });
    render(<Dot {...newProps} />);
    expect(screen.getByRole('button')).toHaveClass('dotSelected');
  });
  it('should add the carousel__dot--selected class when selected', () => {
    const newProps = Object.assign({}, props, { selected: true });
    render(<Dot {...newProps} />);
    expect(screen.getByRole('button')).toHaveClass('carousel__dot--selected');
  });
  it('should call any supplied onClick as a callback', () => {
    const onClick = jest.fn();
    const newProps = Object.assign({}, props, { onClick });
    render(<Dot {...newProps} />);
    expect(onClick).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('should update carouselStore.state.currentSlide with the value of slide', () => {
    const onClick = jest.fn();
    const carouselStore = new Store(Object.assign({}, props, { currentSlide: 0 }));
    const newProps = Object.assign({}, props, { onClick, carouselStore });
    render(<Dot {...newProps} />);
    expect(carouselStore.state.currentSlide).toBe(0);
    fireEvent.click(screen.getByRole('button'));
    expect(carouselStore.state.currentSlide).toEqual(props.slide);
  });
  it('should keep the last slide pegged to the right of the viewport if visibleSlides > 1', () => {
    render(<Dot {...props} slide={10} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.carouselStore.getStoreState().currentSlide).toBe(8);
  });
  it('should not override disabled if disabled prop is set to false manually', () => {
    render(<Dot {...props} slide={10} disabled={false} />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
  it('should not override disabled if disabled prop is set to true manually', () => {
    render(<Dot {...props} slide={0} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('should pause autoplay when clicked', () => {
    render(<Dot {...props} slide={10} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.carouselStore.getStoreState().isPlaying).toBe(false);
  });
});
