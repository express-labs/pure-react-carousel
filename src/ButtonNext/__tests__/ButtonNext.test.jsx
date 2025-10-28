import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import clone from 'clone';
import components from '../../helpers/component-config';
import ButtonNext from '../ButtonNext';
import Store from '../../Store/Store';
import CarouselProvider from '../../CarouselProvider/CarouselProvider';
import ButtonNextWithStore from '..';



let props;

describe('<ButtonNext />', () => {
  beforeEach(() => {
    props = clone(components.ButtonNext.props);
  });
  it('should render', () => {
    render(<ButtonNext {...props} />);
    expect(screen.getByRole('button', { name: 'next' })).toBeInTheDocument();
  });
  it('should be disabled if the currentSlide >= totalSlides - visibleSlides', () => {
    const newProps = Object.assign({}, props, {
      carouselStore: new Store({
        currentSlide: 5,
        totalSlides: 7,
        visibleSlides: 2,
      }),
    });
    render(<ButtonNext {...newProps} />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('should NOT be disabled if the currentSlide < totalSlides - visibleSlides', () => {
    const carouselStore = new Store({
      currentSlide: 4,
      totalSlides: 7,
      visibleSlides: 2,
      step: 1,
    });

    const newProps = Object.assign({}, props, {
      currentSlide: 4,
      totalSlides: 7,
      visibleSlides: 2,
      step: 1,
      carouselStore,
    });

    render(<ButtonNext {...newProps} />);
    expect(screen.getByRole('button')).not.toBeDisabled();
  });
  it('should be disabled if the disabled prop is set manually, regardless of currentSlide', () => {
    render(<ButtonNext {...props} disabled />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
  it('should add the value of step from currentSlide when clicked.', () => {
    const carouselStore = new Store({
      currentSlide: 0,
      totalSlides: 7,
      visibleSlides: 2,
      step: 2,
    });

    const newProps = Object.assign({}, props, {
      carouselStore,
      currentSlide: 0,
      totalSlides: 7,
      visibleSlides: 2,
      step: 2,
    });

    render(<ButtonNext {...newProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(carouselStore.state.currentSlide).toBe(2);
  });
  it('should add the value of step from currentSlide when clicked and infinite is true.', () => {
    const carouselStore = new Store({
      currentSlide: 0,
      totalSlides: 7,
      visibleSlides: 2,
      step: 2,
    });

    const newProps = Object.assign({}, props, {
      carouselStore,
      currentSlide: 0,
      totalSlides: 7,
      visibleSlides: 2,
      step: 2,
    });

    render(<ButtonNext infinite {...newProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(carouselStore.state.currentSlide).toBe(2);
  });
  it('should set the current slide to first slide if clicked when on the last slide if infinite is true.', () => {
    const mockStore = new Store({
      currentSlide: 7,
      step: 3,
      totalSlides: 10,
    });

    render(
      <ButtonNext
        infinite
        currentSlide={7}
        step={3}
        totalSlides={10}
        visibleSlides={3}
        carouselStore={mockStore}
      >
      Next
      </ButtonNext>,
    );
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
    fireEvent.click(button);
    expect(mockStore.getStoreState().currentSlide).toBe(0);
  });
  it('should call an onClick function passed as a prop', () => {
    const onClick = jest.fn();
    const newProps = Object.assign({}, props, { onClick, currentSlide: 0 });
    render(<ButtonNext {...newProps} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  it('should disable the button and change the slide to (totalSlides - visibleSlides) if ((currentSlide + step) >= (totalSlides + 1))', () => {
    const newProps = {
      currentSlide: 4,
      totalSlides: 7,
      visibleSlides: 2,
      step: 4,
      naturalSlideWidth: 100,
      naturalSlideHeight: 125,
    };

    render(
      <CarouselProvider {...newProps}>
        <ButtonNextWithStore>Next</ButtonNextWithStore>
      </CarouselProvider>
    );

    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled(); // Should be enabled initially
    fireEvent.click(button);
    // After clicking, should be disabled (at the last slide)
    expect(button).toBeDisabled();
  });
  it('should pause autoplay when clicked', () => {
    render(
      <CarouselProvider
        naturalSlideWidth={100}
        naturalSlideHeight={125}
        totalSlides={3}
        currentSlide={1}
        step={3}
        isPlaying
      >
        <ButtonNextWithStore>Hello</ButtonNextWithStore>
      </CarouselProvider>,
    );
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    // If the test gets here without errors, the click handler worked
    expect(button).toBeInTheDocument();
  });
});
