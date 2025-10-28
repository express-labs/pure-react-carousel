import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import clone from 'clone';
import ButtonLast from '../ButtonLast';
import Store from '../../Store/Store';
import components from '../../helpers/component-config';



let props;

describe('<ButtonLast />', () => {
  beforeEach(() => {
    props = clone(components.ButtonLast.props);
  });
  it('should render', () => {
    render(<ButtonLast {...props} />);
    expect(screen.getByRole('button', { name: 'last' })).toBeInTheDocument();
  });
  it('should be disabled if the currentSlide is equal to totalSlides', () => {
    const newProps = Object.assign({}, props, { currentSlide: props.totalSlides });
    render(<ButtonLast {...newProps} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('should be disabled if the disabled prop is set manually, regardless of currentSlide', () => {
    render(<ButtonLast {...props} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('should set the currentSlide to totalSlides - 1 when clicked', () => {
    render(<ButtonLast {...props} />);
    fireEvent.click(screen.getByRole('button'));
    expect(props.carouselStore.getStoreState().currentSlide).toBe(props.totalSlides - 1);
  });
  it('should call an onClick function passed as a prop', () => {
    const onClick = jest.fn();
    const newProps = Object.assign({}, props, { onClick });
    render(<ButtonLast {...newProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('should set the button to disabled when (visibleSlides > 1) and (currentSlide > totalSlides - visibleSlides)', () => {
    const newProps = Object.assign({}, props, {
      currentSlide: 5,
      carouselStore: new Store({
        currentSlide: 5,
        totalSlides: 7,
        visibleSlides: 2,
      }),
      totalSlides: 7,
      visibleSlides: 2,
    });
    render(<ButtonLast {...newProps} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('should NOT set the button to disabled when (visibleSlides > 1) and (currentSlide <= totalSlides - visibleSlides)', () => {
    const newProps = Object.assign({}, props, {
      currentSlide: 4,
      carouselStore: new Store({
        currentSlide: 4,
        totalSlides: 7,
        visibleSlides: 2,
      }),
      totalSlides: 7,
      visibleSlides: 2,
    });
    render(<ButtonLast {...newProps} />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
  it('should pause autoplay when clicked', () => {
    const newProps = Object.assign({}, props, {
      carouselStore: new Store({
        isPlaying: true,
      }),
    });
    render(<ButtonLast {...newProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(newProps.carouselStore.getStoreState().isPlaying).toBe(false);
  });
});
